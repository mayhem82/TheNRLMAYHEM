'use strict';

const CHECKPOINTS=[['T-24H',1440],['T-3H',180],['T-60M',60],['T-10M',10],['KICKOFF',0]];
function minutesToKickoff(kickoff,now=new Date()){return (new Date(kickoff)-new Date(now))/60000}
function checkpointState(kickoff,now=new Date()){const m=minutesToKickoff(kickoff,now);if(m<0)return {checkpoint:'POST_MATCH_WINDOW',minutes_to_kickoff:m};for(const [name,min] of CHECKPOINTS){if(m>=min)return {checkpoint:name,minutes_to_kickoff:m}}return {checkpoint:'T-10M',minutes_to_kickoff:m}}
function dueSince(kickoff,previousRun,currentRun=new Date()){const k=new Date(kickoff).getTime();const p=new Date(previousRun).getTime();const c=new Date(currentRun).getTime();return CHECKPOINTS.filter(([,m])=>{const t=k-m*60000;return t>p&&t<=c}).map(([checkpoint,minutes])=>({checkpoint,minutes_before_kickoff:minutes,due_at:new Date(k-minutes*60000).toISOString()}))}
module.exports={CHECKPOINTS,minutesToKickoff,checkpointState,dueSince};