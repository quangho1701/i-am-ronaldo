import { z } from "zod";

export const TIME_ZONE = "America/Indiana/Indianapolis";
export type Basket = { id: string; name: string; color: string };
export type Task = { id: string; title: string; firstAction: string; day: string; basketId: string; order: number; completedAt: number | null; archived: boolean };
export type Template = { id: string; title: string; firstAction: string; basketId: string };
export type Segment = { start: number; end: number | null };
export type Session = { id: string; taskId: string; title: string; basketId: string; state: "running" | "paused" | "ended"; startedAt: number; endedAt: number | null; segments: Segment[]; outcome: "completed" | "stopped" | null };
export type Preferences = { timeZone: string; sound: boolean; keepAwake: boolean };
export type DocumentData = { tasks: Task[]; templates: Template[]; baskets: Basket[]; history: Session[]; preferences: Preferences };
export type State = DocumentData & { activeSession: Session | null; revision: number; serverNow: number };
export class DomainError extends Error { status: number; constructor(message: string, status = 400) { super(message); this.status = status; } }

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(d => { const t = new Date(d + "T12:00:00Z"); return Number.isFinite(t.valueOf()) && t.toISOString().slice(0,10) === d; }, "Choose a valid date.");
const id = z.string().min(1).max(100);
const title = z.string().trim().max(200).default("");
const firstAction = z.string().trim().max(500).default("");
const taskFields = { title, firstAction, day: date, basketId: id };
const templateFields = { title, firstAction, basketId: id };
export const commandSchema = z.discriminatedUnion("type", [
 z.object({ type: z.literal("task.create"), ...taskFields }),
 z.object({ type: z.literal("task.edit"), id, ...taskFields }),
 z.object({ type: z.literal("task.archive"), id }),
 z.object({ type: z.literal("task.undo"), id }),
 z.object({ type: z.literal("task.reorder"), ids: z.array(id).max(500), day: date }),
 z.object({ type: z.literal("template.create"), ...templateFields }),
 z.object({ type: z.literal("template.edit"), id, ...templateFields }),
 z.object({ type: z.literal("template.delete"), id }),
 z.object({ type: z.literal("template.add"), id, day: date }),
 z.object({ type: z.literal("basket.create"), name: z.string().trim().min(1).max(40), color: z.enum(["blue","purple","orange","green","pink","teal"]) }),
 z.object({ type: z.literal("basket.rename"), id, name: z.string().trim().min(1).max(40) }),
 z.object({ type: z.literal("session.start"), taskId: id, switchCurrent: z.boolean().default(false) }),
 z.object({ type: z.literal("session.pause"), id }),
 z.object({ type: z.literal("session.resume"), id }),
 z.object({ type: z.literal("session.finish"), id }),
 z.object({ type: z.literal("session.end"), id }),
 z.object({ type: z.literal("preferences.update"), sound: z.boolean(), keepAwake: z.boolean(), timeZone: z.string().max(100).refine(s => { try { new Intl.DateTimeFormat("en-US",{timeZone:s}); return true; } catch { return false; } }) }),
]);
export type Command = z.infer<typeof commandSchema>;
export const mutationSchema = z.object({ requestId: z.string().uuid(), revision: z.number().int().nonnegative(), command: commandSchema });

export function initialDocument(): DocumentData {
 return { tasks: [], baskets: [
 { id:"homework",name:"Homework",color:"blue" },
 { id:"engineering",name:"Software Engineering",color:"purple" },
 { id:"mathematics",name:"Mathematics",color:"orange" },
 { id:"research",name:"PhD Research",color:"green" }
 ], templates:[
 {id:"analysis-lecture",title:"Real Analysis: lecture segment",firstAction:"Open the lecture where I last stopped.",basketId:"mathematics"},
 {id:"analysis-reading",title:"Real Analysis: textbook reading",firstAction:"Read one definition and work through its example.",basketId:"mathematics"},
 {id:"analysis-homework",title:"Real Analysis: homework",firstAction:"Open the assignment and choose one problem.",basketId:"homework"},
 {id:"research-step",title:"Research: agreed next step",firstAction:"Open my research notes and pick up the next question.",basketId:"research"},
 {id:"ola-prep",title:"Ola: interview preparation",firstAction:"Choose one problem and write down an approach.",basketId:"engineering"}
 ],history:[],preferences:{timeZone:TIME_ZONE,sound:false,keepAwake:false} };
}

