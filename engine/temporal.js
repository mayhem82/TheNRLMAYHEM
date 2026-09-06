'use strict';

const CHECKPOINTS=[['T-24h',1440],['T-3h',180],['T-60m',60],['T-10m',10]];
const CAPTURE_STATES=['PENDING','CAPTURED_IN_WINDOW','CAPTURED_LATE_BEFORE_KICKOFF','MISSED_NOT_CAPTURED'];
const LIFECYCLE_STATES=['UPCOMING','MATCH_WINDOW','RESULT_VERIFICATION_PENDING','VERIFIED_RESULT'];

function ms(v){const n=new Date(v).getTime();if(!Number.isFinite(n))throw new Error('INVALID_TIMESTAMP');return n}
function minutesToKickoff(kickoff,now=new Date()){return (ms(kickoff)-ms(now))/60000}
function dueAt(kickoff,minutes){return new Date(ms(kickoff)-minutes*60000).toISOString()}
function captureState({due,kickoff,captured_at,now=new Date()}){
  const d=ms(due),k=ms(kickoff),n=ms(now);
  if(captured_at){const c=ms(captured_at);if(c>=k)throw new Error('PREMATCH_CAPTURE_AT_OR_AFTER_KICKOFF');return c<=d?'CAPTURED_IN_WINDOW':'CAPTURED_LATE_BEFORE_KICKOFF'}
  if(n<d)return'PENDING';
  if(n<k)return'PENDING';
  return'MISSED_NOT_CAPTURED';
}
function lifecycleState({kickoff,result_verified=false,now=new Date(),verification_grace_minutes=180}){
  if(result_verified)return'VERIFIED_RESULT';
  const delta=ms(now)-ms(kickoff);
  if(delta<0)return'UPCOMING';
  if(delta<=verification_grace_minutes*60000)return'MATCH_WINDOW';
  return'RESULT_VERIFICATION_PENDING';
}
function checkpointState(kickoff,now=new Date()){
  const m=minutesToKickoff(kickoff,now);
  if(m<0)return{checkpoint:'POST',minutes_to_kickoff:m};
  for(const [name,min] of CHECKPOINTS)if(m>=min)return{checkpoint:name,minutes_to_kickoff:m};
  return{checkpoint:'T-10m',minutes_to_kickoff:m};
}
function dueSince(kickoff,previousRun,currentRun=new Date()){
  const k=ms(kickoff),p=ms(previousRun),c=ms(currentRun);
  return CHECKPOINTS.filter(([,m])=>{const t=k-m*60000;return t>p&&t<=c}).map(([checkpoint,minutes])=>({checkpoint,minutes_before_kickoff:minutes,due_at:new Date(k-minutes*60000).toISOString()}));
}
function reconcileCheckpoints({kickoff,checkpoints,now=new Date()}){
  return checkpoints.map(c=>({...c,status:c.status&&c.status!=='PENDING'?c.status:captureState({due:c.due,kickoff,captured_at:c.captured_at||null,now})}));
}
module.exports={CHECKPOINTS,CAPTURE_STATES,LIFECYCLE_STATES,minutesToKickoff,dueAt,captureState,lifecycleState,checkpointState,dueSince,reconcileCheckpoints};