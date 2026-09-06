# Tier Infinity Audit — The NRL MAYHEM

Audit snapshot: 2026-09-06 12:49:01 AEST (Australia/Sydney)
Audited repository head: `494d5da95f09b1872a35a9d59af97347b27078bc`
Audit mode: whole-site, whole-architecture, persistence, temporal-integrity, schema, derived-view and public-interface inspection.

## Tier Infinity result

**NOT PASSING.** The architecture is materially stronger than a normal tipping site: it has explicit evidence lineage, immutable decision concepts, checkpointing, contradiction preservation, failure audits, player/team layers, market normalization controls, continuity analysis, a research-source registry and a Premiership-path layer. However, the current snapshot contains several structural truth-split defects that prevent Tier Infinity certification. The most serious issue is not missing analysis; it is that multiple representations of the same fact can disagree while the public site still renders a plausible current state.

## What holds

1. The canonical conceptual hierarchy is coherent: Source → Observation → Player → Team Baseline → Continuity Delta → Matchup → Match → Market → Frozen Decision → Outcome → Audit → Learned Weight → next Match.
2. The no-hindsight rule is explicit and repeated across README, audit protocol, failure audit and information-advantage design.
3. Genuine tips are graded by verified winner and are not rewritten after outcome.
4. Incorrect tips trigger a distinct failure-audit path; Cowboys v Raiders has a substantive failure audit with explicit process defects and corrections.
5. Player coverage for the four Sunday teams is materially complete at the data layer: 80/80 identities resolved, 77 current 2026 NRL dossiers and three verified no-completed-NRL-sample states.
6. Research-source governance is now broad and correctly separates primary, secondary, market, historical and derived/fantasy sources.
7. Premiership intelligence separates Minor Premiership from NRL Premiership and preserves every club's path or closed path.
8. Site and NRL glossaries are correctly separated in scope.

## Critical defects — Tier Infinity blockers

### TI-001 — Canonical truth fragmentation
Severity: CRITICAL

`index.html` contains an embedded full-season ledger while `data/season-2026.json` also represents current season truth. `teams.html` parses the embedded `index.html` ledger and then overlays `season-2026.json`. This creates two canonical-looking representations of fixtures/results/tips and makes drift structurally possible.

Required correction: one canonical season/fixture store. Every page must derive from it. Public HTML must not contain an independently maintained copy of the full fixture ledger.

### TI-002 — Audit Clock masks stale canonical checkpoint data
Severity: CRITICAL

`data/checkpoints-round27.json` remains stale for completed fixtures and Sunday late captures. `audit-clock.html` repairs parts of the display in the browser by applying `data/reconciliation-2026-09-06-1205-aest.json`. That means the rendered view can appear reconciled while the underlying checkpoint ledger remains wrong.

Examples in the audited snapshot:
- Warriors POST remains `PENDING` in the checkpoint ledger despite a verified result.
- Cowboys T-60m, T-10m and POST remain `PENDING` in the ledger; reconciliation separately marks missed checkpoints and verified result.
- Sharks T-3h/T-60m/T-10m/POST remain `PENDING` in the ledger despite result verification.
- Dragons T-3h remains `PENDING` in the checkpoint ledger while reconciliation records `CAPTURED_LATE_BEFORE_KICKOFF`.
- Panthers T-24h remains `PENDING` in the checkpoint ledger while a dedicated late-capture record and reconciliation establish the late capture.

Required correction: reconcile the canonical checkpoint ledger itself, append-only where necessary, then have the public view read canonical resolved state rather than patching stale truth client-side.

### TI-003 — Temporal classification is internally inconsistent
Severity: CRITICAL

The checkpoint ledger contains capture-state labels that do not match the actual timestamps or the current governance rule. Warriors T-3h was due at 12:00 and captured at 13:52:49 yet is labelled `CAPTURED_IN_WINDOW`. Dragons T-24h was due at 14:00 and captured at 14:02:10 but is labelled `CAPTURED` rather than explicitly late. The new rule requires missed target times, if still pre-kickoff, to be represented as `CAPTURED_LATE_BEFORE_KICKOFF` with both due and genuine capture times preserved.

