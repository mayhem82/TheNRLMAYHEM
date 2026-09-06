# MAYHEM New Sport Thread Bootstrap

Status: ACTIVE REFERENCE
Reference implementation: `mayhem82/TheNRLMAYHEM`
Purpose: reusable instruction set for starting a new sport repository in a separate ChatGPT thread without importing NRL-specific assumptions as universal rules.

## Explicit-reference boundary

The GitHub repository is public infrastructure. The MAYHEM intelligence system is private operational context.

Public accessibility does not make this repository or its intelligence architecture general conversational context.

A ChatGPT thread must not discover, introduce, access, reference, disclose, reuse or infer from `mayhem82/TheNRLMAYHEM`, its public site, its files, its architecture, or any MAYHEM sport implementation merely because the material is publicly accessible or known from another conversation.

The repository becomes in-scope only when the user explicitly references the repository, the NRL MAYHEM system, a specific MAYHEM sport implementation, or explicitly directs the current thread to use it. A bootstrap instruction naming this repository is an explicit reference for that thread.

Do not treat memory of the repository's existence as authorization to introduce it into an unrelated thread. Do not use an unrelated request as a reason to search for MAYHEM repositories. Do not expose private operational reasoning, unreleased analysis, provisional intelligence, internal weighting or other private intelligence merely because related public infrastructure exists.

This is a contextual-use boundary, not a claim of technical secrecy. GitHub public repositories are independently discoverable on the public internet. Anything actually committed to a public repository must therefore be treated as publicly accessible information.

## Thread-start instruction

Paste or point the new thread at this file and give it the target sport and repository name.

Use `mayhem82/TheNRLMAYHEM` as the first reference implementation for a new MAYHEM sport repository.

Transplant the architecture, not the NRL assumptions.

Build the new repository as an independent sport implementation. Do not clone NRL-specific rules, terminology, scoring, participant structure, team-list structure, finals structure, player-stat fields, market behaviour or source hierarchy unless they are independently verified as valid for the target sport.

Treat `docs/SPORT-DOMAIN-ARCHITECTURE.md` and `data/live-state-contract.json` in TheNRLMAYHEM as the initial portable Sport Domain reference. Treat every other NRL-specific mechanism as a candidate implementation detail until tested.

The repository has no COMPLETE state. It has VERIFIED SNAPSHOTS. Never declare the architecture, evidence universe, capability set or sport model complete.

Start by researching and freezing the target sport's own domain model before building prediction logic. Establish, with authoritative sources where possible:

- governing competition and season structure;
- event lifecycle and scheduling;
- participant structure: team, individual, pair, field or other;
- selection, lineup, availability and substitution mechanisms;
- scoring system and result states;
- draws, ties, overtime, extra time, abandoned/postponed events and other exceptional result states;
- competition points, rankings, qualification, finals/playoffs/tournament progression where applicable;
- official statistics and their definitions;
- injury, suspension, withdrawal and eligibility mechanisms;
- weather/environment relevance;
- market types and reliable market sources;
- official live-score and live-event-state sources;
- official result-verification sources;
- source hierarchy and source-class mapping;
- terminology requiring a sport-specific glossary.

Then classify every discovered mechanism as one of:

`PORTABLE_CANDIDATE` — appears compatible with the existing Sport Domain primitive but is not yet cross-sport proven.

`SPORT_SPECIFIC` — belongs only to this sport/competition implementation unless later evidence supports portability.

`PORTABLE_CONFIRMED` — may only be assigned after comparison with at least one other sport implementation demonstrates that the mechanism survives transplantation without sport-specific distortion.

Preserve the MAYHEM integrity rules from the reference implementation:

- exact source and capture provenance;
- no manufactured timestamps;
- no hindsight contamination of frozen pre-event decisions;
- explicit lifecycle reconciliation before analysis;
- explicit contradiction preservation and resolution;
- genuine pre-event decision freeze;
- result verification before grading;
- mandatory failure audit for incorrect genuine predictions;
- calibration only from genuine contemporaneous probabilities;
- source-performance learning only from accumulated audited evidence;
- information-advantage claims require temporal evidence and cannot be inferred from a correct result alone;
- public current state and historical audit history must remain distinguishable;
- repository persistence and public-render state are independently verifiable;
- missing capability is an expansion target, not a reason to falsify earlier verified snapshots.

Build canonical data objects first. Public HTML is a derived view, never an independent factual store. Use one canonical object per factual domain and schema-govern persistent objects. Add automated invariant validation before treating a snapshot as passing its current gates.

Where reliable live data exists, implement the Sport Live State contract without allowing live/post-start evidence to rewrite the frozen pre-event evidence set.

Create a sport-specific glossary and source registry early. Public-facing terminology should be ordinary-language first, with raw internal codes retained only as audit metadata.

Do not force the target sport into an NRL-shaped user interface. Let the target sport's information structure determine the public surfaces while preserving the portable audit architecture underneath.

At the end of each meaningful architecture expansion, record what was learned about portability:

- mechanisms confirmed as sport-specific;
- mechanisms that appear portable but remain candidates;
- failed generalisations from TheNRLMAYHEM;
- new primitives discovered that should be tested in other sport repositories;
- changes that a future Sporting Domain master portal would need to understand.

Do not modify TheNRLMAYHEM merely to make the new sport fit. The first repository remains historical evidence of the first implementation. Cross-sport convergence should occur later through evidence-driven Sport Domain extraction, not by forcing repositories into premature uniformity.

## Minimal new-thread opening

A short opening can be:

`Explicitly reference mayhem82/TheNRLMAYHEM for this thread only as the first MAYHEM sport-domain reference implementation. Read docs/NEW-SPORT-THREAD-BOOTSTRAP.md, docs/SPORT-DOMAIN-ARCHITECTURE.md and data/live-state-contract.json. Target sport: [SPORT]. Target repository: [OWNER/REPO]. Transplant the architecture, not the NRL assumptions. Research the sport-specific domain model first, then build autonomously from verified evidence. Never treat the repository as complete; use verified snapshots. Do not introduce or reuse this repository in unrelated threads unless I explicitly reference it there.`

## Future Sporting Domain portal

Do not build the master Sporting Domain portal from NRL alone. Wait until multiple independent sport repositories exist. The portal should then be derived from observed common structures across implementations and should aggregate repository-level state without becoming the canonical factual store for any individual sport.