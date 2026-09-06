import fs from 'node:fs/promises';

const livePath = 'data/live-scores-2026.json';
const seasonPath = 'data/season-canonical-2026.json';
const checkpointsPath = 'data/checkpoints-round27-canonical.json';

const live = JSON.parse(await fs.readFile(livePath, 'utf8'));
const season = JSON.parse(await fs.readFile(seasonPath, 'utf8'));
const checkpoints = JSON.parse(await fs.readFile(checkpointsPath, 'utf8'));

const capturedAt = live.captured_at;
if (!capturedAt) throw new Error('LIVE_CAPTURE_TIME_MISSING');
const captureMs = Date.parse(capturedAt);
if (!Number.isFinite(captureMs)) throw new Error('LIVE_CAPTURE_TIME_INVALID');

function key(home, away) {
  return `${String(home || '').trim()}|${String(away || '').trim()}`;
}

function canonicalLifecycle(status) {
  switch (status) {
    case 'LIVE':
    case 'HALFTIME_OR_INTERVAL':
    case 'OVERTIME':
      return 'MATCH_WINDOW';
    case 'FULL_TIME':
      return 'RESULT_VERIFICATION_PENDING';
    case 'POSTPONED':
      return 'POSTPONED';
    case 'ABANDONED':
      return 'ABANDONED';
    case 'UPCOMING':
      return 'UPCOMING';
    default:
      return null;
  }
}

function officialFullTimeVerifiable(obs) {
  return obs?.status === 'FULL_TIME'
    && Number.isFinite(Number(obs.score_home))
    && Number.isFinite(Number(obs.score_away))
    && live?.source?.source_class === 'OFFICIAL_PRIMARY'
    && live?.source?.acquisition_state === 'CAPTURED';
}

function gradeTip(fixture, obs) {
  if (!fixture?.mayhem) return null;
  const hs = Number(obs.score_home), as = Number(obs.score_away);
  if (!Number.isFinite(hs) || !Number.isFinite(as) || hs === as) return 'PENDING';
  const winner = hs > as ? fixture.home : fixture.away;
  return String(fixture.mayhem) === String(winner) ? 'CORRECT' : 'INCORRECT';
}

function displayScore(fixture) {
  if (fixture.status === 'played' && fixture.score) return fixture.score.replace('-', '–');
  return 'Pending';
}

function refreshRound27Ledger() {
  const entries = (season.round27 || []).map(f => {
    const score = displayScore(f);
    const confidence = f.confidence == null ? '—' : `${f.confidence}%`;
    const grade = f.grade || 'PENDING';
    const tip = `${f.mayhem || '—'} · ${confidence} · ${grade}`;
    return `${f.home}|${score}|${f.away}|${tip}`;
  }).join(';');
  if (typeof season.ledger_compact === 'string') {
    season.ledger_compact = season.ledger_compact.replace(/\/27:.*$/, `/27:${entries}`);
  }
}

const liveByTeams = new Map((live.matches || []).map(m => [key(m.home, m.away), m]));
let seasonChanged = false;
let checkpointChanged = false;

for (const fixture of season.round27 || []) {
  const obs = liveByTeams.get(key(fixture.home, fixture.away));
  if (!obs) continue;

  if (officialFullTimeVerifiable(obs)) {
    const newScore = `${Number(obs.score_home)}-${Number(obs.score_away)}`;
    const newGrade = gradeTip(fixture, obs);
    if (fixture.status !== 'played') { fixture.status = 'played'; seasonChanged = true; }
    if (fixture.lifecycle !== 'VERIFIED_RESULT') { fixture.lifecycle = 'VERIFIED_RESULT'; seasonChanged = true; }
    if (fixture.score !== newScore) { fixture.score = newScore; seasonChanged = true; }
    if (newGrade && fixture.grade !== newGrade) { fixture.grade = newGrade; seasonChanged = true; }
    if (fixture.result_verified_at !== capturedAt) { fixture.result_verified_at = capturedAt; seasonChanged = true; }
    if (fixture.result_source !== live.source.source_id) { fixture.result_source = live.source.source_id; seasonChanged = true; }
    if (fixture.live_observation_at !== (obs.last_verified_at || capturedAt)) {
      fixture.live_observation_at = obs.last_verified_at || capturedAt;
      seasonChanged = true;
    }
    continue;
  }

  const lifecycle = canonicalLifecycle(obs.status);
  if (!lifecycle) continue;
  const targetStatus = lifecycle === 'MATCH_WINDOW'
    ? 'match_window'
    : lifecycle === 'RESULT_VERIFICATION_PENDING'
      ? 'result_verification_pending'
      : lifecycle.toLowerCase();

  if (fixture.status !== 'played' && fixture.status !== targetStatus) {
    fixture.status = targetStatus;
    seasonChanged = true;
  }
  if (fixture.status !== 'played') {
    if (fixture.lifecycle !== lifecycle) {
      fixture.lifecycle = lifecycle;
      seasonChanged = true;
    }
    if (fixture.live_observation_at !== obs.last_verified_at) {
      fixture.live_observation_at = obs.last_verified_at || capturedAt;
      seasonChanged = true;
    }
  }
}

