Change request: $ARGUMENTS

Scope check first. /iterate is ONLY for micro-changes that do not alter any
acceptance criterion, add a requirement, or touch a design-contract doc
(data model, copy-deck keys' meaning, design tokens' structure). Examples in
scope: flag/option tweaks, output formatting, refactors, perf, bug fixes,
copy value edits already reflected in 42-copy-deck. If the request fails the
check, say so and escalate: propose the REQ/PRD amendment and hand off to
/new-feature. When in doubt, escalate.

In-scope loop:
1. Write/adjust a failing test capturing the new behavior (for pure
   refactors: run the suite before and after instead).
2. Make the minimum change; show the suite green.
3. Update only: CHANGELOG.md (one line) and STATUS.md if state shifted.
   If a copy string changed, update 42-copy-deck.md in the same session.
4. If the change touched web UI, run the affected journey's E2E test.
5. Summarize in 2-3 lines. No PRD, no index changes.
