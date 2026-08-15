---
type: changelog
---
# Changelog

<!-- Newest first. Claude appends one entry per completed feature or notable change. -->

## 2026-08-14
- **FEAT-008 Chart 3 threshold** — locked **≥ 100** bpm (math + copy; Figma had `>`).
- **FEAT-008 Cardiovascular Figma** — Chart 2 `62953:4603` (BP & HR + Today/Last 7/Last 30); Chart 3 `62953:4604` (Tachycardia Burden + Data Disclaimer); copy deck keys added.
- **FEAT-008 Medication locks** — single-day date picker + prev/next (Figma `62816:27152`); multi-dose → most recent; untaken meds `#8E8E93` disabled; REQ-16 binding text updated.
- **FEAT-008 updated** — all Analytics tabs in scope (REQ-16/17/20); Recharts; Medication Figma `62816:27151`; subtitle + chip labels locked; build Medication first.
- **FEAT-008 draft** — Analytics shell + Medication impact (REQ-16); Heart Trends/Recovery/Lifestyle deferred unless owner expands; skeleton tests; awaiting PRD approval.
- **FEAT-007 done** — Import (REQ-12/15): CSV pair ingest, history UI, Playwright upload + batch-delete (`e2e/feat-007-import-journey.spec.ts`); import store on `globalThis` for Next action/RSC sharing.
- **FEAT-007 AC-7** — Import UI: Upload Files + Import History (Database Summary, batch cards); copy helpers; shell subtitle already locked.
- **FEAT-007 AC-6** — owner `deleteImportBatch` removes batch and all its samples.
- **FEAT-007 AC-5** — Demo cannot list or delete Laura import batches (`deleteImportBatch` ownership check).
- **FEAT-007 AC-4** — re-import skips duplicates by (account, metric_key, recorded_at, value); reports inserted/skipped.
- **FEAT-007 AC-3** — summary CSV day aggregates stored as `summary_*` samples; BP systolic/diastolic columns skipped.

