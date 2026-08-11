---
project: "Chronic Yet Iconic V2"
type: technical-handoff
status: working-draft
updated: 2026-08-10
---

# Platform and Integration

[[00-overview|← Overview]]

## Integration principle
The product is a personal web app deployed on Vercel. All durable health data lives in **Turso** (cloud libSQL), scoped per authenticated account. The owner's data must never be readable by the test account (or any other account). Network/API access to health records always requires a valid session; there is no clinician or public share surface.

## Chosen stack
- **Language / app:** TypeScript, **Next.js (App Router)**, React
- **UI:** **MUI (Material UI)** with an MD3-oriented theme (design handoff will lean on Material Design 3)
- **Database:** **Turso** (libSQL) via `@libsql/client` and/or Drizzle + libsql (ORM choice confirmed at scaffold)
- **Auth:** Simple **username + password** for a small account set (owner + test); passwords hashed in Turso; HTTP-only session (Auth.js Credentials or iron-session — exact library at scaffold)
- **Hosting:** **Vercel**, linked to **GitHub**

## Deployment shape
```text
User browser → Vercel (Next.js app + API/server actions)
                    ↓
                 Turso (libSQL) — per-account health + auth tables
GitHub repo → Vercel deploy hooks (preview + production)
```
- **Local:** `next dev` + Turso (dev database URL/token in `.env`).
- **Production:** Vercel project linked to GitHub; Turso production credentials via Vercel env vars.

## Key surfaces
| Surface | Required behavior |
| --- | --- |
| Web UI (dashboard, log, calendar, analytics, import) | Authenticated; account-scoped data only; MUI components |
| Auth (sign-in) | Username + password; session required for health data |
| Import processing | Server-side parse of zip/CSV/XML; write samples into Turso for current account |
| GitHub → Vercel | Push deploys; env for Turso URL/token and session secret |

## Environment & configuration
- Never commit `.env`; keep `.env.example` current.
- Secrets (Turso token, session secret) only in Vercel env + local `.env`.
- Separate Turso databases (or clearly separated envs) for local/preview/production when scaffolded.

## Decision log (platform)
| Date | Decision | Choice | Rationale |
| --- | --- | --- | --- |
| 2026-08-10 | App framework | Next.js App Router + React + TS | Native Vercel fit; strong Turso examples |
| 2026-08-10 | UI library | MUI with MD3-oriented theme | Faster multi-screen build; design file uses MD3 |
| 2026-08-10 | Database / host | Turso + Vercel + GitHub | Owner constraint |
| 2026-08-10 | Auth | Username + password sessions; **two seeded accounts only**; no public registration | Simpler than email signup; owner + isolated test |
| 2026-08-10 | Test runner | Vitest (`npm test`) | Matches FEAT-001 skeleton; fast unit loop |
| 2026-08-10 | Session gate (AC-1) | `src/auth/session.getProtectedDashboard` returns 401 without session | Minimum green before cookie library choice |
| 2026-08-10 | Seed passwords (AC-2) | `SEED_PASSWORD_LAURA` / `SEED_PASSWORD_DEMO` env; scrypt at runtime | No plaintext in repo; Turso hashes later |
| 2026-08-11 | Session cookie (FEAT-002) | **iron-session** HTTP-only cookie | Owner approved with FEAT-002 PRD |
| 2026-08-11 | E2E runner | Playwright (`npm run test:e2e`) | FEAT-002 AC-8 journey |