Required correction: introduce a machine-enforced capture-state taxonomy and migrate derived current state without rewriting historical evidence content.

### TI-004 — Temporal engine cannot enforce the current governance
Severity: CRITICAL

`engine/temporal.js` does not implement the late-capture rule, does not model `MISSED_NOT_CAPTURED`, `MATCH_WINDOW`, `RESULT_VERIFICATION_PENDING` or `VERIFIED_RESULT`, and includes `KICKOFF` as a checkpoint even though the operational checkpoint architecture is T-24h/T-3h/T-60m/T-10m/Post-match.

Required correction: temporal engine must become the single lifecycle/checkpoint state machine and emit exact governed states from due time, capture time, kickoff and result-verification state.

### TI-005 — Observation normalizer can fabricate provenance
Severity: CRITICAL

`engine/normalize.js` assigns `captured_at: new Date().toISOString()` whenever a record lacks a capture timestamp. In an evidence architecture, missing provenance must remain missing/invalid; the engine must not manufacture a capture time and thereby make an undated record appear contemporaneously captured.

Required correction: missing `captured_at` must fail validation or be explicitly classified `CAPTURE_TIME_UNAVAILABLE`; never synthesize it.

### TI-006 — Schema grade vocabulary conflicts with live system vocabulary
Severity: CRITICAL

`schema/audit-record.schema.json` permits `CORRECT`, `WRONG`, `PUSH`, null. The operational system and public site use `CORRECT` and `INCORRECT`. A valid current record can therefore fail the declared audit schema.

Required correction: canonical grade enum must match public and persisted data. If pushes are possible, define their exact football/market scope separately from winner-tip grading.

### TI-007 — Contradiction schema cannot represent resolution
Severity: CRITICAL

The system principle says contradictions remain visible until stronger evidence resolves them, but `audit-record.schema.json` represents contradictions as strings and `engine/conflicts.js` emits every conflict with `resolution:'UNRESOLVED'`. There is no first-class `OPEN / RESOLVED / UNRESOLVED` state with `resolved_to`, resolving source, resolution event and timestamp.

This defect is visible in the public experience: an earlier Charnze Nicoll-Klokstad centre role is shown as contradicted, while the resolved wing state exists elsewhere but is not structurally linked to the contradiction.

Required correction: contradiction object schema plus explicit resolution event linkage and public resolution rendering.

### TI-008 — Player public layer does not ingest all data required by its own coverage manifest
Severity: CRITICAL

The coverage manifest lists seven statistical data sources and reports 80/80 current identities resolved. `players.html` does not fetch `data/player-stats-dragons-eels-supplement-2-2026.json` or `data/player-stats-panthers-supplement-2026.json`. Therefore public Players can report acquisition defects for players whose dossiers are already present in repository data.

Required correction: drive Players data-source loading from a manifest rather than a hard-coded Promise list.

### TI-009 — Information Advantage Ledger is architecturally declared but operationally empty
Severity: CRITICAL

`data/information-advantage-ledger-2026.json` contains no events and `updated_at` is null, while checkpoint records already contain information-advantage classifications and the site publicly explains the Information Advantage Audit. The architecture therefore claims a persistent temporal ledger that is not receiving the observed signals.

Required correction: persist every qualifying signal/market timing/decision-effect event into the ledger with required temporal fields; public summary must derive from that ledger.

## Major defects

### TI-010 — Documentation drift
Severity: HIGH

`README.md` contains the newer late-capture rule, result-verification logic, mandatory pre-freeze gates and incorrect-tip halt. `docs/AUDIT-PROTOCOL.md` is materially older and omits these controls. The repository therefore has competing governance documents.

Correction: one canonical governance specification with version/snapshot ID; derivative docs generated or explicitly subordinate.

### TI-011 — Source-class taxonomies are not unified
Severity: HIGH

