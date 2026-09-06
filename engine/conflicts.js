'use strict';

const RESOLUTION_STATES=['OPEN','RESOLVED','UNRESOLVED'];
function detectPairConflicts(a,b){
  const out=[];
  if(a.fixture_id&&b.fixture_id&&a.fixture_id===b.fixture_id){
    if(a.player_id&&b.player_id&&a.player_id===b.player_id&&a.availability&&b.availability&&a.availability!==b.availability)out.push('INJURY_STATUS_CONFLICT');
    if(a.lineup_state&&b.lineup_state&&a.lineup_state!==b.lineup_state)out.push('EXPECTED_VS_CONFIRMED_LINEUP');
    if(a.claim&&b.claim&&a.claim!==b.claim&&a.source_id!==b.source_id)out.push('SOURCE_VS_SOURCE');
    if(a.official===true&&b.official!==true&&a.claim&&b.claim&&a.claim!==b.claim)out.push('OFFICIAL_VS_SPECIALIST_REPORT');
    if(a.market_direction&&b.claim_direction&&a.market_direction!==b.claim_direction)out.push('MARKET_VS_TEAM_NEWS');
  }
  return out;
}
function makeConflict(type,a,b){return{conflict_id:`${type}:${a.record_id}:${b.record_id}`,type,record_ids:[a.record_id,b.record_id],resolution_state:'OPEN',resolved_to:null,resolved_by_source_snapshot_id:null,resolved_at:null,resolution_event_id:null}}
function resolveConflict(conflict,{resolved_to,source_snapshot_id,resolved_at,event_id}){
  if(!conflict||!RESOLUTION_STATES.includes(conflict.resolution_state))throw new Error('INVALID_CONFLICT');
  if(!resolved_to||!source_snapshot_id||!resolved_at||!event_id)throw new Error('RESOLUTION_EVIDENCE_REQUIRED');
  return{...conflict,resolution_state:'RESOLVED',resolved_to,resolved_by_source_snapshot_id:source_snapshot_id,resolved_at,resolution_event_id:event_id};
}
function detectAll(records){const conflicts=[];for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++)for(const type of detectPairConflicts(records[i],records[j]))conflicts.push(makeConflict(type,records[i],records[j]));return conflicts}
module.exports={RESOLUTION_STATES,detectPairConflicts,makeConflict,resolveConflict,detectAll};