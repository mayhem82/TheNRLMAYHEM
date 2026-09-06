import fs from 'node:fs';

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const fail=[];
const assert=(cond,msg)=>{if(!cond)fail.push(msg)};

const manifest=read('data/snapshot-manifest.json');
assert(manifest.snapshot_id,'snapshot manifest id missing');

const cp=read(manifest.canonical.checkpoints.path);
for(const f of cp.fixtures){
  const ko=Date.parse(f.kickoff);
  assert(Number.isFinite(ko),`invalid kickoff ${f.match}`);
  for(const c of f.checkpoints){
    if(c.captured_at&&c.due!=='AFTER_FULL_TIME'){
      const due=Date.parse(c.due),cap=Date.parse(c.captured_at);
      assert(cap<ko,`${f.match} ${c.stage} pre-match capture at/after kickoff`);
      if(cap>due)assert(c.status==='CAPTURED_LATE_BEFORE_KICKOFF',`${f.match} ${c.stage} late timestamp mislabeled ${c.status}`);
    }
    if(f.lifecycle==='VERIFIED_RESULT'&&c.stage==='POST')assert(c.status==='VERIFIED_RESULT',`${f.match} verified result has stale POST`);
  }
}

const season=read(manifest.canonical.season.path);
for(const g of season.round27||[]){
  if(g.status==='played'&&g.mayhem)assert(['CORRECT','INCORRECT'].includes(g.grade),`${g.home} v ${g.away} played genuine tip lacks canonical grade`);
}

const ia=read(manifest.canonical.information_advantage.path);
assert(Array.isArray(ia.events)&&ia.events.length>0,'information advantage ledger empty');

const coverage=read('data/round27-sunday-player-ingestion-coverage-2026.json');
assert(coverage.coverage.unresolved_current_roster_profile_gaps===0,'player profile gaps unresolved');

const contradictions=read(manifest.canonical.contradictions.path);
for(const c of contradictions.conflicts||[]){if(c.resolution_state==='RESOLVED')assert(c.resolved_to&&c.resolved_by&&c.resolved_at,`resolved conflict missing resolution evidence ${c.conflict_id}`)}

const auditSchema=read('schema/audit-record.schema.json');
assert(auditSchema.properties.grade.enum.includes('INCORRECT'),'audit schema missing INCORRECT');
assert(!auditSchema.properties.grade.enum.includes('WRONG'),'audit schema still exposes WRONG');

const playerManifest=read('data/player-data-manifest-2026.json');
for(const p of [...playerManifest.required,...playerManifest.statistics,playerManifest.coverage,playerManifest.contradictions])assert(fs.existsSync(p),`player dependency missing ${p}`);

if(fail.length){console.error('TIER_INFINITY_VALIDATION_FAILED');for(const x of fail)console.error('- '+x);process.exit(1)}
console.log('TIER_INFINITY_VALIDATION_PASS',manifest.snapshot_id);
