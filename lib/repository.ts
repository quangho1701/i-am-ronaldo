import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { applyCommand, initialDocument, DomainError, type State, type Command, type DocumentData } from "./domain";
type Row={document:string;active_session:string|null;revision:number};
const owner="personal";
let client:NeonQueryFunction<false,false>|null=null;
export function database(){if(!client){const url=process.env.DATABASE_URL;if(!url)throw new Error("Database unavailable.");client=neon(url);}return client;}
function decode(row:Row):State{return {...JSON.parse(row.document),activeSession:row.active_session?JSON.parse(row.active_session):null,revision:row.revision,serverNow:Date.now()};}
async function receiptFingerprint(requestId:string){
 const rows=await database()`SELECT fingerprint FROM mutation_receipts WHERE owner_id = ${owner} AND request_id = ${requestId}` as {fingerprint:string}[];
 return rows[0]?.fingerprint;
}
export async function readState():Promise<State>{
 const sql=database();
 const legacy=await sql`SELECT owner_id FROM workspaces WHERE owner_id <> ${owner} LIMIT 2`;
 if(legacy.length)throw new DomainError("Existing workspaces need a checked migration before this app can open.",503);
 await sql`INSERT INTO workspaces (owner_id, document, revision) VALUES (${owner}, ${JSON.stringify(initialDocument())}, 0) ON CONFLICT (owner_id) DO NOTHING`;
 const [row]=await sql`SELECT document, active_session, revision FROM workspaces WHERE owner_id = ${owner}` as Row[];
 if(!row)throw new Error("Workspace unavailable.");return decode(row);
}
export async function mutate(requestId:string,revision:number,command:Command):Promise<State>{
 const sql=database();
 const fingerprint=JSON.stringify({revision,command});
 const receipt=await receiptFingerprint(requestId);
 if(receipt!==undefined){if(receipt!==fingerprint)throw new DomainError("Request identifier was already used for another action.",409);return readState();}
 const old=await readState();
 if(old.revision!==revision)throw new DomainError("Your tasks changed on another device. The latest version has been loaded; please try again.",409);
 const next=applyCommand(old,command,Date.now());
 const {activeSession,revision:nextRevision}=next;
 const document:DocumentData={tasks:next.tasks,templates:next.templates,baskets:next.baskets,history:next.history,preferences:next.preferences};
 // The compare-and-swap and receipt share one transaction.
 // One owner row has one nullable active_session slot: two clients cannot create two active timers.
 const [updated]=await sql.transaction(tx=>[
 tx`UPDATE workspaces SET document = ${JSON.stringify(document)}, active_session = ${activeSession?JSON.stringify(activeSession):null}, revision = ${nextRevision}, last_mutation = ${requestId} WHERE owner_id = ${owner} AND revision = ${revision} RETURNING owner_id`,
 tx`INSERT INTO mutation_receipts (owner_id, request_id, fingerprint, revision) SELECT owner_id, ${requestId}, ${fingerprint}, revision FROM workspaces WHERE owner_id = ${owner} AND revision = ${nextRevision} AND last_mutation = ${requestId} ON CONFLICT DO NOTHING`
 ]);
 if(updated.length!==1){
 const replay=await receiptFingerprint(requestId);
 if(replay!==fingerprint)throw new DomainError("Your tasks changed on another device. Please try again.",409);
 }
 return readState();
}
