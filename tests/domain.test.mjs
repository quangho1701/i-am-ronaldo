import test from 'node:test';
import assert from 'node:assert/strict';
import { initialDocument, applyCommand, commandSchema, elapsedMs, weeklySummary, midnight, TIME_ZONE, formatTimer } from '../lib/domain.ts';
import { hashSecret, exchangeSecret, validCookie, sameOrigin, YEAR_SECONDS } from '../lib/access.ts';
const fresh = () => ({ ...initialDocument(), activeSession:null, revision:0, serverNow:0 });
const create = (state, basketId='homework', title='') => applyCommand(state,commandSchema.parse({type:'task.create',title,day:'2026-09-28',basketId}),0);
test('blank title, independent templates, validation, and empty initial tasks', () => {
  let s=fresh(); assert.equal(s.tasks.length,0);
  s=create(s); assert.equal(s.tasks[0].title,'Focus session');
  s=applyCommand(s,{type:'template.add',id:'analysis-reading',day:'2026-09-28'},0);
  s=applyCommand(s,{type:'template.edit',id:'analysis-reading',title:'Changed',firstAction:'New',basketId:'homework'},0);
  assert.equal(s.tasks[1].title,'Real Analysis: textbook reading');
  assert.equal(commandSchema.safeParse({type:'task.create',day:'2026-02-30',basketId:'homework'}).success,false);
});
test('pause, resume, finish, undo, and a fresh session preserve exact historical time', () => {
  let s=create(fresh()); const id=s.tasks[0].id;
  s=applyCommand(s,{type:'session.start',taskId:id,switchCurrent:false},1000);
  const session=s.activeSession.id;
  s=applyCommand(s,{type:'session.pause',id:session},6000);
  assert.equal(elapsedMs(s.activeSession,900000),5000);
  s=applyCommand(s,{type:'session.resume',id:session},11000);
  s=applyCommand(s,{type:'session.finish',id:session},16000);
  assert.equal(elapsedMs(s.history[0],999999),10000); assert.equal(s.activeSession,null);
  s=applyCommand(s,{type:'task.undo',id},17000);
  assert.equal(s.tasks[0].completedAt,null); assert.equal(s.history.length,1);
  s=applyCommand(s,{type:'session.start',taskId:id,switchCurrent:false},18000);
  assert.equal(elapsedMs(s.activeSession,18000),0);
  assert.equal(formatTimer(3661000),'01:01:01');
});
test('switch is atomic and basket snapshots survive task edits, dates, and archive', () => {
  let s=create(create(fresh()),'mathematics'); const [a,b]=s.tasks;
  s=applyCommand(s,{type:'session.start',taskId:a.id,switchCurrent:false},1000);
  assert.throws(()=>applyCommand(s,{type:'session.start',taskId:b.id,switchCurrent:false},2000));
  assert.throws(()=>applyCommand(s,{type:'task.edit',id:a.id,title:a.title,firstAction:'',day:a.day,basketId:'research'},2000));
  s=applyCommand(s,{type:'session.start',taskId:b.id,switchCurrent:true},3000);
  assert.equal(s.activeSession.taskId,b.id); assert.equal(s.history[0].outcome,'stopped');
  s=applyCommand(s,{type:'task.edit',id:a.id,title:'Renamed',firstAction:'',day:'2027-01-01',basketId:'research'},4000);
  s=applyCommand(s,{type:'task.archive',id:a.id},5000);
  assert.equal(s.history[0].basketId,'homework'); assert.equal(elapsedMs(s.history[0],90000),2000);
});
test('weekly clipping includes active and unfinished work, excludes pause, and divides midnight', () => {
  const boundary=midnight('2026-09-28',TIME_ZONE);
  let s=create(fresh());
  s=applyCommand(s,{type:'session.start',taskId:s.tasks[0].id,switchCurrent:false},boundary-60000);
  s=applyCommand(s,{type:'session.pause',id:s.activeSession.id},boundary+60000);
  s=applyCommand(s,{type:'session.resume',id:s.activeSession.id},boundary+120000);
  const prev=weeklySummary(s,'2026-09-21',boundary+180000), next=weeklySummary(s,'2026-09-28',boundary+180000);
  assert.equal(prev[0].ms,60000); assert.equal(next[0].ms,120000);
  assert.equal(next.reduce((sum,b)=>sum+b.ms,0),120000);
});
test('Indianapolis DST weeks have 167 and 169 hours', () => {
  assert.equal((midnight('2026-03-09',TIME_ZONE)-midnight('2026-03-02',TIME_ZONE))/3600000,167);
  assert.equal((midnight('2026-11-02',TIME_ZONE)-midnight('2026-10-26',TIME_ZONE))/3600000,169);
  assert.equal(weeklySummary(fresh(),'2026-03-02',0).reduce((sum,b)=>sum+b.ms,0),0);
});
test('secret exchange, cookie tampering, rotation, expiry, and cross-origin rejection', async () => {
  const secret='a'.repeat(43), hash=await hashSecret(secret), now=1800000000000;
  const cookie=await exchangeSecret(secret,hash,now);
  assert.equal(await validCookie(cookie,hash,now),true);
  assert.equal(await exchangeSecret('b'.repeat(43),hash,now),null);
  assert.equal(await validCookie(cookie,await hashSecret('c'.repeat(43)),now),false);
  assert.equal(await validCookie(cookie,hash,now+YEAR_SECONDS*1000),false);
  assert.equal(await validCookie(cookie.replace(/^./,'9'),hash,now),false);
  assert.equal(sameOrigin(new Request('https://example.com/api/command',{headers:{origin:'https://evil.example'}})),false);
  assert.equal(sameOrigin(new Request('https://example.com/api/command',{headers:{origin:'https://example.com'}})),true);
});
