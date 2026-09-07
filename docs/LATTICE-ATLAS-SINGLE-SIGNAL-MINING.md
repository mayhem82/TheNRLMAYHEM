# Lattice Atlas — Multidimensional Retrospective Signal Mining

Status: ACTIVE ARCHITECTURE — NEVER COMPLETE

## Purpose

Extend the retrospective single-signal search from a small set of hand-selected statistics into a Lattice Atlas that scans the evidence space across every defensible pre-match axis.

The Lattice Atlas does not assume that the strongest signal will be obvious, linear, stable across the whole season, or visible on only one scale. It treats every fixture as a point inside a multidimensional evidence lattice and tests each axis, transformation, threshold, temporal window and subgroup without permitting post-kickoff leakage.

The aim is not to create an opaque model. The aim is to discover simple, reproducible signals and boundaries that may be hidden inside the existing evidence.

## Core lattice dimensions

### Temporal axis

Test the same statistic at multiple historical windows and temporal positions:

- full season-to-date;
- previous 2 matches;
- previous 3 matches;
- previous 5 matches;
- previous 8 matches where available;
- previous match only;
- early / middle / late season;
- round number;
- days since previous match where verified;
- performance trajectory: improving, declining or flat;
- streak length;
- time since last win;
- time since last loss;
- persistence of an advantage across consecutive rounds.

No result from the current fixture or any later fixture may enter a pre-match observation.

### Attack axis

Candidate pre-match measures include:

- points scored cumulative;
- average points scored;
- rolling points scored;
- scoring median;
- scoring variance;
- minimum and maximum recent scores;
- frequency above scoring thresholds;
- attack trend / slope;
- attack differential relative to opponent;
- change in attack from earlier season baseline.

### Defence axis

Candidate measures include:

- points conceded cumulative;
- average points conceded;
- rolling points conceded;
- concession median;
- concession variance;
- frequency below defensive thresholds;
- defence trend / slope;
- defensive differential relative to opponent;
- change in defence from earlier season baseline.

### Margin axis

Candidate measures include:

- cumulative points differential;
- average margin;
- rolling mean margin;
- rolling median margin;
- margin variance;
- absolute margin;
- proportion of close games;
- proportion of large wins;
- proportion of large losses;
- recent margin trajectory;
- opponent-relative margin gap.

### Outcome axis

Candidate measures include:

- cumulative win rate;
- rolling win rate;
- previous-match outcome;
- streak length;
- recovery after loss;
- continuation after win;
- performance after large win;
- performance after large loss;
- frequency of alternating outcomes;
- draw state where applicable.

### Venue / side axis

Where the historical state is genuinely available:

- home / away designation;
- home win rate entering fixture;
- away win rate entering fixture;
- home scoring differential;
- away scoring differential;
- venue-specific record;
- neutral venue classification.

### Relative-opponent axis

For every scalar statistic, test the relative difference between the two teams rather than only the raw team values:

- absolute gap;
- signed gap;
- ratio where denominator is valid;
- percentile gap;
- thresholded gap;
- dominance state where one team leads on both attack and defence;
- disagreement state where one leads attack and the other defence.

### Variance / stability axis

Accuracy may emerge from consistency rather than average performance. Test:

- scoring standard deviation;
- concession standard deviation;
- margin standard deviation;
- coefficient of variation where meaningful;
- stable versus volatile form;
- volatility gap between opponents;
- variance after wins versus losses.

### Threshold axis

Every continuous pre-match statistic should be tested for regime boundaries rather than only rank ordering.

Examples:

- points-differential gap >= 20, 40, 60, 80, 100, etc.;
- recent-margin gap >= selected thresholds;
- win-rate gap >= selected thresholds;
- scoring gap >= selected thresholds;
- defensive gap >= selected thresholds;
- streak length >= selected thresholds.

Threshold candidates must be versioned and evaluated across the entire eligible sample. A threshold discovered from the same outcomes it is evaluated against remains retrospective association until prospective validation.

### Team-dependence axis

Every promising signal must be re-tested:

- with each team removed one at a time;
- by team;
- against top-performing teams;
- against lower-performing teams;
- for favourites and underdogs once verified market data is available.

A signal carried primarily by one dominant team is not treated as universal.

### Season-phase axis

Test whether a signal is stable across:

- early season;
- middle season;
- late season;
- finals when available;
- pre-Origin / Origin-period / post-Origin segmentation where verified and relevant;
- before and after major competition-state changes where objectively defined.

### Evidence-quality axis

Every observation carries its temporal and evidentiary quality:

