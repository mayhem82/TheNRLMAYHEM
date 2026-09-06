import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const season = 2026;
const round = Number(process.env.NRL_ROUND || 27);
const url = `https://www.nrl.com/draw/data?competition=111&round=${round}&season=${season}`;
const outPath = 'data/live-scores-2026.json';
const capturedAt = new Date().toISOString();

function first(...v){ return v.find(x => x !== undefined && x !== null && x !== ''); }
function teamName(v){
  if(!v) return null;
  return first(v.nickName, v.nickname, v.name, v.teamName, v.shortName, v.teamNickname, v.teamNickName) || null;
}
function teamId(v){ return first(v?.id, v?.teamId, v?.teamID, null); }
function num(v){
  if(v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function fixtureId(f,i){
  return String(first(f.id, f.matchId, f.fixtureId, f.gameId, `R${round}-FIXTURE-${i+1}`));
}
function rawState(f){ return String(first(f.matchState, f.state, f.status, f.matchMode, '')).toUpperCase(); }
function state(f){
  const raw = rawState(f);
  if(/FULL|FINAL|COMPLETE|ENDED|POST_MATCH/.test(raw)) return 'FULL_TIME';
  if(/GOLDEN|EXTRA|OVERTIME/.test(raw)) return 'OVERTIME';
  if(/HALF|INTERVAL/.test(raw)) return 'HALFTIME_OR_INTERVAL';
  if(/LIVE|PLAY|IN_PROGRESS|IN PROGRESS/.test(raw)) return 'LIVE';
  if(/POSTPON|SUSPEND/.test(raw)) return 'POSTPONED';
  if(/ABANDON|CANCEL/.test(raw)) return 'ABANDONED';
  if(/UPCOMING|SCHEDULE|PRE_MATCH|PRE-MATCH|PRE/.test(raw)) return 'UPCOMING';
  return raw || 'UNKNOWN';
}
function kickoff(f){
  return first(
    f.clock?.kickOffTimeLong,
    f.clock?.kickOffTime,
    f.kickOffTime,
    f.kickoff,
    f.startTime,
    f.start,
    f.date
  ) || null;
}
function score(f, side){
  const t = side === 'home' ? first(f.homeTeam, f.home, f.teamA) : first(f.awayTeam, f.away, f.teamB);
  return num(first(t?.score, t?.points, t?.finalScore, f?.[`${side}Score`], f?.scores?.[side]));
}
function clockOrPeriod(f){
  const c = f.clock;
  if(c && typeof c === 'object') {
    return first(c.displayTime, c.time, c.matchTime, c.period, c.currentPeriod, c.gameTime) || null;
  }
  return first(c, f.matchClock, f.period, f.currentPeriod, f.gameTime) || null;
}
function countdownSeconds(start){
  if(!start) return null;
  const d = new Date(start);
  if(Number.isNaN(d.getTime())) return null;
  return Math.max(0, Math.floor((d.getTime() - Date.now()) / 1000));
}
function overtimeState(f){
  const raw = rawState(f);
  const clock = String(clockOrPeriod(f) || '');
  const m = clock.match(/^(\d{1,3}):(\d{2})$/);
  const seconds = m ? Number(m[1]) * 60 + Number(m[2]) : null;
  const active = /GOLDEN|EXTRA|OVERTIME/.test(raw) || (seconds !== null && seconds > 80 * 60);
  return { active, label: active ? (/GOLDEN/.test(raw) ? 'GOLDEN_POINT' : 'OVERTIME') : null };
}
function decodeHtml(s){
  return String(s)
    .replace(/&quot;/g,'"').replace(/&#34;/g,'"')
    .replace(/&#39;/g,"'").replace(/&amp;/g,'&')
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}
function extractDisciplinaryEvents(html, homeId, awayId, home, away){
  const text = decodeHtml(html);
  const out = [];
  const seen = new Set();
  const rx = /\{[^{}]{0,1200}"gameSeconds"\s*:\s*(\d+)[^{}]{0,1200}"(?:title|type)"[^{}]{0,1200}\}/g;
  for(const m of text.matchAll(rx)){
    const blob = m[0];
    const type = first(blob.match(/"type"\s*:\s*"([^"]+)"/)?.[1], '');
    const title = first(blob.match(/"title"\s*:\s*"([^"]+)"/)?.[1], type);
    if(!/(Penalty|Ruck Infringement|Set Restart|Sin Bin|Sent Off)/i.test(`${type} ${title}`)) continue;
    const gameSeconds = Number(m[1]);
    const tIdRaw = blob.match(/"teamId"\s*:\s*(\d+)/)?.[1];
    const pIdRaw = blob.match(/"playerId"\s*:\s*(\d+)/)?.[1];
    const tId = tIdRaw ? Number(tIdRaw) : null;
    const pId = pIdRaw ? Number(pIdRaw) : null;
    const key = `${gameSeconds}|${type}|${title}|${tId}|${pId}`;
    if(seen.has(key)) continue;
    seen.add(key);
    out.push({
      game_seconds: gameSeconds,
      minute: Math.floor(gameSeconds / 60),
      type: type || null,
      title: title || null,
      team_id: tId,
      team: tId != null && String(tId) === String(homeId) ? home : (tId != null && String(tId) === String(awayId) ? away : null),
      player_id: pId
    });
  }
  return out.sort((a,b)=>a.game_seconds-b.game_seconds).slice(-30);
}

let previous = null;
try { previous = JSON.parse(await fs.readFile(outPath,'utf8')); } catch {}

try {
  const r = await fetch(url, {
    headers: {
      'user-agent':'Mozilla/5.0 (compatible; TheNRLMAYHEM-live-state/1.2)',
      'accept':'application/json,text/plain,*/*',
      'referer':'https://www.nrl.com/draw/'
    },
    redirect:'follow'
  });
  if(!r.ok) throw new Error(`NRL_HTTP_${r.status}`);
  const raw = await r.text();
  let json;
  try { json = JSON.parse(raw); }
  catch { throw new Error(`NRL_NON_JSON:${raw.slice(0,80).replace(/\s+/g,' ')}`); }

  const fixtures = first(json.fixtures, json.matches, json.data?.fixtures, json.data?.matches, json.draw?.fixtures) || [];
  if(!Array.isArray(fixtures) || !fixtures.length) throw new Error('NRL_FIXTURES_EMPTY');

  const matches = [];
  for(let i=0;i<fixtures.length;i++){
    const f = fixtures[i];
    const homeObj = first(f.homeTeam, f.home, f.teamA) || {};
    const awayObj = first(f.awayTeam, f.away, f.teamB) || {};
    const home = teamName(homeObj) || 'UNKNOWN_HOME';
    const away = teamName(awayObj) || 'UNKNOWN_AWAY';
    const hId = teamId(homeObj), aId = teamId(awayObj);
    const prev = previous?.matches?.find(x => x.home === home && x.away === away);
    const matchCentrePath = first(f.matchCentreUrl, f.matchCentreURL, f.matchUrl, f.url);
    const matchCentreUrl = matchCentrePath ? new URL(matchCentrePath,'https://www.nrl.com').href : null;
    let disciplinaryEvents = prev?.disciplinary_events || [];
    let eventSourceState = 'NOT_FETCHED';
    if(matchCentreUrl && ['LIVE','HALFTIME_OR_INTERVAL','OVERTIME','FULL_TIME'].includes(state(f))){
      try{
        const mr = await fetch(matchCentreUrl,{headers:{'user-agent':'Mozilla/5.0 (compatible; TheNRLMAYHEM-event-state/1.0)','accept':'text/html,*/*'},redirect:'follow'});
        if(mr.ok){
          const html = await mr.text();
          const found = extractDisciplinaryEvents(html,hId,aId,home,away);
          if(found.length) disciplinaryEvents = found;
          eventSourceState = found.length ? 'CAPTURED' : 'NO_MATCHING_EVENTS_FOUND';
        } else eventSourceState = `HTTP_${mr.status}`;
      } catch(e){ eventSourceState = `ERROR:${String(e?.message||e)}`; }
    }
    const ot = overtimeState(f);
    matches.push({
      event_id: prev?.event_id || fixtureId(f,i),
      home,
      away,
      home_team_id:hId,
      away_team_id:aId,
      scheduled_start: kickoff(f),
      countdown_seconds: state(f)==='UPCOMING' ? countdownSeconds(kickoff(f)) : 0,
      status: state(f),
      raw_source_state: rawState(f) || null,
      score_home: score(f,'home'),
      score_away: score(f,'away'),
      clock_or_period: clockOrPeriod(f),
      overtime: ot,
      disciplinary_events: disciplinaryEvents,
      event_source_state: eventSourceState,
      last_verified_at: capturedAt,
      match_centre_url: matchCentreUrl,
      mayhem: prev?.mayhem || null
    });
  }

  const output = {
    snapshot_id:`LIVE-SCORES-${season}-R${round}-${capturedAt.replace(/[-:.TZ]/g,'').slice(0,14)}`,
    season,
    competition:'NRL Telstra Premiership',
    round,
    timezone:'Australia/Sydney',
    captured_at:capturedAt,
    refresh_target_seconds:300,
    stale_after_seconds:600,
    source:{
      source_id:'SRC-NRL-OFFICIAL-DRAW',
      source_class:'OFFICIAL_PRIMARY',
      source_url:url,
      acquisition_state:'CAPTURED',
      content_hash:`sha256:${crypto.createHash('sha256').update(raw).digest('hex')}`
    },
    integrity:{
      canonical_result_store:'data/season-canonical-2026.json',
      canonical_checkpoint_store:'data/checkpoints-round27-canonical.json',
      rule:'Observational live state only; frozen pre-match evidence is immutable and full-time observations require governed result verification before canonical promotion. Countdown is client-observational; score, clock, overtime and disciplinary events remain source-reported.'
    },
    matches
  };
  await fs.writeFile(outPath, JSON.stringify(output,null,2)+'\n');
  console.log(`captured ${matches.length} fixtures from official NRL draw feed with event enrichment`);
} catch (err) {
  const fallback = previous || {season,competition:'NRL Telstra Premiership',round,timezone:'Australia/Sydney',matches:[]};
  fallback.snapshot_id=`LIVE-SCORES-${season}-R${round}-SOURCE-UNAVAILABLE`;
  fallback.captured_at=capturedAt;
  fallback.refresh_target_seconds=300;
  fallback.stale_after_seconds=600;
  fallback.source={
    source_id:'SRC-NRL-OFFICIAL-DRAW',
    source_class:'OFFICIAL_PRIMARY',
    source_url:url,
    acquisition_state:'SOURCE_UNAVAILABLE',
    error:String(err?.message || err)
  };
  fallback.integrity=fallback.integrity || {
    canonical_result_store:'data/season-canonical-2026.json',
    canonical_checkpoint_store:'data/checkpoints-round27-canonical.json',
    rule:'Observational live state only; never invent scores, clocks, overtime or disciplinary events.'
  };
  fallback.matches=(fallback.matches || []).map(m => ({
    ...m,
    status: m.status === 'UPCOMING' ? 'UPCOMING' : 'SOURCE_UNAVAILABLE'
  }));
  await fs.writeFile(outPath, JSON.stringify(fallback,null,2)+'\n');
  console.error(err);
  process.exitCode=2;
}
