import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const season = 2026;
const round = Number(process.env.NRL_ROUND || 27);
const url = `https://www.nrl.com/draw/data?competition=111&round=${round}&season=${season}`;
const outPath = 'data/live-scores-2026.json';
const now = new Date();
const capturedAt = now.toISOString();

function teamName(v){
  if(!v) return null;
  return v.name || v.nickname || v.teamName || v.shortName || null;
}
function num(v){ return Number.isFinite(Number(v)) ? Number(v) : null; }
function fixtureId(f,i){
  return String(f.id || f.matchId || f.fixtureId || `R${round}-FIXTURE-${i+1}`);
}
function state(f){
  const raw = String(f.matchState || f.state || f.status || f.matchMode || '').toUpperCase();
  if(/FULL|FINAL|COMPLETE|ENDED/.test(raw)) return 'FULL_TIME';
  if(/LIVE|PLAY|HALF|INTERVAL|IN_PROGRESS/.test(raw)) return 'LIVE';
  if(/POSTPON|SUSPEND/.test(raw)) return 'POSTPONED';
  if(/ABANDON|CANCEL/.test(raw)) return 'ABANDONED';
  if(/UPCOMING|SCHEDULE|PRE/.test(raw)) return 'UPCOMING';
  return raw || 'UNKNOWN';
}
function kickoff(f){ return f.kickOffTime || f.kickoff || f.startTime || f.start || null; }
function score(f, side){
  const t = side==='home' ? (f.homeTeam || f.home || f.teamA) : (f.awayTeam || f.away || f.teamB);
  return num(t?.score ?? t?.points ?? f?.[`${side}Score`] ?? f?.scores?.[side]);
}

let previous = null;
try { previous = JSON.parse(await fs.readFile(outPath,'utf8')); } catch {}

try {
  const r = await fetch(url,{headers:{'user-agent':'TheNRLMAYHEM-live-state/1.0','accept':'application/json'}});
  if(!r.ok) throw new Error(`NRL_HTTP_${r.status}`);
  const raw = await r.text();
  const json = JSON.parse(raw);
  const fixtures = json.fixtures || json.matches || json.data?.fixtures || json.data?.matches || [];
  if(!Array.isArray(fixtures) || !fixtures.length) throw new Error('NRL_FIXTURES_EMPTY');

  const matches = fixtures.map((f,i)=>{
    const homeObj=f.homeTeam||f.home||f.teamA||{};
    const awayObj=f.awayTeam||f.away||f.teamB||{};
    const prev = previous?.matches?.find(x => x.home===teamName(homeObj) && x.away===teamName(awayObj));
    return {
      event_id: prev?.event_id || fixtureId(f,i),
      home: teamName(homeObj) || 'UNKNOWN_HOME',
      away: teamName(awayObj) || 'UNKNOWN_AWAY',
      scheduled_start: kickoff(f),
      status: state(f),
      score_home: score(f,'home'),
      score_away: score(f,'away'),
      clock_or_period: f.clock || f.matchClock || f.period || f.currentPeriod || null,
      last_verified_at: capturedAt,
      match_centre_url: f.matchCentreUrl ? new URL(f.matchCentreUrl,'https://www.nrl.com').href : null,
      mayhem: prev?.mayhem || null
    };
  });

  const output = {
    snapshot_id:`LIVE-SCORES-${season}-R${round}-${capturedAt.replace(/[-:.TZ]/g,'').slice(0,14)}`,
    season, competition:'NRL Telstra Premiership', round, timezone:'Australia/Sydney', captured_at:capturedAt,
    refresh_target_seconds:300, stale_after_seconds:600,
    source:{source_id:'SRC-NRL-OFFICIAL-DRAW',source_class:'OFFICIAL_PRIMARY',source_url:url,acquisition_state:'CAPTURED',content_hash:`sha256:${crypto.createHash('sha256').update(raw).digest('hex')}`},
    integrity:{canonical_result_store:'data/season-canonical-2026.json',canonical_checkpoint_store:'data/checkpoints-round27-canonical.json',rule:'Observational live state only; frozen pre-match evidence is immutable and full-time observations require governed result verification before canonical promotion.'},
    matches
  };
  await fs.writeFile(outPath,JSON.stringify(output,null,2)+'\n');
  console.log(`captured ${matches.length} fixtures`);
} catch (err) {
  const fallback = previous || {season,competition:'NRL Telstra Premiership',round,timezone:'Australia/Sydney',matches:[]};
  fallback.snapshot_id=`LIVE-SCORES-${season}-R${round}-SOURCE-UNAVAILABLE`;
  fallback.captured_at=capturedAt;
  fallback.refresh_target_seconds=300;
  fallback.stale_after_seconds=600;
  fallback.source={source_id:'SRC-NRL-OFFICIAL-DRAW',source_class:'OFFICIAL_PRIMARY',source_url:url,acquisition_state:'SOURCE_UNAVAILABLE',error:String(err?.message||err)};
  fallback.integrity=fallback.integrity||{canonical_result_store:'data/season-canonical-2026.json',canonical_checkpoint_store:'data/checkpoints-round27-canonical.json',rule:'Observational live state only; never invent scores or clocks.'};
  fallback.matches=(fallback.matches||[]).map(m=>({...m,status:m.status==='UPCOMING'?'UPCOMING':'SOURCE_UNAVAILABLE'}));
  await fs.writeFile(outPath,JSON.stringify(fallback,null,2)+'\n');
  console.error(err);
  process.exitCode=2;
}
