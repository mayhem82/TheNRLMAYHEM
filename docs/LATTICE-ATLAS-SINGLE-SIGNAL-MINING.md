# Lattice Atlas — Multidimensional Retrospective Signal Mining

Status: ACTIVE ARCHITECTURE — NEVER COMPLETE

## NRL MAYHEM operating model

The NRL implementation is not a gated investigation chain.

It is a continuously expanding intelligence system that:

1. ingests new verified observations and historical material;
2. analyses every available relationship that can be derived without temporal contamination;
3. maps those relationships across all available dimensions;
4. preserves the resulting evidence, analyses, contradictions, failures and discoveries;
5. feeds every new addition back through the existing analytical and relational surfaces;
6. expands again whenever new evidence, a new axis, a new transform, a new relationship or a new failure becomes available.

There is no Evidence Freeze gate, Analysis Freeze gate, stage-completion gate or terminal completion state in NRL MAYHEM.

Snapshots may be frozen for provenance and reproducibility, but a frozen snapshot does not freeze the intelligence system. It preserves what was known at that point while the live architecture continues to grow around it.

The correct operating loop is therefore:

**INGEST → ANALYSE → MAP RELATIONSHIPS → PERSIST → RE-INGEST EXPANDED STATE → ANALYSE AGAIN**

The loop is recursive and unbounded.

DFAPTA is used here as the unbounded analytical-distribution principle: available evidence can be distributed across as many independent analytical paths as the evidence supports. No fixed path count, fixed catalogue or mandatory stopping point exists.

The Lattice Atlas maps the resulting multidimensional relationship space. It does not wait for an analysis gate to open and does not close when a map has been produced. Every new observation, path, axis or relationship can alter the Atlas while prior snapshots remain preserved.

## Purpose

Extend the retrospective single-signal search from a small set of hand-selected statistics into a Lattice Atlas that scans the evidence space across every defensible pre-match axis.

The Lattice Atlas does not assume that the strongest signal will be obvious, linear, stable across the whole season, or visible on only one scale. It treats every fixture as a point inside a multidimensional evidence lattice and tests each axis, transformation, threshold, temporal window and subgroup without permitting post-kickoff leakage.

The aim is not to create an opaque model. The aim is to discover simple, reproducible signals, relationships, boundaries, contradictions and emergent structures hidden inside the available evidence.

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

Threshold definitions are versioned so that later changes remain distinguishable from earlier observations. Retrospective associations remain explicitly retrospective rather than being rewritten as if known prospectively.

### Team-dependence axis

Every promising signal is re-tested:

- with each team removed one at a time;
- by team;
- against top-performing teams;
- against lower-performing teams;
- for favourites and underdogs once verified market data is available.

A signal carried primarily by one dominant team is recorded as team-dependent rather than universal.

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

Signal performance remains inspectable by evidence-quality class.

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

Every transform remains separately identifiable. No transform is silently substituted after observing outcomes.

## Temporal lattice rule

The Atlas is explicitly time-indexed. For fixture F at time T, every value used by a candidate signal must be computable solely from evidence available before T.

For round-based historical reconstruction, same-round results are withheld until all fixtures in that round have been evaluated unless verified kickoff ordering proves an earlier fixture had finished before a later fixture's pre-match cutoff and the candidate definition explicitly allows real-time intra-round updating.

Default retrospective mode remains conservative: earlier rounds only.

## Unbounded analysis distribution

Every new validated observation may be distributed through DFAPTA across independent analytical paths.

Paths are created from what the evidence permits, not from a predefined list. They may test statistical, temporal, relational, team-specific, opponent-specific, venue, competition-state, market, player, weather, source-quality or newly discovered relationships.

A path may:

- confirm an existing relationship;
- contradict another path;
- expose a hidden dependency;
- discover a new axis;
- expose a false signal;
- identify a threshold or regime change;
- reveal a temporal reversal;
- reveal a team-specific effect;
- produce no useful relationship.

All outcomes survive. A failed path remains intelligence about the search space.

New paths do not replace old paths. They expand the analytical surface available to the Lattice Atlas.

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

Identify fixtures where two historically strong single signals disagree. These become high-value analytical surfaces.

### Relationship scan

For each new axis or observation, test its relationships with every existing compatible axis rather than only adjacent or intuitively related variables.

### Recursive expansion scan

When a new relationship is found, derive the additional defensible questions created by that relationship and distribute those questions into new analytical paths. The discovery process therefore expands the search space rather than merely filling a predefined matrix.

## Required metrics

Every candidate persists at minimum:

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
- forward-observation status where applicable.

High hit rate with low coverage is not presented as equivalent to a slightly lower hit rate over most fixtures.

## Multiplicity and discovery control

The Atlas may test hundreds, thousands or eventually far more candidates. This creates a multiple-testing problem but does not justify narrowing the search.

Instead:

- raw historical accuracy is labelled discovery evidence;
- candidates are ranked by both accuracy and support;
- minimum sample support is displayed explicitly;
- confidence intervals are displayed;
- stability through time is measured;
- leave-one-team-out sensitivity is measured;
- repeated near-duplicate transforms are grouped as a signal family;
- the best member of a large threshold sweep is identified as threshold-mined rather than treated as independent proof;
- future observations continuously test whether previously discovered relationships persist, weaken, reverse or fragment.

There is no promotion gate that stops analysis. Classification controls how a relationship is described, not whether the system is permitted to keep analysing it.

## Lattice output classes

`DISCOVERED_CANDIDATE` — a measurable pre-match signal or threshold exists.

`RETROSPECTIVE_ASSOCIATION` — historical performance measured.

`TEMPORALLY_UNSTABLE` — aggregate accuracy hides material degradation or reversal over time.

`TEAM_DEPENDENT` — apparent performance materially depends on one or a small number of teams.

`LOW_COVERAGE_HIGH_ACCURACY` — high hit rate but limited applicability.

`BASELINE_EQUIVALENT` — does not materially outperform the appropriate simple baseline.

`ROBUST_RETROSPECTIVE_CANDIDATE` — survives leakage, temporal, coverage, team-dependence and sensitivity testing to the current snapshot.

`FORWARD_OBSERVATION_ACTIVE` — the relationship is being observed prospectively without erasing its retrospective origin.

`FAILED_SIGNAL` — failed falsification or later observation.

Nothing is deleted when it fails. Failure is retained as part of the lattice and remains available to future relationship mapping.

## Relationship to the existing Single-Signal Search

The current Single-Signal Search is the human translation surface for one subset of the Atlas.

The underlying intelligence system is much larger than that page. The public interface should progressively expose:

- strongest supported candidates;
- strongest high-coverage candidates;
- strongest low-coverage candidates;
- temporally stable candidates;
- unstable candidates;
- team-dependent candidates;
- active forward observations;
- contradictions between signals;
- emergent cross-axis relationships;
- clickable exact breakdowns by axis, round, team, threshold and fixture.

The raw lattice remains persistent and auditable while continuously expanding.

## Governing principle

**NRL MAYHEM does not traverse gates. It continuously ingests, analyses and maps relationships. Every new piece of information can create new analytical paths, new axes and new relationships. Prior snapshots survive; the intelligence system keeps expanding.**

Complexity belongs in discovery. Translation belongs at the interface. Provenance survives both.
