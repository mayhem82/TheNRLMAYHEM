# MAYHEM NRL Audit Protocol

Every fixture is a time-bounded evidence object. The official kickoff controls the audit schedule.

## Checkpoints

- T-24h: opening intelligence scan.
- T-3h: team availability, injuries, roles and market refresh.
- T-60m: official late mail, final squads, material market movement and conditions.
- T-10m: evidence freeze; MAYHEM selection and confidence lock.
- Post-match: result grading and source/signal performance review.

All automation calculations use Australia/Sydney.

If official kickoff changes, future checkpoints are recalculated. Completed checkpoint records are retained and annotated, not deleted.

## Evidence states

- VERIFIED — directly supported by traceable evidence examined.
- UNVERIFIED — not established by available evidence.
- CONTRADICTED — directly contradicted by stronger traceable evidence.
- SIGNAL — potentially relevant observation not sufficient for factual treatment.

## Freeze rule

At T-10m the pre-match evidence state becomes immutable. Post-match work may add result, grading and calibration analysis but cannot alter the frozen tip, confidence, classifications or timestamp.

## No retroactive tips

Historical results may populate the fixture ledger. They are not MAYHEM predictions unless a genuine pre-match MAYHEM selection exists in the record.
