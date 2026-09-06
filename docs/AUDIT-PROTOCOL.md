# MAYHEM NRL Audit Protocol

Canonical governance snapshot: GOVERNANCE-2026-09-06-TI-001

Every fixture is a time-bounded evidence object. The official kickoff controls checkpoint due times and Australia/Sydney is the operational timebase.

## Canonical lifecycle

`UPCOMING → MATCH_WINDOW → RESULT_VERIFICATION_PENDING → VERIFIED_RESULT`

A result more than three hours past kickoff must not remain represented as live. If the result has not yet been verified, the fixture becomes `RESULT_VERIFICATION_PENDING`.

## Checkpoints

- T-24h — opening intelligence and roster scan.
- T-3h — team availability, player evidence, weather and market refresh.
- T-60m — official late mail, roster reconciliation and final intelligence scan.
- T-10m — immutable evidence freeze and MAYHEM decision lock.
- POST — result verification, public grading, calibration eligibility, information-advantage review and post-match audit.

If a checkpoint due time is missed but kickoff has not occurred, execute it as soon as practicable and record `CAPTURED_LATE_BEFORE_KICKOFF`. Preserve both original due time and genuine capture time. Use only evidence available at the later capture. Never backdate.

If kickoff has already occurred, an uncaptured pre-match checkpoint becomes `MISSED_NOT_CAPTURED`. It is never reconstructed from post-kickoff information.

Canonical capture states are `PENDING`, `CAPTURED_IN_WINDOW`, `CAPTURED_LATE_BEFORE_KICKOFF`, `MISSED_NOT_CAPTURED`.

## Evidence and signal separation

Evidence state: `VERIFIED`, `UNVERIFIED`, `CONTRADICTED`, `SIGNAL`, `UNKNOWN`.

Signal state is a separate analytical layer and must not overwrite source fact. Source facts, MAYHEM inference, market response, decision effect and post-match interpretation remain separately identifiable.

## Contradictions

Contradictions are first-class records. Resolution state is `OPEN`, `RESOLVED` or `UNRESOLVED`. A resolved contradiction must preserve the superseded state and record `resolved_to`, resolving source snapshot, resolution event and resolution timestamp. Resolution never deletes the earlier observation.

## Freeze rule

At T-10m, or a genuine later pre-kickoff capture when the scheduled freeze was missed, the frozen selection and probability become immutable. Post-match work may grade and audit them but cannot rewrite them.

## Mandatory pre-freeze gates

Before confidence is frozen: normalize reliable two-sided market prices; establish season/recent/venue structural baseline; identify evidence-family dependence; build the strongest opposing case; record falsification conditions; treat debutants/low-sample players as uncertainty unless directional evidence exists; compare role-critical player profiles.

If MAYHEM confidence exceeds normalized market probability by more than 3 percentage points, independent evidence plus an explicit football mechanism is required. Otherwise reduce confidence or mark `REVIEW_REQUIRED`.

## Grading and failure audit

A genuine pre-match selection with a verified winner is graded `CORRECT` or `INCORRECT`. Calibration metadata never suppresses public grading.

Every `INCORRECT` tip triggers a forensic failure audit before learned weighting can affect a later freeze. Frozen history remains unchanged. Post-kickoff events are separated from pre-match analytical defects.

## Information advantage

Information advantage is persisted in the Information Advantage Ledger with public availability time, capture time, fragments, inference, market state, decision effect, frozen state and outcome validation. Classes: `NONE`, `POSSIBLE`, `CORROBORATED`, `DEMONSTRATED`. Correct outcome alone never demonstrates advantage.

## Canonical-state rule

Each factual domain has one canonical persistent store. Public HTML is a derived view only. Browser-side patching must not conceal stale canonical data.

Every public rendering must identify a snapshot manifest. Mixed-version rendering is a degraded state, not a valid current view.

## Persistence rule

Repository persistence and public GitHub Pages propagation are distinct. A successful repository write must be read back. If repository persistence fails report `PERSISTENCE_FAILED`; if repository data is current but Pages remains stale report `RENDER_STALE`.
