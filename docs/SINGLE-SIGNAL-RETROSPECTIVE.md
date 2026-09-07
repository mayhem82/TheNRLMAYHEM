# Retrospective Single-Signal Discovery

Status: ACTIVE INVESTIGATION — NEVER COMPLETE

## Purpose

Search retrospectively across every available 2026 NRL round for individual pre-match signals that, standing alone, have demonstrated unusually high directional accuracy.

This is not a search for a narrative explaining winners after the event. It is a systematic discovery and falsification process for simple signals that may have existed repeatedly before kickoff.

The objective is to determine whether any single observable variable could have selected the winner, or materially separated winners from losers, across a large proportion of matches without requiring the full MAYHEM evidence stack.

## Core rule

A candidate qualifies only when the signal was genuinely observable before the relevant match. Post-match statistics, hindsight classifications, reconstructed injury effects, final-score-derived variables and information first published after kickoff are prohibited as predictive inputs.

Historical availability must be established independently from predictive accuracy.

## Search universe

Run against all completed rounds and all completed fixtures for which the required pre-match observation can be established. Do not restrict discovery to rounds in which MAYHEM produced a prediction.

Candidate families include, but are not limited to:

- market favourite / normalized market probability;
- opening-to-close price direction;
- home or away status;
- ladder position and competition points entering the match;
- season points differential entering the match;
- recent scoring differential available before kickoff;
- previous-match result;
- winning or losing streak state;
- rest differential;
- travel state;
- venue record available before the match;
- confirmed lineup continuity;
- number of changes from the previous named side;
- key-position continuity;
- verified late withdrawals;
- verified returning players;
- debutant / low-sample participation;
- aggregate player availability or experience measures that can be reconstructed without hindsight;
- weather state known before kickoff;
- other single variables discovered during evidence review.

The candidate universe remains open. Discovery of a new signal family extends this investigation rather than completing it.

## Single-signal isolation

Each signal must be tested alone. Do not combine two weak signals and label the combination a single signal. Do not permit MAYHEM confidence, narrative judgment or another model output to leak into the signal definition.

Every signal requires an explicit deterministic selection rule capable of being applied to a fixture without knowing its result.

Examples:

`MARKET_FAVOURITE` -> select the participant with the lower verified pre-match price.

`SEASON_POINT_DIFFERENTIAL` -> select the participant with the superior season points differential immediately before the round.

If a rule produces a tie or has no valid pre-match observation, record `NO_SELECTION`; do not resolve it using another signal.

## Anti-hindsight controls

For every fixture observation preserve:

- round and fixture identity;
- scheduled kickoff;
- signal identifier and version;
- raw pre-match value for each participant where applicable;
- deterministic selection;
- source;
- source publication/capture time where recoverable;
- evidence that the value existed before kickoff;
- verified result;
- CORRECT, INCORRECT or NO_SELECTION;
- reconstruction status and uncertainty.

A signal whose historical pre-match state cannot be established must be classified `UNVERIFIABLE_FOR_FIXTURE`, not estimated from later data.

Signal definitions must be frozen before their reported full-season accuracy is accepted. Any definition changed after inspecting outcomes becomes a new version and must be retested across the entire eligible sample.

## Evaluation

For each signal calculate at minimum:

- eligible fixtures;
- selections made;
- correct selections;
- incorrect selections;
- no-selections / unverifiable fixtures;
- raw accuracy;
- coverage rate;
- accuracy by round;
- accuracy by favourite/underdog context where relevant;
- longest correct and incorrect runs;
- performance through time rather than only aggregate season accuracy.

Where probability is intrinsic to the signal, retain probability calibration separately from winner-selection accuracy.

Always compare candidate performance with simple baselines, particularly market favourite and other obvious low-complexity rules. A signal is not exceptional merely because its raw hit rate appears high.

## Accuracy classifications

Do not create a universal threshold that automatically converts a historical correlation into a predictive mechanism.

Use these evidence states:

`CANDIDATE` — plausible pre-match single signal identified.

`RETROSPECTIVE_ASSOCIATION` — historical accuracy measured but mechanism/robustness not established.

`ROBUST_SINGLE_SIGNAL` — survives temporal, coverage, leakage and sensitivity tests and materially exceeds the appropriate simple baseline.

`FAILED_SIGNAL` — does not survive testing or is not useful relative to baseline.

`LEAKAGE_CONTAMINATED` — definition or source contains information unavailable before kickoff.

`UNVERIFIABLE` — historical pre-match state cannot be established sufficiently.

No retrospective hit rate alone permits `ROBUST_SINGLE_SIGNAL` classification.

## Falsification

Actively search for where each apparently accurate signal fails. Test whether apparent performance is explained by:

- market favourite overlap;
- strong-team identity;
- ladder-position correlation;
- home-ground correlation;
- small samples;
- missing-data selection effects;
- late-season competition structure;
- source survivorship;
- retrospective definition tuning;
- information leakage;
- one anomalous run of matches.

A signal that collapses after controlling for an obvious proxy remains evidence, but it is not promoted as an independent advantage.

## Relationship to MAYHEM

This investigation does not replace the full MAYHEM architecture. It establishes a deliberately simple comparison layer.

If one accurate single signal exists throughout the season, MAYHEM must know it. If the full architecture repeatedly disagrees with a demonstrably stronger simple signal, those disagreements become mandatory audit targets.

If no exceptional single signal survives, that result also survives as evidence against unnecessary belief in simple predictive rules.

Successful and failed candidates remain in the retrospective register. Nothing is erased because it ceased to look promising.

## Required persistent outputs

The implementation should maintain an append-preserving candidate registry, fixture-level observation record, signal leaderboard, falsification record and version history. Public presentation may translate these into ordinary language, but the underlying evidence and provenance remain reconstructable.

## Forward validation gate

Retrospective discovery is hypothesis generation. Any candidate promoted beyond retrospective association must subsequently be frozen prospectively before matches and evaluated without alteration. Prospective failure does not erase retrospective performance; the divergence itself becomes evidence.
