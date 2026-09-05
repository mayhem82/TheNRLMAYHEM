'use strict';

function detectPairConflicts(a,b){
  const out=[];
  if(a.fixture_id && b.fixture_id && a.fixture_id===b.fixture_id){
    if(a.player_id && b.player_id && a.player_id===b.player_id && a.availability && b.availability && a.availability!==b.availability) out.push('INJURY_STATUS_CONFLICT');
    if(a.lineup_state && b.lineup_state && a.lineup_state!==b.lineup_state) out.push('EXPECTED_VS_CONFIRMED_LINEUP');
    if(a.claim && b.claim && a.claim!==b.claim && a.source_id!==b.source_id) out.push('SOURCE_VS_SOURCE');
    if(a.official===true && b.official!==true && a.claim && b.claim && a.claim!==b.claim) out.push('OFFICIAL_VS_SPECIALIST_REPORT');
    if(a.market_direction && b.claim_direction && a.market_direction!==b.claim_direction) out.push('MARKET_VS_TEAM_NEWS');
  }
  return out;
}
function detectAll(records){
  const conflicts=[];
  for(let i=0;i<records.length;i++) for(let j=i+1;j<records.length;j++) for(const type of detectPairConflicts(records[i],records[j])) conflicts.push({type,record_ids:[records[i].record_id,records[j].record_id],resolution:'UNRESOLVED'});
  return conflicts;
}
module.exports={detectPairConflicts,detectAll};