for (const fixture of checkpoints.fixtures || []) {
  const [home, away] = String(fixture.match || '').split(' v ');
  const obs = liveByTeams.get(key(home, away));
  if (!obs) continue;

  if (officialFullTimeVerifiable(obs)) {
    if (fixture.lifecycle !== 'VERIFIED_RESULT') {
      fixture.lifecycle = 'VERIFIED_RESULT';
      checkpointChanged = true;
    }
    fixture.verified_result = {
      score_home: Number(obs.score_home),
      score_away: Number(obs.score_away),
      verified_at: capturedAt,
      source_id: live.source.source_id
    };
    const post = (fixture.checkpoints || []).find(cp => cp.stage === 'POST');
    if (post && post.status !== 'VERIFIED_RESULT') {
      post.status = 'VERIFIED_RESULT';
      post.reconciled_at = capturedAt;
      checkpointChanged = true;
    }
  } else {
    const lifecycle = canonicalLifecycle(obs.status);
    if (!lifecycle) continue;
    if (fixture.lifecycle !== 'VERIFIED_RESULT' && fixture.lifecycle !== lifecycle) {
      fixture.lifecycle = lifecycle;
      checkpointChanged = true;
    }
    if (lifecycle === 'RESULT_VERIFICATION_PENDING') {
      const post = (fixture.checkpoints || []).find(cp => cp.stage === 'POST');
      if (post && post.status === 'PENDING') {
        post.status = 'RESULT_VERIFICATION_PENDING';
        post.reconciled_at = capturedAt;
        checkpointChanged = true;
      }
    }
  }

  const startMs = Date.parse(fixture.kickoff || obs.scheduled_start || '');
  const eventHasStarted = ['LIVE', 'HALFTIME_OR_INTERVAL', 'OVERTIME', 'FULL_TIME'].includes(obs.status)
    || (Number.isFinite(startMs) && captureMs >= startMs);
  if (eventHasStarted) {
    for (const cp of fixture.checkpoints || []) {
      if (cp.stage === 'POST') continue;
      if (cp.status !== 'PENDING') continue;
      const dueMs = Date.parse(cp.due || '');
      if (Number.isFinite(dueMs) && dueMs < startMs && dueMs <= captureMs) {
        cp.status = 'MISSED_NOT_CAPTURED';
        cp.reconciled_at = capturedAt;
        checkpointChanged = true;
      }
    }
  }
}

if (seasonChanged) {
  refreshRound27Ledger();
  season.snapshot = `SEASON-CANONICAL-2026-LIFECYCLE-${String(capturedAt).replace(/[-:.TZ]/g, '').slice(0,14)}`;
  season.lifecycle_reconciled_at = capturedAt;
  await fs.writeFile(seasonPath, JSON.stringify(season) + '\n');
}

if (checkpointChanged) {
  checkpoints.snapshot = `CHECKPOINT-CANONICAL-R27-LIFECYCLE-${String(capturedAt).replace(/[-:.TZ]/g, '').slice(0,14)}`;
  checkpoints.generated_at = capturedAt;
  checkpoints.lifecycle_source = livePath;
  await fs.writeFile(checkpointsPath, JSON.stringify(checkpoints, null, 2) + '\n');
}

console.log(JSON.stringify({seasonChanged, checkpointChanged, capturedAt}));
