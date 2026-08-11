Skip any doc whose frontmatter status is `n/a` (lite/standard tiers).

1. Requirements coverage: every REQ-ID in 01-requirements.md maps to a FEAT
   PRD, a _BACKLOG entry marked deferred, or an explicit deferral in
   _PRD-INDEX. List uncovered requirements.
2. For every feature in _PRD-INDEX.md: verify status matches reality (tests
   exist, pass, code present). List every mismatch.
3. Check TEST-MAP.md against actual test files; flag orphan tests (no
   criterion) and orphan criteria (no test); verify exemptions still valid.
4. Contract docs: verify code matches every `design-contract` doc —
   03-data-model vs schema, 42-copy-deck vs strings in code (every
   user-facing string traceable to a key; no drifted values), and
   50-design-brief tokens vs the project tokens file.
5. Detect behavior in code not described by any PRD/requirement; propose doc
   updates for the user's approval before writing them.
6. After approval, repair all docs, update STATUS.md and CHANGELOG.md, and
   summarize. (When called by /ship, stop after reporting — audit only.)
