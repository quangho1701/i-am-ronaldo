import { env } from "cloudflare:workers";
import { applyCommand, initialDocument, DomainError, type State, type Command, type DocumentData } from "./domain";
type Row={document:string;active_session:string|null;revision:number};
const owner="personal";
export function database():D1Database {if(!env.DB)throw new Error("Database binding unavailable.");return env.DB;}
function decode(row:Row):State{return {...JSON.parse(row.document),activeSession:row.active_session?JSON.parse(row.active_session):null,revision:row.revision,serverNow:Date.now()};}
export async function readState():Promise<State>{
 const db=database();
 const legacy=await db.prepare("SELECT owner_id FROM workspaces WHERE owner_id != ? LIMIT 2").bind(owner).all<{owner_id:string}>();
 if(legacy.results.length)throw new DomainError("Existing workspaces need a checked migration before this app can open.",503);
 await db.prepare("INSERT OR IGNORE INTO workspaces (owner_id, document, revision) VALUES (?, ?, 0)").bind(owner,JSON.stringify(initialDocument())).run();
 const row=await db.prepare("SELECT document, active_session, revision FROM workspaces WHERE owner_id = ?").bind(owner).first<Row>();
 if(!row)throw new Error("Workspace unavailable.");return decode(row);
}
export async function mutate(requestId:string,revision:number,command:Command):Promise<State>{
 const db=database();
 const fingerprint=JSON.stringify({revision,command});
 const receipt=await db.prepare("SELECT fingerprint FROM mutation_receipts WHERE owner_id = ? AND request_id = ?").bind(owner,requestId).first<{fingerprint:string}>();
 if(receipt){if(receipt.fingerprint!==fingerprint)throw new DomainError("Request identifier was already used for another action.",409);return readState();}
 const old=await readState();
 if(old.revision!==revision)throw new DomainError("Your tasks changed on another device. The latest version has been loaded; please try again.",409);
 const next=applyCommand(old,command,Date.now());
 const {activeSession,revision:nextRevision}=next;
 const document:DocumentData={tasks:next.tasks,templates:next.templates,baskets:next.baskets,history:next.history,preferences:next.preferences};
 // D1 batch is transactional. The compare-and-swap and receipt share a transaction.
 // One owner row has one nullable active_session slot: two clients cannot create two active timers.
 const result=await db.batch([
 db.prepare("UPDATE workspaces SET document = ?, active_session = ?, revision = ?, last_mutation = ? WHERE owner_id = ? AND revision = ?").bind(JSON.stringify(document),activeSession?JSON.stringify(activeSession):null,nextRevision,requestId,owner,revision),
 db.prepare("INSERT OR IGNORE INTO mutation_receipts (owner_id, request_id, fingerprint, revision) SELECT owner_id, ?, ?, revision FROM workspaces WHERE owner_id = ? AND revision = ? AND last_mutation = ?").bind(requestId,fingerprint,owner,nextRevision,requestId)
 ]);
 if(result[0].meta.changes!==1){
 const replay=await db.prepare("SELECT fingerprint FROM mutation_receipts WHERE owner_id = ? AND request_id = ?").bind(owner,requestId).first<{fingerprint:string}>();
 if(!replay||replay.fingerprint!==fingerprint)throw new DomainError("Your tasks changed on another device. Please try again.",409);
 }
 return readState();
}