- DIRECT_PREMATCH_CAPTURE;
- RECONSTRUCTED_FROM_PRIOR_VERIFIED_RESULTS;
- OFFICIAL_PRIMARY;
- INDEPENDENT_SECONDARY;
- UNVERIFIABLE_FOR_FIXTURE;
- LEAKAGE_CONTAMINATED.

Signal performance must be inspectable by evidence-quality class.

## Transform lattice

For each eligible base statistic, test interpretable transforms separately:

- raw value;
- opponent difference;
- absolute difference;
- ratio;
- rolling mean;
- rolling median;
- slope / trend;
- variance;
- z-score within the team's own prior history where sample size permits;
- percentile within competition-to-date;
- threshold indicator;
- change from previous window;
- acceleration / second-order change where sufficiently sampled.

Every transform is a separate versioned signal. No transform may be silently substituted after observing outcomes.

## Temporal lattice rule

The Atlas is explicitly time-indexed. For fixture F at time T, every value used by a candidate signal must be computable solely from evidence available before T.

For round-based historical reconstruction, same-round results are withheld until all fixtures in that round have been evaluated unless verified kickoff ordering proves an earlier fixture had finished before a later fixture's pre-match cutoff and the candidate definition explicitly allows real-time intra-round updating.

Default retrospective mode remains conservative: earlier rounds only.

## Search modes

### Axis scan

Test one variable or transform at a time across every eligible fixture.

### Threshold scan

Test deterministic cut-points for one variable while preserving each threshold as a separate candidate.

### Temporal-window scan

Run the same signal across multiple windows to determine whether predictive value is persistent or scale-dependent.

### Stability scan

Measure accuracy, coverage and failure clustering through time.

### Exclusion scan

Repeat performance with each team, round band or evidence class removed to identify hidden dependence.

### Contradiction scan

Identify fixtures where two historically strong single signals disagree. These become high-value audit cases.

## Required metrics

Every candidate must persist at minimum:

- eligible fixtures;
- selections;
- correct;
- incorrect;
- no-selection;
- raw accuracy;
- coverage;
- Wilson or equivalent binomial confidence interval;
- lift over relevant baseline;
- round-by-round accuracy;
- first-half / second-half season accuracy;
- longest correct run;
- longest incorrect run;
- team-dependence diagnostics;
- leave-one-team-out minimum and maximum accuracy;
- threshold or transform definition;
- temporal window;
- evidence-quality breakdown;
- falsification state;
- prospective-validation state.

High hit rate with low coverage must never be presented as equivalent to a slightly lower hit rate over most fixtures.

## Multiplicity and discovery control

The Atlas may test hundreds or thousands of candidates. That creates a multiple-testing problem.

Therefore:

- raw historical accuracy is discovery evidence only;
- candidates are ranked by both accuracy and support;
- minimum sample-size gates are explicit;
- confidence intervals are displayed;
- stability across time is mandatory;
- leave-one-team-out sensitivity is mandatory for promotion;
- repeated near-duplicate transforms are grouped as a signal family;
- the best member of a large threshold sweep is not treated as independently discovered proof;
- prospective freeze remains the promotion gate.

## Lattice output classes

`DISCOVERED_CANDIDATE` — a measurable pre-match signal or threshold exists.

`RETROSPECTIVE_ASSOCIATION` — historical performance measured.

`TEMPORALLY_UNSTABLE` — aggregate accuracy hides material degradation or reversal over time.

`TEAM_DEPENDENT` — apparent performance materially depends on one or a small number of teams.

`LOW_COVERAGE_HIGH_ACCURACY` — high hit rate but limited applicability.

`BASELINE_EQUIVALENT` — does not materially outperform the appropriate simple baseline.

`ROBUST_RETROSPECTIVE_CANDIDATE` — survives leakage, temporal, coverage, team-dependence and sensitivity tests but is not yet prospective evidence.

`PROSPECTIVE_VALIDATION_ACTIVE` — rule is frozen for future fixtures.

`FAILED_SIGNAL` — failed falsification or prospective validation.

Nothing is deleted when it fails. Failure is retained as part of the lattice.

## Relationship to the existing Single-Signal Search

The current Single-Signal Search becomes the human translation surface for the Atlas.

The Lattice Atlas is the discovery engine underneath it. The public page should not expose thousands of machine candidates as an unreadable list. It should surface:

- strongest supported candidates;
- strongest high-coverage candidates;
- strongest low-coverage candidates;
- temporally stable candidates;
- unstable candidates;
- team-dependent candidates;
- current prospective-validation candidates;
- clickable exact breakdowns by axis, round, team, threshold and fixture.

The raw lattice remains fully persistent and auditable.

## Governing principle

Search every defensible axis, but never collapse dimensions in a way that hides what generated the signal.

Complexity belongs in discovery. Translation belongs at the interface. Provenance survives both.
