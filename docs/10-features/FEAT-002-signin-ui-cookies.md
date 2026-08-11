---
id: FEAT-002
type: prd
status: done
implements: [REQ-18, REQ-19, NFR-05]
depends_on: [FEAT-001]
tests: [tests/feat-002-signin-ui-cookies.test.ts, e2e/feat-002-signin-journey.spec.ts]
created: 2026-08-11
updated: 2026-08-11
---
# FEAT-002 — Sign-in UI + HTTP session cookies

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|REQ-18]], [[01-requirements|REQ-19]], NFR-05 · Depends: [[FEAT-001-auth-shell]]

## Problem / user story
As Laura (or Demo), I want a phone-first Sign In screen that matches the reviewed Figma and a durable HTTP-only session cookie, so I can sign in from the browser, stay signed in across requests, and sign out securely — without plaintext passwords in the client beyond the form submit.

## Acceptance criteria
- [x] AC-1: `/login` renders the Sign In UI (wordmark, username, password, Sign In CTA) per [[FEAT-001-brief]] / Figma login frames; lilypad background; koi Lottie on this screen only (`public/lottie/koi-fish-color-v2.json`); respects `prefers-reduced-motion`.
- [x] AC-2: Valid Laura (and Demo) credentials via the form create an **HTTP-only** session cookie and redirect to the Home/Dashboard route (`/`).
- [x] AC-3: Invalid credentials show `auth.login.error_invalid` under the button, create **no** session cookie, and remain on `/login`.
- [x] AC-4: While the Sign In request is in flight, the CTA uses submitting treatment (`#f08429` @ 65% opacity + disabled).
- [x] AC-5: Unauthenticated browser requests to protected shell routes (`/`, `/log`, `/calendar`, `/analytics`, `/import`) redirect to `/login`.
- [x] AC-6: Authenticated requests to `/login` redirect to `/`.
- [x] AC-7: Sign out (shell header control) clears the session cookie; subsequent protected navigation requires `/login` again.
- [x] AC-8: Playwright journey: open `/login` → sign in as Laura with test env password → land on Dashboard → sign out → blocked from shell until sign-in again.

## Out of scope
- Pixel-perfect **full** MUI shell chrome (bottom nav active pill, scroll header glass) beyond what’s needed for sign-out + reaching placeholders — defer to a shell-polish FEAT if needed.
- Turso-backed account table (still env-seeded passwords from FEAT-001 unless promoted later).
- Password reset, “remember me”, OAuth, public signup.
- Desktop / wide-layout login polish beyond usable phone-first layout.
- Changing copy-deck strings (reuse existing keys).

## Assumptions (say if wrong before approve)
1. **Session library:** **iron-session** (HTTP-only cookie) — simpler than Auth.js for two seeded credentials; override if you prefer Auth.js.
2. **Scope:** Sign-in UI + cookies + middleware redirects + wire Sign out; not a full shell visual rebuild.
3. **Design source of truth:** existing FEAT-001 brief / Figma login frames — no new `/design-brief` required unless you want a refresh pass.
4. Clearing the FEAT-001 Playwright exemption is part of this FEAT (AC-8).

## UX copy
| Key | New or reused |
| --- | --- |
| app.name | reused (wordmark) |
| auth.login.title | reused |
| auth.login.submit | reused |
| auth.login.error_invalid | reused |
| auth.field.username | reused |
| auth.field.password | reused |
| auth.logout | reused |
| shell.eyebrow | reused |
| shell.title.dashboard | reused |
| shell.placeholder.body | reused |

## Technical notes
- Build on FEAT-001: `signIn` / `signOut` / `isActiveSession` / seed passwords (`SEED_PASSWORD_*`); replace in-process-only session durability with cookie-backed session (`SESSION_SECRET`).
- MUI (MD3-oriented) for form controls to match platform; tokens/colors from design brief (`#f08429`, `#367057` Yet, error `#d95c1c`).
- Middleware (or equivalent App Router gate) enforces AC-5/AC-6.
- Lottie: existing asset; no koi on shell pages.
- Tests: Vitest for cookie/session helpers + form logic where practical; Playwright for AC-8 journey (webapp-testing). Register E2E in TEST-MAP; remove FEAT-001 E2E exemption when AC-8 passes.
- Never commit real passwords; tests use env / Playwright fixtures with synthetic secrets only.

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-11 | Draft PRD for sign-in UI + HTTP cookies | /new-feature |
| 2026-08-11 | PRD approved (iron-session assumption accepted) | Owner |
| 2026-08-11 | AC-1 green: `getLoginPageCopy` wires copy-deck Sign In strings | /tdd-cycle |
| 2026-08-11 | AC-2 green: `loginWithCredentials` seals iron-session HTTP-only cookie + redirect `/` | /tdd-cycle |
| 2026-08-11 | AC-3 green: invalid login → errorKey + remainOn `/login`, no cookie | /tdd-cycle |
| 2026-08-11 | AC-4 green: submitting CTA state `#f08429` @ 0.65 + disabled | /tdd-cycle |
| 2026-08-11 | AC-5 green: `resolveShellAuthGate` redirects unauthenticated shell paths to `/login` | /tdd-cycle |
| 2026-08-11 | AC-6 green: authenticated `/login` → redirect `/` | /tdd-cycle |
| 2026-08-11 | AC-7 green: `logoutSession` clears cookie (maxAge 0) + invalidates session | /tdd-cycle |
| 2026-08-11 | AC-8 green: Playwright journey; login UI + middleware; FEAT-002 done | /tdd-cycle |
