import fs from 'node:fs';

const season = JSON.parse(fs.readFileSync('data/season-canonical-2026.json','utf8'));
const now = new Date().toISOString();

function parseLedger(text){
  return text.split('/').map(block=>{
    const p=block.indexOf(':');
    const round=Number(block.slice(0,p));
    const games=block.slice(p+1).split(';').map(row=>{
      const [home,score,away]=row.split('|');
      const m=String(score).match(/^(\d+)\s*[-–—]\s*(\d+)$/);
      if(!m) return {round,home,away,score,played:false};
      return {round,home,away,score,played:true,homeScore:+m[1],awayScore:+m[2]};
    });
    return {round,games};
  }).sort((a,b)=>a.round-b.round);
}

const signalDefinitions = [
  {
    id:'HOME_TEAM',version:'1.0.0',family:'VENUE_SIDE',
    rule:'Select the listed home team.',
    pre_match_basis:'Fixture home/away designation.',
    limitations:['Does not establish venue-specific home-ground advantage.']
  },
  {
    id:'PREMATCH_POINT_DIFFERENTIAL',version:'1.0.0',family:'STRUCTURAL_BASELINE',
    rule:'Select the team with the superior cumulative points-for minus points-against from completed prior rounds only; tie = NO_SELECTION.',
    pre_match_basis:'Only results from rounds earlier than the fixture round.',
    limitations:['Fixture-result reconstruction only; does not use ladder competition points or bye credits.']
  },
  {
    id:'PREVIOUS_MATCH_WINNER',version:'1.0.0',family:'RECENT_FORM',
    rule:'If exactly one team won its immediately previous completed match and the other did not, select the previous-match winner; otherwise NO_SELECTION.',
    pre_match_basis:'Immediately previous completed fixture for each team.',
    limitations:['No selection when both teams share the same prior result state or lack a prior match.']
  },
  {
    id:'RECENT3_MARGIN',version:'1.0.0',family:'RECENT_FORM',
    rule:'Once both teams have three prior completed matches, select the team with the superior mean points margin across its previous three matches; tie = NO_SELECTION.',
    pre_match_basis:'Three completed matches immediately preceding the fixture.',
    limitations:['Early-season fixtures are NO_SELECTION until both teams have three prior matches.']
  },
  {
    id:'WINNING_STREAK',version:'1.0.0',family:'RECENT_FORM',
    rule:'Select the team with the longer active winning streak when streak lengths differ and at least one is positive; otherwise NO_SELECTION.',
    pre_match_basis:'Consecutive wins from completed matches immediately before the fixture.',
    limitations:['Losing streak magnitude is deliberately not used in this version.']
  }
];

const rounds=parseLedger(season.ledger_compact);
const teams=new Map();
const state=t=>{
  if(!teams.has(t)) teams.set(t,{pf:0,pa:0,last:null,margins:[],winStreak:0});
  return teams.get(t);
};
const observations=[];

function actualWinner(g){
  if(g.homeScore>g.awayScore) return g.home;
  if(g.awayScore>g.homeScore) return g.away;
  return 'DRAW';
}
function grade(selection,winner){
  if(!selection) return 'NO_SELECTION';
  if(winner==='DRAW') return 'INCORRECT';
  return selection===winner?'CORRECT':'INCORRECT';
}
function add(signal,g,raw,selection){
  const winner=actualWinner(g);
  observations.push({
    fixture_id:`R${String(g.round).padStart(2,'0')}-${g.home.replaceAll(' ','_')}-${g.away.replaceAll(' ','_')}`,
    round:g.round,home:g.home,away:g.away,verified_score:g.score,verified_winner:winner,
    signal_id:signal.id,signal_version:signal.version,raw_pre_match:raw,
    selection:selection||null,grade:grade(selection,winner),
    temporal_status:'RECONSTRUCTED_FROM_PRIOR_VERIFIED_RESULTS',
    source_id:'SEASON-CANONICAL-2026',
    source_snapshot:season.snapshot,
    leakage_control:'USES_ONLY_FIXTURE_IDENTITY_AND/OR RESULTS_FROM EARLIER_ROUNDS'
  });
}

for(const r of rounds){
  for(const g of r.games){
    if(!g.played) continue;
    const h=state(g.home), a=state(g.away);
    const s0=signalDefinitions[0];
    add(s0,g,{home_designation:g.home},g.home);

    const s1=signalDefinitions[1];
    const hd=h.pf-h.pa, ad=a.pf-a.pa;
    add(s1,g,{home_point_differential:hd,away_point_differential:ad},hd===ad?null:(hd>ad?g.home:g.away));

    const s2=signalDefinitions[2];
    let prev=null;
    if(h.last && a.last && h.last!==a.last){
      if(h.last==='W' && a.last!=='W') prev=g.home;
      else if(a.last==='W' && h.last!=='W') prev=g.away;
    }
    add(s2,g,{home_previous_result:h.last,away_previous_result:a.last},prev);

    const s3=signalDefinitions[3];
    let r3=null, havg=null, aavg=null;
    if(h.margins.length>=3 && a.margins.length>=3){
      havg=h.margins.slice(-3).reduce((x,y)=>x+y,0)/3;
      aavg=a.margins.slice(-3).reduce((x,y)=>x+y,0)/3;
      if(havg!==aavg) r3=havg>aavg?g.home:g.away;
    }
    add(s3,g,{home_recent3_mean_margin:havg,away_recent3_mean_margin:aavg},r3);

    const s4=signalDefinitions[4];
    let streak=null;
    if(h.winStreak!==a.winStreak && Math.max(h.winStreak,a.winStreak)>0) streak=h.winStreak>a.winStreak?g.home:g.away;
    add(s4,g,{home_winning_streak:h.winStreak,away_winning_streak:a.winStreak},streak);
  }

  // Update only after all fixtures in the round have been evaluated, preventing same-round leakage.
  for(const g of r.games){
    if(!g.played) continue;
    const h=state(g.home), a=state(g.away);
    const hm=g.homeScore-g.awayScore, am=-hm;
    h.pf+=g.homeScore; h.pa+=g.awayScore; h.margins.push(hm);
    a.pf+=g.awayScore; a.pa+=g.homeScore; a.margins.push(am);
    if(hm>0){h.last='W';a.last='L';h.winStreak+=1;a.winStreak=0;}
    else if(hm<0){h.last='L';a.last='W';h.winStreak=0;a.winStreak+=1;}
    else {h.last='D';a.last='D';h.winStreak=0;a.winStreak=0;}
  }
}

