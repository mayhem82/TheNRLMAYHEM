# MAYHEM Sport Domain Architecture

Status: EXPANDING — NEVER COMPLETE
Established: 2026-09-06 AEST
First implementation: NRL

## Governing principle
MAYHEM has no COMPLETE state. It has VERIFIED SNAPSHOTS. A snapshot may pass its current validation gates without implying that the architecture, domain model, source universe, mechanisms or public capability set is complete.

Every new source, mechanism, contradiction, failure, sport or useful capability may extend the architecture and reopen the relevant validation surface.

## Two-layer model
### Sport Domain primitives
Portable mechanisms that can be tested across sports without assuming NRL-specific rules:
- scheduled fixtures and event lifecycle
- pre-event checkpoints and genuine capture time
- participants, selections, availability and role changes
- live event state and score state
- official result verification
- decision freeze and prediction provenance
- market state and normalized probability
- environmental conditions
- quantitative performance history
- evidence dependence and contradiction resolution
- outcome grading and calibration
- mandatory failure audit
- source-performance learning
- information-advantage temporal ledger
- competition progression / qualification state

### NRL implementation
NRL-specific mechanisms remain an implementation layer: 17-player match-day structure and reserves, NRL positions, interchange, judiciary, casualty/late-mail terminology, NRL ladder and finals mechanics, Minor Premiership, NRL Premiership, NRL statistical fields and NRL source hierarchy.

NRL-specific mechanisms must not silently become universal Sport Domain assumptions.

## Live State primitive
A Sport Domain implementation should be capable of representing live event state where reliable source data exists. The primitive is distinct from prediction evidence and cannot retroactively alter a frozen pre-event decision.

Minimum live state:
- event identity
- source identity
- source capture timestamp
- event status
- scheduled start
- actual/live state when published
- participant scores
- match clock / period when published
- last verified update
- stale-state indicator
- transition to result-verification pending
- transition to verified result

Live state is observational evidence. It may drive lifecycle reconciliation but must not contaminate the pre-event evidence set used to judge prediction quality.

## Expansion rule
Absence of a capability is an expansion opportunity, not proof that a prior verified snapshot was false. A prior snapshot remains an audit record of what was implemented and validated at that time. Claims of architectural or site 'completion' are prohibited.

## Cross-sport transplantation protocol
When a second sport is introduced:
1. preserve the NRL implementation unchanged as the first Sport Domain case;
2. map candidate shared mechanisms to Sport Domain primitives;
3. classify non-shared mechanisms as sport-specific;
4. test terminology, event lifecycle, participant structure, scoring, competition progression, markets and data availability independently;
5. promote a mechanism to the portable layer only after cross-sport evidence supports portability;
6. retain contradictions and failed generalisations as architecture evidence.

This makes the Sport Domain layer evidence-grown rather than designed by assumption.