## 2026-08-13
- **FEAT-007 AC-2** — detailed CSV Metric → binding metric_key; NY wall-clock `recorded_at` from Timestamp.
- **FEAT-007 AC-1** — `importHealthCsvPair` requires both CSVs; no partial commit (`src/import/store.ts`).
- **Approved FEAT-007** (Import REQ-12 / REQ-15); next `/tdd-cycle` AC-1.
- **FEAT-007 decisions** — all non-BP summary columns; Processing = in-flight only; history shows detailed CSV filename.
- **FEAT-007 Figma lock** — Import frame `62939:4277`: Upload Files + Import History (Database Summary, batch states); subtitle + copy deck keys; scroll-behind header like Calendar.
- **FEAT-007 draft** — Import (REQ-12, REQ-15): CSV pair + batch-delete; skeleton tests; awaiting PRD approval.
- **FEAT-006 done** — Calendar (REQ-11): day list + UI + Playwright past-day review/delete (`e2e/feat-006-calendar-journey.spec.ts`).
- **FEAT-006 AC-7** — Calendar UI: month/year picker, day grid, day list + delete; default today; `?date=` selection.
- **FEAT-006 AC-6** — delete via `deleteManualLog` removes entry from that day’s list.
- **FEAT-006 AC-5** — Demo day list stays empty when only Laura has logs (account-scoped).
- **FEAT-006 AC-4** — Calendar day list reads `log/store` only; filters to manual log types.
- **FEAT-006 AC-3** — empty selected day returns `[]` (not another day’s logs).
- **FEAT-006 AC-2** — selecting another date never mixes day lists (regression).
- **FEAT-006 AC-1** — `listManualLogsForDate` via manual-log store (`src/calendar/day-entries.ts`).
- **Approved FEAT-006** (Calendar REQ-11 / NFR-01); next `/tdd-cycle` AC-1.
- **Decision:** no Claude Design for this project — Figma + `/design-brief` + `/tdd-cycle` only ([[50-design-brief]]).
- **FEAT-006 design brief** — Calendar Figma states (past list, today, empty, scroll); subtitle locked; delete on entry cards.
- **FEAT-006 draft** — Calendar (REQ-11); skeleton tests; calendar empty/day-heading copy drafted.
- **FEAT-005 done** — Home dashboard UI (Figma cards, no Health records) + Playwright AC-9; domain summary AC-1–8.
- **FEAT-005 AC-8** — Demo summary stays empty when only Laura has today logs (account-scoped).
- **FEAT-005 AC-7** — empty day all zeros/null/false; other calendar day’s logs excluded (regression test).
- **FEAT-005 AC-6** — `electrolytesTaken` (today’s electrolyte row present vs absent).
- **FEAT-005 AC-5** — `symptomsCount` for today’s symptom logs.
- **FEAT-005 AC-4** — `waterTotalOz` via existing water sum helper.
- **FEAT-005 AC-3** — `medsCount` for today’s medication logs.
- **FEAT-005 AC-2** — `latestBp` sys/dia (most recent today) or `null`.
- **FEAT-005 AC-1** — `getTodayDashboardSummary` returns today’s BP count (`src/dashboard/summary.ts`).
- **Approved FEAT-005** (Home dashboard REQ-01 / NFR-01); next `/tdd-cycle` AC-1.
- **FEAT-005** — Health records card **hidden in v1** (no REQ-01 amend); open questions cleared.
- **FEAT-005 Figma walkthrough** — Home layout + copy locked; electrolytes = Taken badge (X vs check) inside Total Water; subtitle → Take a look around!
- **FEAT-005 design brief** — Home dashboard layout brief; owner locked latest BP sys/dia only; electrolytes from Figma card.
- **FEAT-005 draft** — Home dashboard (REQ-01); skeleton tests; dashboard copy keys drafted in copy deck.
- **FEAT-004 done** — remaining Log create forms (symptom/BP/med/electrolyte/mood/event) + Playwright; E2E reset route gated by `ALLOW_TEST_RESET`.
- **FEAT-004 reopened** (`in-progress`) — remaining Log create forms UI (symptom/BP/med/electrolyte/mood/event); water + domain ACs stay green.
- **FEAT-004 done** — AC-12 Playwright water journey; Log UI chips + water form + today list + inline Delete→Confirm Delete; store on `globalThis` for Next request stability.
- **FEAT-004 AC-11** — catalogs match [[03-data-model]]; unknown symptom/med names rejected.
- **FEAT-004 AC-10** — Demo cannot list/sum/delete Laura’s manual logs (account-scoped store).
- **FEAT-004 AC-9** — delete any of 7 types via `deleteManualLog`; no update/edit API (UI two-step delete still for Log UI / AC-12).
- **FEAT-004 AC-8** — event note create + date/time (`createEventLog`).
- **FEAT-004 AC-7** — mood create from fixed enum (`awful`/`not_great`/`okay`/`good`/`great`).
- **FEAT-004 AC-6** — electrolytes once/day; second create throws `log.electrolytes.blocked`; delete unblocks (`deleteManualLog`).
- **FEAT-004 AC-5** — water create + `waterTotalOzForDate` (8+8→16; other days excluded).
- **FEAT-004 AC-4** — medication create from catalog + dose + date/time.
- **FEAT-004 AC-3** — symptom create from catalog + severity + optional notes (`src/log/catalogs.ts` + store).
- **FEAT-004 AC-2** — BP create (sys/dia/HR/`recorded_at`) + today list; no posture (`src/log/store` in-memory).
- **FEAT-004 AC-1** — `getManualLogTypes` seven keys (`src/log/types.ts`).
- **Approved FEAT-004** (manual logging REQ-02–10); Log Figma walkthrough complete; next `/tdd-cycle`.
- Today entry delete: inline **Delete** → **Confirm Delete** (brand7 `#d95c1c`); no modal.
- Today entry card: **Delete** text control (Figma); confirm still uses `log.delete_confirm`.
- Today list Figma: empty (`0 logged entries`) + populated entry cards (type/time + summary).
- Electrolytes: create **yes only** (absence = no); `log.electrolytes.blocked` = Figma short string; REQ-07 / data model updated.
- Water form: hide **Reset total** in v1; placeholder **e.g. 32** (not Figma’s e.d.).

## 2026-08-12
- Log BP form (Figma): Systolic/Diastolic/HR one row + Date & Time; `log.field.heart_rate` = HR (bpm); `log.action.log_blood_pressure`.
- Copy locked to Log Figma Frame 2: `log.severity.usual` → Normal amount; `log.action.log_symptom`; Notes (optional) + placeholder; Date & Time. REQ-04 / data-model UI labels synced.
- Copy: `shell.subtitle.log` and `log.today_heading` locked from Log Figma Frame 1; chrome helper + FEAT-003 test updated.
- FEAT-004 Frame 1 walkthrough: chips sticky clip; ship 7 log types only.

## 2026-08-11
- Drafted FEAT-004 (manual logging REQ-02–10); awaiting PRD approval. Copy deck: log type/field/severity/mood keys.
- **FEAT-003 done** — phone-first shell chrome (tokens AC-1–6 + ShellChrome UI); Playwright nav → Log → Sign out green (`npm run test:e2e`).
- FEAT-003 AC-7 green: bottom nav + header titles wired; e2e journey passes.
- FEAT-003 AC-6 green: phone-first shell (`getPhoneFirstShellLayout`, max content 430px, no desktop/wide layout).
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
