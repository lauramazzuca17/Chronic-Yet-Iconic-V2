---
name: webapp-testing
description: Browser-level acceptance testing for web UIs (Playwright or equivalent). Use when a feature has user-facing web UI, when a TEST-MAP row would otherwise become a "manual check" exemption, or when the user asks to verify the app works end-to-end in a browser.
---

# Webapp Testing — browser-level acceptance checks

## Where this fits in the TDD loop
Unit tests stay the inner loop (fast, per-criterion, /tdd-cycle). This skill
covers the layer above: does the real flow work in a real browser? Use it to
CONVERT would-be exemptions into automated checks — a criterion like "user
sees streak update after check-off" is browser-testable and should not sit
in TEST-MAP's manual-exemption table.

## Rules
1. **One E2E test per primary journey**, not per criterion. Criteria get
   unit/integration tests; journeys (from 01-requirements.md) get E2E.
   Register E2E tests in TEST-MAP.md rows like any other test.
2. **Setup**: prefer Playwright unless the project already standardizes on
   something else; record the choice + run command in AGENTS.md "Commands &
   environment" and 02-platform.md. E2E must run headless locally with one
   command against the local dev stack — no external services, synthetic
   data only (TDD rule 9).
3. **Selectors**: test-ids or accessible roles/names — never brittle CSS
   paths. Adding a test-id is an allowed minimal code change.
4. **Assert outcomes users can see** (text from 42-copy-deck keys, visible
   state), not implementation internals.
5. **When to run**: the changed journey's E2E during /tdd-cycle and
   /iterate on UI work; the full E2E suite in /ship's green check.
6. **Flake policy**: a flaky test is a bug — fix the wait/selector or the
   app; never sprinkle sleeps, never mark-and-ignore.
7. Remaining truly-manual checks (visual polish, cross-device feel) stay in
   TEST-MAP exemptions with a reason — the goal is that table shrinking.
