# The NRL MAYHEM

Persistent, auditable NRL tipping and football intelligence for the 2026 NRL season.

The repository records the complete fixture lifecycle, player and team evidence, statistical dossiers, matchup memory, market and weather intelligence, frozen MAYHEM decisions, results, failure audits and validated post-match learning.

## Core intelligence hierarchy

Source → Observation → Player → Team Baseline → Continuity Delta → Matchup → Match → Market → Frozen Decision → Outcome → Audit → Learned Weight → next Match.

Each layer must remain attributable to the evidence beneath it. A downstream conclusion cannot silently rewrite its source facts.

## Integrity rules

No hindsight contamination. Historical results are not retroactive MAYHEM tips. A genuine pre-match selection is frozen before kickoff and can later be graded, never rewritten.

If a scheduled checkpoint is missed but kickoff has not yet occurred, the checkpoint must still be executed as soon as practicable and recorded as `CAPTURED_LATE_BEFORE_KICKOFF`. The original due time and the genuine later capture time are both preserved. The late capture uses only evidence actually available at the later capture time and must never be represented as evidence known at the original due time. If kickoff has already occurred, an uncaptured pre-match checkpoint remains `MISSED_NOT_CAPTURED`; it is not reconstructed from post-kickoff information.

A genuine pre-match team selection with a verified result is always publicly graded `CORRECT` or `INCORRECT`. Internal calibration eligibility cannot suppress or qualify the ordinary tipping result.

Missing player statistics, source fields or profiles are explicitly recorded as unavailable rather than guessed. Low-sample players and debutants are uncertainty unless evidence establishes a directional effect.

## Match audit cycle

- T-24h — initial intelligence and roster scan
- T-3h — team availability, player evidence, weather and market refresh
- T-60m — late mail, roster reconciliation and final intelligence scan
- T-10m — evidence freeze, mandatory pre-freeze gates and MAYHEM decision lock
- Post-match — result verification, tip grading, player/team/matchup audit, calibration, information-advantage review and validated learning

Automation timebase: Australia/Sydney. If an official kickoff changes, future checkpoints are recalculated.

Fixture lifecycle is reconciled before future checkpoint work:

`UPCOMING → MATCH_WINDOW → POST_MATCH / RESULT_VERIFICATION_PENDING → VERIFIED_RESULT`

A fixture more than three hours beyond kickoff is never left indefinitely active merely because a result has not yet been acquired.

## Player intelligence architecture

Every currently named starter, interchange player and reserve is represented in the persistent player layer whether or not the player has a special news item.

Where official data is available, player dossiers capture career and current-season baselines, attack, defence, running, kicking and fantasy statistics plus genuine per-round history. Recent workload, positional continuity and production trends are derived only from real historical observations and remain separate from the underlying source facts.

Player observations retain source, capture time and classification: `VERIFIED`, `UNVERIFIED`, `CONTRADICTED` or `SIGNAL`.

Validated player evidence feeds upward into team and matchup intelligence; absence of news does not make a rostered player disappear.

## Team macro intelligence

Team memory is longitudinal and append-oriented. It accumulates season trajectory, recent attack and defence, personnel burden, unit continuity, rotation/rest/finals management, venue and travel context, demonstrated weather effects, market behaviour, conflicts, source reliability, calibration history and information-advantage history.

Completed matches update the longitudinal record without overwriting the state that existed before kickoff.

## Portable Continuity Intelligence

The NRL MAYHEM includes a Portable Continuity Intelligence layer adapted from the structural method of the Persona Continuity Risk Engine (PCRE). It imports the architecture — baseline, delta, interacting vectors, pressure response, continuity testing, containment and evidence lineage — rather than personality conclusions.

Six football continuity vectors are maintained:

1. **Structural Baseline** — season W-L, points for/against, point differential and scoring rates.
2. **Recent Performance Delta** — current output measured against the season baseline rather than compressed into a generic form label.
3. **Role and Personnel Continuity** — named roles, availability, returns, withdrawals, combinations and replacement effects compared with the prior team state.
4. **Adaptability Under Pressure** — repeated evidence of performance under injury, rotation, weather, finals pressure or opponent-specific disruption. A single successful change does not establish a stable trait.
5. **Decision Continuity** — tests whether a MAYHEM selection remains supported by current evidence or survives only because an earlier narrative is being defended.
6. **Outcome Continuity** — tests whether post-match evidence reinforces, contradicts or leaves unresolved the structural model without treating the result itself as causal proof.