Source classes differ across `source-snapshot.schema.json`, `audit-record.schema.json`, checkpoint/reconciliation data and `research-sites-2026.json` (`OFFICIAL`, `PRIMARY_OFFICIAL`, `OFFICIAL_NRL`, `DIRECT_MARKET`, `PRIMARY_OFFICIAL_STATS`, etc.). This prevents reliable cross-file validation and longitudinal source-performance analysis.

Correction: canonical source-class registry plus aliases/migration mapping.

### TI-012 — Evidence/signal classification taxonomies are ambiguous across layers
Severity: HIGH

Player/evidence records use `VERIFIED / UNVERIFIED / CONTRADICTED / SIGNAL`. Intelligence-event schema uses `OBSERVED / POSSIBLE_SIGNAL / PROBABLE_SIGNAL / CORROBORATED_SIGNAL / CONFIRMED_FACT / CONFLICTING / EXCLUDED / UNKNOWN`. Two layers can legitimately exist, but the current naming uses a generic `classification` field without an explicit crosswalk or layer identity.

Correction: make `evidence_state` and `signal_state` separate fields with canonical transition rules.

### TI-013 — Major data families have no schemas
Severity: HIGH

Only source snapshots, intelligence events and audit records have declared schemas. No schema currently governs season state, checkpoint ledger, reconciliation, player dossier, roster, failure audit, decision calibration, information-advantage ledger, premiership road, continuity architecture, research sites or glossary snapshots.

Correction: schema coverage for every persistent data family and validation before repository persistence.

### TI-014 — Derived views can mix snapshots from different times
Severity: HIGH

Pages fetch several independent JSON files with `Date.now()` cache busting but no common snapshot manifest or transaction ID. A user can therefore receive files from different logical states during a multi-file update.

Correction: publish an atomic `snapshot-manifest.json` that pins exact object versions/hashes; pages load one snapshot ID and refuse mixed-version rendering.

### TI-015 — Players page is all-or-nothing on fetch failure
Severity: HIGH

A single failed statistical JSON request rejects the full `Promise.all` and makes the entire Players view unavailable, even if most data sources are healthy.

Correction: per-source `Promise.allSettled`, source-specific degradation, explicit incomplete-coverage state.

### TI-016 — Teams page depends on parsing JavaScript source from index.html
Severity: HIGH

`teams.html` extracts `const D` from `index.html` using a regular expression. A harmless change to the Season page implementation can break Teams or silently alter parsed data.

Correction: Teams must read canonical structured season data only.

### TI-017 — Teams preview renders raw historical contradiction records without a resolution relationship
Severity: HIGH

The Teams page selects recent raw player-intelligence records, not a resolved current-state object with linked history. A player can therefore appear twice and a contradicted card can be presented without the resolving state attached, exactly as observed for Charnze Nicoll-Klokstad.

Correction: current-state card + expandable audit history; contradiction history must show `resolved_to` and resolution evidence.

### TI-018 — Public navigation is inconsistent
Severity: MEDIUM-HIGH

Intelligence exposes the full navigation set, while Season, Teams and Players omit glossary/research links; glossary/research pages omit core operational pages; Audit Clock omits Research Sites. This creates multiple partial site maps.

Correction: one shared navigation definition rendered consistently on every page.

### TI-019 — Public terminology still exposes unexplained internal codes and abbreviations
Severity: MEDIUM-HIGH

Examples include stat labels such as `APPS`, `TRY AST`, `LB AST`, `AVG RUN m`, `FORCED DO`, `FANTASY AVG` and internal state strings such as `FINAL_STARTING_ROLE`, `REVIEW_REQUIRED` and source-class codes. The Site Master Glossary itself requires public internal codes to receive plain-language rendering.

Correction: public label map sourced from Site Master Glossary; raw code remains available only as secondary audit metadata.

### TI-020 — NRL Master Glossary is behind the new Premiership intelligence layer
Severity: MEDIUM-HIGH