export function elapsedMs(session: Session, now: number): number {
 return session.segments.reduce((sum,s)=>sum+Math.max(0,(s.end ?? now)-s.start),0);
}
export function formatTimer(ms: number): string {
 const sec=Math.max(0,Math.floor(ms/1000)), h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60;
 return h ? `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}` : `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}
export function formatDuration(ms:number):string {
 const seconds=Math.max(0,Math.floor(ms/1000)), minutes=Math.floor(seconds/60), hours=Math.floor(minutes/60);
 if(hours) return `${hours}h ${minutes%60}m`;
 if(minutes) return `${minutes}m`;
 return `${seconds}s`;
}
export function localDate(now:number,zone:string=TIME_ZONE):string {
 const p=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
 const get=(t:string)=>p.find(x=>x.type===t)!.value;
 return `${get("year")}-${get("month")}-${get("day")}`;
}
export function addDays(date:string,n:number):string { return new Date(Date.parse(date+"T12:00:00Z")+n*86400000).toISOString().slice(0,10); }
export function mondayOf(date:string):string { const dow=new Date(date+"T12:00:00Z").getUTCDay(); return addDays(date,-((dow+6)%7)); }
export function midnight(date:string,zone:string):number {
 const target=Date.parse(date+"T00:00:00Z");
 let guess=target;
 const f=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
 for(let i=0;i<4;i++){const parts=f.formatToParts(guess); const get=(t:string)=>Number(parts.find(x=>x.type===t)!.value); const actual=Date.UTC(get("year"),get("month")-1,get("day"),get("hour"),get("minute"),get("second"));const diff=target-actual;guess+=diff;if(diff===0)break;}
 return guess;
}
export function weeklySummary(state: State, week:string, now:number) {
 const start=midnight(mondayOf(week),state.preferences.timeZone), end=midnight(addDays(mondayOf(week),7),state.preferences.timeZone);
 const sessions=[...state.history,...(state.activeSession?[state.activeSession]:[])];
 return state.baskets.map(basket=>{
  const items=sessions.filter(s=>s.basketId===basket.id).map(s=>({...s,weekMs:s.segments.reduce((sum,p)=>sum+Math.max(0,Math.min(p.end??now,end)-Math.max(p.start,start)),0)})).filter(s=>s.weekMs>0);
  return {...basket,ms:items.reduce((sum,s)=>sum+s.weekMs,0),items:items.sort((a,b)=>b.startedAt-a.startedAt)};
 });
}
export function taskTime(state:State,taskId:string,now:number):number {
 return [...state.history,...(state.activeSession?[state.activeSession]:[])].filter(s=>s.taskId===taskId).reduce((sum,s)=>sum+elapsedMs(s,now),0);
}

export function applyCommand(current:State, command:Command, now:number, newId:()=>string=()=>crypto.randomUUID()):State {
 const s=structuredClone(current);
 const task=(id:string)=>{const t=s.tasks.find(t=>t.id===id&&!t.archived);if(!t)throw new DomainError("This task is no longer available.",404);return t;};
 const template=(id:string)=>{const t=s.templates.find(t=>t.id===id);if(!t)throw new DomainError("This template is no longer available.",404);return t;};
 const basket=(id:string)=>{if(!s.baskets.some(b=>b.id===id))throw new DomainError("Choose an existing basket.");};
 const active=(id:string)=>{if(!s.activeSession||s.activeSession.id!==id)throw new DomainError("This session changed on another device. Refresh and try again.",409);return s.activeSession;};
 const closeSegment=(session:Session)=>{const last=session.segments.at(-1);if(last&&last.end===null)last.end=Math.max(last.start,now);};
 const endSession=(outcome:"completed"|"stopped")=>{const a=s.activeSession!;closeSegment(a);a.state="ended";a.outcome=outcome;a.endedAt=now;s.history.push(a);s.activeSession=null;};
 const addTask=(fields:{title:string;firstAction:string;day:string;basketId:string})=>{basket(fields.basketId);s.tasks.push({id:newId(),title:fields.title||"Focus session",firstAction:fields.firstAction,day:fields.day,basketId:fields.basketId,order:Math.max(-1,...s.tasks.filter(t=>t.day===fields.day).map(t=>t.order))+1,completedAt:null,archived:false});};
 switch(command.type){
  case "task.create":addTask(command);break;
  case "task.edit":{const t=task(command.id);basket(command.basketId);if(s.activeSession?.taskId===t.id&&t.basketId!==command.basketId)throw new DomainError("End this session before changing its basket.");Object.assign(t,{title:command.title||"Focus session",firstAction:command.firstAction,day:command.day,basketId:command.basketId});break;}
  case "task.archive":{if(s.activeSession?.taskId===command.id)throw new DomainError("End this session before deleting its task.");task(command.id).archived=true;break;}
  case "task.undo":task(command.id).completedAt=null;break;
  case "task.reorder":{const list=s.tasks.filter(t=>!t.archived&&t.completedAt===null&&t.day===command.day);if(new Set(command.ids).size!==list.length||command.ids.length!==list.length||list.some(t=>!command.ids.includes(t.id)))throw new DomainError("The task list changed. Refresh and try again.",409);command.ids.forEach((id,i)=>task(id).order=i);break;}
  case "template.create":basket(command.basketId);s.templates.push({id:newId(),title:command.title||"Focus session",firstAction:command.firstAction,basketId:command.basketId});break;
  case "template.edit":{basket(command.basketId);Object.assign(template(command.id),{title:command.title||"Focus session",firstAction:command.firstAction,basketId:command.basketId});break;}
  case "template.delete":template(command.id);s.templates=s.templates.filter(t=>t.id!==command.id);break;
  case "template.add":{const t=template(command.id);addTask({...t,day:command.day});break;}
  case "basket.create":if(s.baskets.some(b=>b.name.toLowerCase()===command.name.toLowerCase()))throw new DomainError("A basket with this name already exists.");s.baskets.push({id:newId(),name:command.name,color:command.color});break;
  case "basket.rename":{const b=s.baskets.find(b=>b.id===command.id);if(!b)throw new DomainError("Basket not found.",404);if(s.baskets.some(b=>b.id!==command.id&&b.name.toLowerCase()===command.name.toLowerCase()))throw new DomainError("A basket with this name already exists.");b.name=command.name;break;}
  case "session.start":{const t=task(command.taskId);if(t.completedAt!==null)throw new DomainError("Reopen this task before starting again.");if(s.activeSession){if(s.activeSession.taskId===t.id)break;if(!command.switchCurrent)throw new DomainError("You already have an active session.",409);endSession("stopped");}s.activeSession={id:newId(),taskId:t.id,title:t.title,basketId:t.basketId,state:"running",startedAt:now,endedAt:null,segments:[{start:now,end:null}],outcome:null};break;}
  case "session.pause":{const a=active(command.id);if(a.state!=="running")throw new DomainError("This session is already paused.",409);closeSegment(a);a.state="paused";break;}
  case "session.resume":{const a=active(command.id);if(a.state!=="paused")throw new DomainError("This session is already running.",409);a.state="running";a.segments.push({start:now,end:null});break;}
  case "session.finish":{const a=active(command.id);task(a.taskId).completedAt=now;endSession("completed");break;}
  case "session.end":active(command.id);endSession("stopped");break;
  case "preferences.update":s.preferences={sound:command.sound,keepAwake:command.keepAwake,timeZone:command.timeZone};break;
 }
 s.revision=current.revision+1;s.serverNow=now;return s;
}
