---
id: FEAT-001
type: prd
status: done
implements: [REQ-18, REQ-19, NFR-01, NFR-05]
depends_on: []
tests: [tests/feat-001-auth-shell.test.ts]
created: 2026-08-10
updated: 2026-08-11
---
# FEAT-001 — Seeded auth + app shell

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|REQ-18]], [[01-requirements|REQ-19]], NFR-01, NFR-05

## Problem / user story
As Laura (or a Demo tester), I want to sign in with my username and password and land in a private app shell with navigation, so only my account’s data is reachable and I can move between Dashboard, Log, Calendar, Analytics, and Import.

## Acceptance criteria
- [x] AC-1: Unauthenticated requests cannot read health data or open protected app routes (redirect or blocked to sign-in).
- [x] AC-2: Valid **Laura** credentials create a session and grant access to the app shell.
- [x] AC-3: Valid **Demo** credentials create a session and grant access to the app shell.
- [x] AC-4: Invalid username/password shows `auth.login.error_invalid` and does not create a session.
- [x] AC-5: While signed in as Demo, Laura’s health data is not visible (cross-account reads fail / empty isolation).
- [x] AC-6: App shell bottom nav shows **Home**, Log, Calendar, Analytics, Import; the Home route’s **page title** is **Dashboard**.
- [x] AC-7: Each nav target is reachable when signed in (placeholder page content is acceptable for this FEAT).
- [x] AC-8: Sign out clears the session; subsequent protected access requires sign-in again.
- [x] AC-9: Exactly two seeded accounts exist (**Laura**, **Demo**); no public self-registration route in v1.
- [x] AC-10: Demo starts with **no** health logs/imports (catalogs may exist).

## Out of scope
- Manual logging, calendar data, analytics charts, CSV import (later FEATs).
- Email/password reset, OAuth, public signup.
- **Desktop / wide-layout shell** — MVP is **phone-first** (appointment use); desktop polish deferred.
- Pixel-perfect polish beyond agreed Figma frames (`docs/50-design/briefs/FEAT-001-brief.md`).
- Editing account profile / changing username.

## UX copy
| Key | New or reused |
| --- | --- |
| app.name | reused |
| auth.login.title | reused |
| auth.login.submit | reused |
| auth.login.error_invalid | reused |
| auth.field.username | **new** |
| auth.field.password | **new** |
| auth.logout | reused |
| nav.home | **new** (nav label Home) |
| nav.log | reused |
| nav.calendar | reused |
| nav.analytics | reused |
| nav.import | reused |
| shell.eyebrow | **new** |
| shell.title.dashboard | **new** (page title Dashboard) |
| shell.title.log | **new** |
| shell.title.calendar | **new** |
| shell.title.analytics | **new** |
| shell.title.import | **new** |
| shell.subtitle.dashboard | **new** |
| shell.subtitle.log | **new** |
| shell.subtitle.calendar | **new** |
| shell.subtitle.analytics | **new** |
| shell.subtitle.import | **new** |
| shell.placeholder.body | reused |

## Technical notes
- Stack: Next.js App Router + React + TS + MUI + Turso + username/password sessions ([[02-platform]]).
- Seed accounts per [[03-data-model]] / [[07-credentials]]: usernames **Laura**, **Demo**; password hashes from env/secrets at seed — never plaintext in repo.
- Session: HTTP-only cookie (Auth.js Credentials or iron-session — choose at scaffold).
- Login visuals: lilypad background; koi **Lottie on sign-in only** (`public/lottie/koi-fish-color-v2.json`); submitting CTA `#f08429` @ 65% opacity + disabled.
- Shell: sticky header (transparent → `#0B4041` @ 80% when content scrolls under); bottom nav `#0B4041` @ 80%; active nav icon in pill `#082E33` @ 80%; Sign out = orange icon in eyebrow; page title + subtitle per route.
- Protected layout wraps Home/Dashboard / Log / Calendar / Analytics / Import; sign-in is public.
- This FEAT includes **initial app scaffold** (package.json, Next.js, Turso client, test runner) if not already present — minimum needed to run the suite green for these ACs.
- Account isolation test: with Laura owning at least one fixture health row (or insert in test setup), Demo session must not retrieve it. If no health tables yet, assert query helper / API enforces `account_id` filter with a minimal stub table created in this FEAT for the isolation test only, **or** assert Demo calendar/dashboard empty while Laura has seeded stub data — prefer a minimal `accounts`-scoped stub so AC-5 is real.
- No clinician/social/signup surfaces (NFR-01). Deploy treated as private URL + strong passwords (NFR-05) — document in README; no allowlist code required in this FEAT.

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-10 | Draft PRD for auth + shell | /new-feature |
| 2026-08-10 | Phone-first MVP; UI name without V2; Sign In CTA; login Figma frames | Design review |
| 2026-08-10 | Design review complete (login + shell + active nav) — ready for PRD approval | Owner |
| 2026-08-10 | PRD approved | Owner |
| 2026-08-10 | Scaffold Next.js+Vitest; AC-1 green (`getProtectedDashboard` → 401) | /tdd-cycle |
| 2026-08-10 | AC-2 green: Laura `signIn` via SEED_PASSWORD_* env → session + dashboard | /tdd-cycle |
| 2026-08-11 | AC-3 green: Demo `signIn` locked by dedicated test (seed path from AC-2) | /tdd-cycle |
| 2026-08-11 | AC-4 green: invalid sign-in returns `errorKey: auth.login.error_invalid`, no session | /tdd-cycle |
| 2026-08-11 | AC-5 green: health stub filters by `session.accountId` (Demo sees none of Laura’s rows) | /tdd-cycle |
| 2026-08-11 | AC-6 green: shell nav Home/Log/Calendar/Analytics/Import; Home title Dashboard | /tdd-cycle |
| 2026-08-11 | AC-7 green: `openShellRoute` for all nav hrefs when signed in; placeholder pages | /tdd-cycle |
| 2026-08-11 | AC-8 green: `signOut` invalidates session; protected access → 401 | /tdd-cycle |
| 2026-08-11 | AC-9 green: exactly Laura+Demo seeded; public auth routes exclude signup | /tdd-cycle |
| 2026-08-11 | AC-10 green: Demo v1 health seed is empty; FEAT-001 marked done | /tdd-cycle |