const leaderboard=signalDefinitions.map(s=>{
  const rows=observations.filter(o=>o.signal_id===s.id);
  const selected=rows.filter(o=>o.grade!=='NO_SELECTION');
  const correct=selected.filter(o=>o.grade==='CORRECT').length;
  const incorrect=selected.filter(o=>o.grade==='INCORRECT').length;
  const accuracy=selected.length?correct/selected.length:null;
  const coverage=rows.length?selected.length/rows.length:null;
  const byRound={};
  for(const o of rows){
    const k=String(o.round); byRound[k]??={selections:0,correct:0,incorrect:0,no_selection:0};
    if(o.grade==='NO_SELECTION') byRound[k].no_selection++;
    else {byRound[k].selections++;byRound[k][o.grade.toLowerCase()]++;}
  }
  return {
    signal_id:s.id,version:s.version,status:'RETROSPECTIVE_ASSOCIATION',eligible_fixtures:rows.length,
    selections:selected.length,correct,incorrect,no_selection:rows.length-selected.length,
    raw_accuracy:accuracy==null?null:+accuracy.toFixed(6),coverage_rate:coverage==null?null:+coverage.toFixed(6),
    by_round:byRound,
    promotion_gate:'NOT_ASSESSED_AS_ROBUST — requires leakage/proxy/sensitivity tests and prospective freeze.',
    baseline_note:s.id==='HOME_TEAM'?'LOW_COMPLEXITY_BASELINE':'Compare against HOME_TEAM now; historical market-favourite baseline requires separate verified price ingestion.'
  };
}).sort((a,b)=>(b.raw_accuracy??-1)-(a.raw_accuracy??-1));

const registry={
  snapshot:`SINGLE-SIGNAL-REGISTRY-${now}`,
  generated_at:now,season:season.season,source_snapshot:season.snapshot,status:'ACTIVE_INVESTIGATION',
  terminal_state:'NONE',definitions:signalDefinitions,
  pending_candidate_families:['MARKET_FAVOURITE','NORMALIZED_MARKET_PROBABILITY','OPEN_TO_CLOSE_PRICE_DIRECTION','REST_DIFFERENTIAL','TRAVEL_STATE','VENUE_RECORD','LINEUP_CONTINUITY','KEY_POSITION_CONTINUITY','LATE_WITHDRAWALS','RETURNING_PLAYERS','DEBUTANT_LOW_SAMPLE','PLAYER_AVAILABILITY','WEATHER'],
  rule:'A pending family is not scored until genuinely pre-match historical observations can be sourced without leakage.'
};
const obsStore={snapshot:`SINGLE-SIGNAL-OBS-${now}`,generated_at:now,source_snapshot:season.snapshot,fixture_signal_observations:observations};
const board={snapshot:`SINGLE-SIGNAL-LEADERBOARD-${now}`,generated_at:now,source_snapshot:season.snapshot,signals:leaderboard};
const falsification={
  snapshot:`SINGLE-SIGNAL-FALSIFICATION-${now}`,generated_at:now,status:'ACTIVE',
  tests:[
    {id:'FALSIFY-LEAKAGE',state:'STRUCTURALLY_CONTROLLED',finding:'Current implemented signals use fixture identity and results from earlier rounds only; same-round results are withheld until the entire round has been evaluated.'},
    {id:'FALSIFY-HOME_PROXY',state:'PENDING_ANALYSIS',finding:null},
    {id:'FALSIFY-STRONG_TEAM_PROXY',state:'PENDING_ANALYSIS',finding:null},
    {id:'FALSIFY-TEMPORAL_STABILITY',state:'PARTIAL',finding:'Per-round performance is persisted for inspection; formal stability thresholds not yet promoted.'},
    {id:'FALSIFY-MARKET_BASELINE',state:'PENDING_SOURCE_INGESTION',finding:'Historical verified pre-match market observations are not present in the canonical season ledger and are not inferred.'},
    {id:'FALSIFY-PROSPECTIVE',state:'NOT_STARTED',finding:'No retrospective signal is promoted to robust until frozen prospectively.'}
  ]
};

fs.mkdirSync('data',{recursive:true});
fs.writeFileSync('data/single-signal-registry-2026.json',JSON.stringify(registry,null,2)+'\n');
fs.writeFileSync('data/single-signal-observations-2026.json',JSON.stringify(obsStore,null,2)+'\n');
fs.writeFileSync('data/single-signal-leaderboard-2026.json',JSON.stringify(board,null,2)+'\n');
fs.writeFileSync('data/single-signal-falsification-2026.json',JSON.stringify(falsification,null,2)+'\n');
console.log(`Generated ${observations.length} observations across ${signalDefinitions.length} signals.`);
