---
name: grill-me
description: Relentlessly interview the user about a plan, requirement set, or feature PRD until every branch of the decision tree is resolved. Use when the user says "grill me", asks to stress-test a plan or design, or before approving 01-requirements.md or a FEAT PRD. Inspired by Matt Pocock's grill-me (MIT).
---

# Grill Me — pressure-test a plan before it becomes a contract

## When to run
- During /define, before the user approves 01-requirements.md (offer it).
- Before a FEAT PRD flips from draft to approved (offer it for complex features).
- Anytime the user says "grill me" about an idea, plan, doc, or decision.

## Interview discipline
1. **One question per turn. Never bundle.** Depth-first: finish a branch of
   the decision tree before opening another.
2. **Every question ships with your recommended answer** and a one-line
   rationale — give the user something concrete to accept or push against.
   Never ask a bare "what do you think?".
3. **Look before you ask.** If the answer already exists in the vault
   (foundation docs, PRDs, decision logs) or the codebase, read it instead
   of asking. Only ask what documents and code cannot settle.
4. **Track dependencies.** An answer in question 3 constrains question 7 —
   say so when it happens, and revisit earlier answers that a later answer
   contradicts.
5. **Push on the risky assumptions**: unstated edge cases, failure modes,
   scale/cost surprises, "who owns this?", what happens on day 2, and the
   steelman of NOT building it.
6. Keep going until both sides agree there are no unresolved branches, or
   the user says stop.

## Where the answers go (template integration — do this, don't just chat)
At the end of a grill session, write the outcomes into the vault:
- Settled product decisions → new/updated REQ rows in
  docs/00-foundation/01-requirements.md, or acceptance criteria in the
  target FEAT PRD (with change-history entries).
- Settled technical choices → the decision log in
  docs/00-foundation/06-decisions-risks-roadmap.md (or the contract doc's
  own log).
- Unresolved items → "Decisions needing an owner" in 06, or STATUS.md
  blockers for lite projects.
- New risks surfaced → the risks table in 06.
- Save a session transcript summary to docs/00-foundation/grill-sessions/
  <YYYY-MM-DD>-<topic>.md (create the folder on first use).
Then update STATUS.md if the session changed what should happen next.

## Never
- Never write application code during a grill session.
- Never soften into agreement to end the session faster — unresolved is
  unresolved; log it as such.
