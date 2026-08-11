---
type: tdd-rules
---
# TDD Rules (imported into every Cursor Agent session)

1. **Red first.** No production code without a failing test that justifies it.
2. **Minimum green.** Write only enough code to pass the current test.
3. **Refactor on green.** Clean up only while the suite is passing.
4. **Traceability.** Every acceptance criterion ↔ at least one test, recorded
   in [[TEST-MAP]]. No orphan tests, no untested criteria.
5. **Regressions.** Bugs get a failing test before a fix — the suite is the
   regression safety net, so behavior changes get captured in tests so they
   can't silently regress.
6. **Suite gates status.** A feature is `done` only when all mapped tests pass
   and the full suite is green.
7. **Tests follow requirements, not vice versa.** Changing a test to pass
   requires a PRD/requirement change in the same session, logged in change
   history.
8. **Targeted coverage.** Core logic, APIs, data integrity, and anything that
   was ever the site of a bug are always tested. Thin UI glue may be exempted
   only with an exemption row (and reason) in TEST-MAP.md.
9. **Synthetic data only.** Tests never use real personal data and never
   depend on external services beyond the local dev stack.
