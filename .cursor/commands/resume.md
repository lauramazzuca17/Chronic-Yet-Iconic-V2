Perform the session start protocol from AGENTS.md:
1. Read docs/30-state/STATUS.md, docs/10-features/_PRD-INDEX.md, and the PRD
   of any in-progress feature. If the Define gate is not yet passed
   (01-requirements.md not `approved`), say so — the next step is /define.
2. Reconcile disk vs docs: run `git status`/`git diff --stat`. If
   uncommitted changes exist, match them against STATUS.md "In flight" —
   that journal line explains any interrupted work. If changes exist that
   NO doc explains, treat it as an interrupted session: infer what was
   being attempted, report it, and propose either completing it (via the
   normal loop) or reverting. Do not silently keep unexplained changes.
3. Run the test suite defined in AGENTS.md.
4. Report: current phase, active feature, test results, Built vs Not-yet-built
   deltas, any drift between STATUS.md and reality, and the recommended next
   action. Do not write code during /resume.