The site now materially depends on terms such as Minor Premiership, NRL Premiership, Qualifying Final, Elimination Final, Preliminary Final, Grand Final, top four, top eight, double chance and ladder tiebreak mechanics, but these were not incorporated into the audited NRL glossary snapshot before the Premiership-road surface was deployed.

Correction: glossary sweep and authoritative source verification before treating those terms as complete public reference architecture.

### TI-021 — Source weighting is qualitative but not formally operationalized
Severity: MEDIUM

`SOURCE-WEIGHTING.md` labels classes very high/high/medium etc., while the failure-audit architecture correctly says weights may change only from accumulated evidence. No persisted source-performance register currently connects those descriptive priors to audited longitudinal performance.

Correction: treat initial labels explicitly as source-priority priors, not empirical weights, and maintain an evidence-based source-performance ledger.

### TI-022 — Research registry is broad but not version-linked to evidence captures
Severity: MEDIUM

The registry correctly says a listing is not evidence. However, evidence records generally store source names/URLs ad hoc rather than a registry source ID/version. This weakens referential integrity when source classes evolve.

Correction: stable `source_id`, source registry snapshot ID and capture-specific URL in every source snapshot.

### TI-023 — No visible automated validation/CI gate in the audited root architecture
Severity: HIGH

The audited repository root exposes data, docs, engine, schema and public pages but no visible automated test/validation gate tying schemas, cross-file invariants, lifecycle reconciliation and public-build checks together.

Correction: automated pre-persist/pre-deploy checks for JSON validity, schema conformance, canonical-state uniqueness, lifecycle invariants, tip/result grading, checkpoint chronology, contradiction resolution references, player coverage and broken data dependencies.

### TI-024 — Static public pages do not expose the repository snapshot they are rendering
Severity: MEDIUM

A live view timestamp tells the user when the browser rendered, not which evidence snapshot or commit is being shown. This can obscure GitHub Pages propagation lag.

Correction: expose canonical snapshot ID / audited commit / data manifest version and distinguish `RENDER_STALE` from repository persistence.

## Tier Infinity invariant set required before certification

1. One canonical object for each factual domain.
2. Every persistent domain schema-valid.
3. Every public view traceable to one atomic snapshot manifest.
4. No fabricated timestamps or inferred provenance.
5. Checkpoint and fixture lifecycle generated by one state machine.
6. Late capture and missed-capture semantics machine-enforced.
7. Contradictions first-class and resolvable without deletion.
8. Public current state and historical audit history shown together, not confused.
9. Every genuine tip frozen once, graded once, never rewritten.
10. Every incorrect tip blocks learned-weight propagation until audit completion.
11. Information-advantage events persisted, not merely described.
12. Every current roster player resolved at data layer and accurately surfaced publicly.
13. Market probability normalization and >3 percentage-point uplift gate machine-checkable.
14. Research source identity/version linked into evidence lineage.
15. Public terminology translated while raw codes remain auditable.
16. Repository persistence and GitHub Pages render state independently verifiable.
17. Automated invariant tests before every deploy.

## Repair order

**Gate 1 — Truth consolidation:** TI-001, TI-002, TI-003, TI-004, TI-005.

**Gate 2 — Contract enforcement:** TI-006, TI-007, TI-011, TI-012, TI-013, TI-023.

**Gate 3 — Public/data parity:** TI-008, TI-009, TI-014, TI-015, TI-016, TI-017.

**Gate 4 — Interface coherence:** TI-018, TI-019, TI-020, TI-024.

**Gate 5 — Longitudinal intelligence maturity:** TI-021, TI-022 and source-performance / information-advantage accumulation.

## Snapshot disposition

The audited snapshot is suitable as a development evidence system, but it is **not yet Tier Infinity compliant** because canonical-state uniqueness, temporal-state enforcement, schema consistency and public/data parity are not guaranteed mechanically.

No historical evidence, frozen decision, result or failure audit should be deleted to fix these defects. Repairs must consolidate truth and add explicit resolution/version relationships while preserving the audit trail.
