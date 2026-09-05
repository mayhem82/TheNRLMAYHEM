# The NRL MAYHEM — Intelligence Architecture

Adapted from the proven structural principles used in Central Missing Person Resolution, with NRL-specific semantics.

## Seven layers
1. Source snapshots — immutable captures of what a publisher or observable market stated at a specific time.
2. Raw intelligence observations — normalized observations extracted from snapshots without destroying the source representation.
3. Signal claims — explicit assertions about what an observation may mean. Fact and inference remain separate.
4. Conflict records — first-class contradictions between sources, states, markets or interpretations.
5. Temporal intelligence events — append-only changes positioned relative to official kickoff.
6. Frozen decision states — MAYHEM tip, confidence and supporting evidence locked before the event.
7. Derived current views and outcome audits — computed representations; never destructive.

## Pipeline
CAPTURE → NORMALISE → DIFF → CLAIM → CONFLICT → CORROBORATE → TEMPORALISE → INFER → MEASURE INFORMATION ADVANTAGE → DECIDE → FREEZE → OUTCOME → AUDIT

## Signal classifications
OBSERVED, POSSIBLE_SIGNAL, PROBABLE_SIGNAL, CORROBORATED_SIGNAL, CONFIRMED_FACT, CONFLICTING, EXCLUDED, UNKNOWN.

## Conflict classes
MARKET_VS_TEAM_NEWS
OFFICIAL_VS_SPECIALIST_REPORT
SOURCE_VS_SOURCE
EXPECTED_VS_CONFIRMED_LINEUP
INJURY_STATUS_CONFLICT
MARKET_MOVE_WITHOUT_KNOWN_CAUSE
SIGNAL_REVERSED

## Temporal rule
Later knowledge never erases earlier knowledge. A player can progress STARTING → QUESTIONABLE → OUT while all three states remain auditable with their timestamps and source snapshots.

## Diff rule
Each capture is compared with its predecessor. Changes are emitted as ADDED_RECORD, REMOVED_RECORD or FIELD_CHANGED. The change itself is an intelligence event.

## Conflict rule
Contradictions are preserved rather than silently reconciled. Automated logic may propose a conflict. Resolution requires stronger evidence and must itself be recorded as an event.

## Freeze rule
The pre-match decision state is immutable after its freeze checkpoint. Post-match evidence may grade the decision but cannot rewrite what MAYHEM knew or inferred beforehand.

## Derived-view rule
The website is a view of the evidence architecture, not the canonical evidence store. Current displays may change as new evidence arrives while historical snapshots, claims, conflicts, events and frozen decisions remain preserved.

## Information advantage
Information advantage is measured separately from tip accuracy. A correct result does not prove the intelligence was useful. The system must preserve the chain from public fragment to aggregation, inference, decision effect and outcome validation.