### Continuity Delta

The current transparent operational comparison is:

`recent last-five point differential per match − season point differential per completed match`

Operational magnitude bands:

- VERY_LOW — absolute delta < 2 points per match
- LOW — 2 to <5
- MODERATE — 5 to <10
- MATERIAL — ≥10

These are audit bands, not claims of statistical significance.

### Portable football lattice

Season Structural Baseline → Recent Performance Delta → Roster / Role Continuity → Pressure Event → Weather + Venue + Matchup → Market State → Persist With Selection or Adapt → Frozen Decision → Outcome Validation → Failure / Success Audit → Learned Weight.

### Containment controls

The continuity layer explicitly guards against evidence compression, selection inertia, recent-form dominance, club-reputation or legacy inertia, low-sample overreach and narrative continuity masking substantive change.

If personnel, role, weather, matchup or market evidence changes materially, MAYHEM must expose the delta before claiming that the original football rationale remains intact.

## Matchup memory

Matchup intelligence stores only evidence-supported structural tendencies and relevant prior interactions. Observed facts remain separate from MAYHEM inference. Historical head-to-head results alone are not treated as causal evidence.

## Market absorption clock

Reliable market states and material movements are timestamped. Market movement without a verified cause remains `SIGNAL` rather than proof of why the market moved.

When reliable two-sided prices are available, MAYHEM calculates an overround-adjusted market probability before freezing a decision.

## Mandatory pre-freeze gates

Before a MAYHEM confidence can be frozen, the engine must establish the structural baseline, normalize reliable market prices, identify evidence-family dependence, construct the strongest evidence-supported opposing case, identify falsification conditions, treat debutant/low-sample uncertainty correctly and compare role-critical player statistical profiles.

If MAYHEM confidence exceeds normalized market probability by more than three percentage points, the uplift requires independent evidence and an explicit football mechanism. Otherwise confidence must be reduced or the decision marked `REVIEW_REQUIRED`.

## Prediction failure audit

Every genuine `INCORRECT` tip is a MAYHEM failure event.

The frozen prediction remains unchanged. The audit reconstructs only information genuinely available before kickoff and tests confidence inflation, correlated-evidence stacking, structural-baseline suppression, roster/role underweighting, player-statistical underweighting, market-normalization error, narrative dominance, variance misclassification, missing counter-case and source-weight defects.

Post-kickoff events are separated from pre-match analytical defects. Learned weighting cannot flow from an incorrect tip until its failure audit is complete.

## Information Advantage Ledger

Potential information advantage is tracked temporally through signal availability, MAYHEM capture time, source class, evidence fragments, inference, market state, decision effect, frozen decision and outcome validation.

Classification is `NONE`, `POSSIBLE`, `CORROBORATED` or `DEMONSTRATED`. A correct result by itself never demonstrates an information advantage.

## Evidence and learning flow

Official evidence → statistical evidence → roster/player observations → team baseline → continuity delta → matchup intelligence → mandatory weather → market intelligence → corroboration and contradiction analysis → adversarial counter-case → frozen decision → verified outcome → audit → validated learning.

Evidence classifications: `VERIFIED`, `UNVERIFIED`, `CONTRADICTED`, `SIGNAL`.

Only audited post-match evidence may change future source reliability or learned weighting. Frozen pre-match states are never rewritten.

## Public operational interface

The GitHub Pages interface exposes:

- **Season** — fixtures, MAYHEM selections, genuine confidence and ordinary CORRECT/INCORRECT grading.
- **Intelligence** — current match reasoning, material evidence and visible Prediction Failure Audits.
- **Teams** — longitudinal team performance, macro intelligence and accumulated player effects.
- **Players** — persistent roster identities, current roles, verified 2026 performance statistics, career baselines and observations.
- **Audit Clock** — fixture lifecycle and checkpoint state.

Backend calibration mechanics remain internal unless they are required for an audit explanation. Persistence or render failures must be identified rather than represented as successful updates.

## Repository principle

The NRL MAYHEM is not a collection of isolated tips. It is an accumulating evidence system in which each match becomes auditable input to the next:

**Source → evidence → player → team → continuity → matchup → decision → outcome → audit → validated learning.**
