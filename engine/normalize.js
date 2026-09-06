'use strict';

function text(v=''){return String(v).trim().replace(/\s+/g,' ')}
function key(v=''){return text(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function team(v=''){const aliases={'manly':'Sea Eagles','manly-sea-eagles':'Sea Eagles','penrith':'Panthers','penrith-panthers':'Panthers','new-zealand-warriors':'Warriors','nz-warriors':'Warriors','wests-tigers':'Wests Tigers','st-george-illawarra-dragons':'Dragons','parramatta-eels':'Eels','melbourne-storm':'Storm','cronulla-sharks':'Sharks','cronulla-sutherland-sharks':'Sharks','north-queensland-cowboys':'Cowboys','canberra-raiders':'Raiders','brisbane-broncos':'Broncos','gold-coast-titans':'Titans','south-sydney-rabbitohs':'Rabbitohs','sydney-roosters':'Roosters','newcastle-knights':'Knights','canterbury-bulldogs':'Bulldogs','canterbury-bankstown-bulldogs':'Bulldogs'};return aliases[key(v)]||text(v)}
function evidenceState(v='UNKNOWN'){const x=String(v).toUpperCase();return ['VERIFIED','UNVERIFIED','CONTRADICTED','SIGNAL','UNKNOWN'].includes(x)?x:'UNKNOWN'}
function normalizeObservation(o={}){
  if(!o.captured_at)throw new Error('CAPTURE_TIME_REQUIRED');
  const t=Date.parse(o.captured_at);if(!Number.isFinite(t))throw new Error('CAPTURE_TIME_INVALID');
  return {...o,team:o.team?team(o.team):o.team,opponent:o.opponent?team(o.opponent):o.opponent,source_name:text(o.source_name),source_class:key(o.source_class).toUpperCase().replace(/-/g,'_'),evidence_state:evidenceState(o.evidence_state||o.classification),captured_at:new Date(t).toISOString()};
}
module.exports={text,key,team,evidenceState,normalizeObservation};