---
type: changelog
---
# Changelog

<!-- Newest first. Claude appends one entry per completed feature or notable change. -->

## 2026-08-11
- FEAT-003 AC-5 green: `getShellNavRoutes` — Home→`/` title Dashboard + Log/Calendar/Analytics/Import hrefs.
- FEAT-003 AC-4 green: scrolled header sticky + `#0B4041` @ 80% when scrolled.
- FEAT-003 AC-3 green: shell header chrome (eyebrow, title, subtitle, Sign out).
- FEAT-003 AC-2 green: active nav pill tokens (`#082E33` @ 80%, 16px radius).
- FEAT-003 AC-1 green: bottom nav chrome tokens (five labels + bar fill).
- Approved FEAT-003 (shell polish) + NFR-06; next `/tdd-cycle`.
- Drafted FEAT-003 (shell polish) + NFR-06; awaiting approval.
- **FEAT-002 done** — Sign In UI, iron-session cookies, middleware, sign-out; Playwright journey green (`npm run test:e2e`).
- FEAT-002 AC-8 green: Laura sign-in → Dashboard → sign out → shell requires `/login`.
- FEAT-002 AC-7 green: `logoutSession` clears HTTP-only cookie and invalidates session.
- FEAT-002 AC-6 green: authenticated `/login` redirects to `/`.
- FEAT-002 AC-5 green: unauthenticated shell routes gated to `/login` (`resolveShellAuthGate`).
- FEAT-002 AC-4 green: submitting Sign In CTA `#f08429` @ 65% opacity + disabled.
- FEAT-002 AC-3 green: invalid credentials → error + remain on `/login`, no session cookie.
- FEAT-002 AC-2 green: iron-session HTTP-only cookie + redirect `/` via `loginWithCredentials`.
- FEAT-002 AC-1 green: login copy helper wired to copy deck (`getLoginPageCopy`).
- Approved FEAT-002 (sign-in UI + iron-session cookies); next `/tdd-cycle`.
- Drafted FEAT-002 (sign-in UI + HTTP session cookies) PRD + test skeleton; awaiting approval.
- **FEAT-001 done** — all AC-1–10 green (`npm test` 10/10). Auth helpers, shell nav/routes, isolation stub, Demo empty seed.
- FEAT-001 AC-10 green: Demo v1 health seed has zero logs/imports.
- FEAT-001 AC-9 green: exactly two seeded accounts (Laura, Demo); no public signup/register route.
- FEAT-001 AC-8 green: sign-out invalidates session; protected access requires sign-in again.
- FEAT-001 AC-7 green: all shell nav routes reachable when signed in (`openShellRoute` + placeholder pages).
- FEAT-001 AC-6 green: shell nav config (Home label / Dashboard title + Log/Calendar/Analytics/Import).
- FEAT-001 AC-5 green: account-scoped health stub — Demo cannot read Laura’s rows.
- FEAT-001 AC-4 green: invalid sign-in returns `auth.login.error_invalid` and no session.
- FEAT-001 AC-3 green: Demo sign-in locked with dedicated test (env seed path already present from AC-2).

## 2026-08-10
- FEAT-001 AC-2 green: Laura sign-in from env-seeded password → session + protected dashboard.
- Scaffolded Next.js (App Router) + Vitest; FEAT-001 AC-1 green (unauthenticated protected access → 401).
- Approved FEAT-001 (seeded auth + app shell); next `/tdd-cycle`.
- FEAT-001 design review complete (login + shell + active nav).
- Drafted FEAT-001 auth + shell PRD + test skeleton; phone-first MVP.
- Approved master requirements (`01-requirements.md`); build gate open. Binding invariants copied into `AGENTS.md`.
- Completed Define (full tier) + grill-me; third-party summary+detailed CSV import contract; analytics views locked; fixtures added under `fixtures/import/`.
- Initialized project from cursor-tdd-starter / claude-tdd-starter template.
