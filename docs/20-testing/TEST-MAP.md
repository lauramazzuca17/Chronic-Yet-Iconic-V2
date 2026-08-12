---
type: test-map
updated: 2026-08-11
---
# Test Map — acceptance criteria ↔ tests

<!-- Claude: update whenever tests are added, renamed, or removed. -->

| Feature | Criterion | Test file | Test name | Status |
| --- | --- | --- | --- | --- |
| FEAT-001 | AC-1 | tests/feat-001-auth-shell.test.ts | AC-1: unauthenticated access to protected routes is blocked | ✅ passing |
| FEAT-001 | AC-2 | tests/feat-001-auth-shell.test.ts | AC-2: Laura can sign in with valid credentials | ✅ passing |
| FEAT-001 | AC-3 | tests/feat-001-auth-shell.test.ts | AC-3: Demo can sign in with valid credentials | ✅ passing |
| FEAT-001 | AC-4 | tests/feat-001-auth-shell.test.ts | AC-4: invalid credentials show auth.login.error_invalid and create no session | ✅ passing |
| FEAT-001 | AC-5 | tests/feat-001-auth-shell.test.ts | AC-5: Demo cannot read Laura health data | ✅ passing |
| FEAT-001 | AC-6 | tests/feat-001-auth-shell.test.ts | AC-6: app shell nav exposes Home, Log, Calendar, Analytics, Import; Home title is Dashboard | ✅ passing |
| FEAT-001 | AC-7 | tests/feat-001-auth-shell.test.ts | AC-7: each nav target is reachable when signed in | ✅ passing |
| FEAT-001 | AC-8 | tests/feat-001-auth-shell.test.ts | AC-8: sign out clears session | ✅ passing |
| FEAT-001 | AC-9 | tests/feat-001-auth-shell.test.ts | AC-9: exactly two seeded accounts; no public signup route | ✅ passing |
| FEAT-001 | AC-10 | tests/feat-001-auth-shell.test.ts | AC-10: Demo starts with no health logs/imports | ✅ passing |
| FEAT-002 | AC-1 | tests/feat-002-signin-ui-cookies.test.ts | AC-1: /login exposes Sign In form fields and submit copy keys | ✅ passing |
| FEAT-002 | AC-2 | tests/feat-002-signin-ui-cookies.test.ts | AC-2: valid credentials set HTTP-only session cookie and redirect to / | ✅ passing |
| FEAT-002 | AC-3 | tests/feat-002-signin-ui-cookies.test.ts | AC-3: invalid credentials show error and create no session cookie | ✅ passing |
| FEAT-002 | AC-4 | tests/feat-002-signin-ui-cookies.test.ts | AC-4: submitting CTA is disabled at 65% opacity while in flight | ✅ passing |
| FEAT-002 | AC-5 | tests/feat-002-signin-ui-cookies.test.ts | AC-5: unauthenticated access to shell routes redirects to /login | ✅ passing |
| FEAT-002 | AC-6 | tests/feat-002-signin-ui-cookies.test.ts | AC-6: authenticated /login redirects to / | ✅ passing |
| FEAT-002 | AC-7 | tests/feat-002-signin-ui-cookies.test.ts | AC-7: sign out clears session cookie | ✅ passing |
| FEAT-002 | AC-8 | e2e/feat-002-signin-journey.spec.ts | Laura signs in, lands on Dashboard, signs out, then shell requires login | ✅ passing |
| FEAT-003 | AC-1 | tests/feat-003-shell-polish.test.ts | AC-1: bottom nav exposes five labeled destinations with bar token | ✅ passing |
| FEAT-003 | AC-2 | tests/feat-003-shell-polish.test.ts | AC-2: active nav icon uses pill #082E33 @ 80% | ✅ passing |
| FEAT-003 | AC-3 | tests/feat-003-shell-polish.test.ts | AC-3: header exposes eyebrow, title, subtitle, Sign out | ✅ passing |
| FEAT-003 | AC-4 | tests/feat-003-shell-polish.test.ts | AC-4: scrolled header uses #0B4041 @ 80% | ✅ passing |
| FEAT-003 | AC-5 | tests/feat-003-shell-polish.test.ts | AC-5: nav hrefs map Home→/ title Dashboard and sibling routes | ✅ passing |
| FEAT-003 | AC-6 | tests/feat-003-shell-polish.test.ts | AC-6: shell is phone-first (no desktop shell layout) | ✅ passing |
| FEAT-003 | AC-7 | e2e/feat-003-shell-nav-journey.spec.ts | AC-7: Playwright nav + Sign out journey | ✅ passing |

## Exemptions (targeted-coverage rule 8)
| Area | Why exempt | Approved by |
| --- | --- | --- |
| _(none)_ | FEAT-001 login/shell E2E exemption cleared by FEAT-002 AC-8 | — |
