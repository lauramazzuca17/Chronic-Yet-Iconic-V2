---
id: FEAT-009
type: prd
status: done
implements: [NFR-07, REQ-15, REQ-12, REQ-18, REQ-19, NFR-01]
depends_on: [FEAT-001, FEAT-002, FEAT-004, FEAT-007]
tests: [tests/feat-009-turso-persistence.test.ts, e2e/feat-009-persistence-journey.spec.ts]
created: 2026-08-15
updated: 2026-08-15
---
# FEAT-009 — Turso persistence (+ Import History per-file)

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|NFR-07]], [[01-requirements|REQ-15]], [[01-requirements|REQ-12]], [[01-requirements|REQ-18]], [[01-requirements|REQ-19]], [[01-requirements|NFR-01]] · Depends: [[FEAT-001-auth-shell]], [[FEAT-002-signin-ui-cookies]], [[FEAT-004-manual-logging]], [[FEAT-007-import]]

## Problem / user story
As Laura, I want my logs, imports, and account to survive app restarts and deploys so I don’t lose health data — and Import History should show **one card per file** with **per-file delete**, matching Figma, while uploads still require both CSVs together.

## Acceptance criteria
- [x] AC-1: Drizzle schema + migrations implement [[03-data-model]] tables (Account, catalogs, seven manual log tables, ImportBatch with `pair_id` / `source_format` / `status`, ImportedSample + dedupe unique) (NFR-07).
- [x] AC-2: Boot/migrate **upserts** Laura + Demo into `Account` with `password_hash` from `SEED_PASSWORD_*`; seeds symptom + medication catalogs for both; Demo has **zero** health logs/imports (REQ-18, REQ-19).
- [x] AC-3: Sign-in verifies password against **DB** `password_hash` (not env-only runtime accounts) (REQ-18).
- [x] AC-4: Manual log create/list/delete and import ingest/list/delete go through the DB; **no** `globalThis` memory stores for durable health data (NFR-07).
- [x] AC-5: Survives restart — save data, open a **new** DB client (or reconnect), same account still sees the rows (NFR-07).
- [x] AC-6: Successful pair import inserts **two** `ImportBatch` rows sharing `pair_id` (`detailed_csv` + `summary_csv`); samples attach to the correct file batch; missing either file → no partial commit (REQ-12).
- [x] AC-7: Deleting one file batch removes **only** that batch’s samples; the sibling file from the same `pair_id` remains (REQ-15).
- [x] AC-8: Import History UI: **one card per file** (filename, record count, status, Delete → confirm) per Figma `62946:4447`; Database Summary = total sample count (REQ-15, NFR-06 chrome already present).
- [x] AC-9: Account isolation — Demo cannot read/delete Laura’s DB rows (NFR-01).
- [x] AC-10: Connection policy — unit tests use in-process libSQL; local `next dev`/Playwright use **file** libSQL when `TURSO_*` unset; Vercel/production **require** Turso URL+token (fail clearly if missing) (NFR-07).
- [x] AC-11: Playwright: Laura logs water (or imports pair) → data visible after reload; pair import shows two history cards; delete one file → only that file’s card/samples gone.

## Out of scope
- Changing chart/analytics math (already FEAT-008).
- Password-change UI / forgot-password.
- Multi-region Turso or read replicas.
- Migrating fictional production data (none yet — empty DB / seed only).
- Native zip/XML import.

## Assumptions (locked in grill)
1. **Full data model in one FEAT** — Account, catalogs, all manual logs, imports.
2. **Drizzle + `@libsql/client`.**
3. **Unit tests:** in-process libSQL + same schema.
4. **Auth:** env seeds → `Account.password_hash`; verify against DB.
5. **REQ-15:** per-file history + delete; REQ-12 pair upload unchanged.
6. **FEAT-009 includes Import History UI** rewrite to per-file cards.
7. **Local file fallback** when `TURSO_*` unset; Vercel always Turso.
8. **IDs:** opaque string PKs via `crypto.randomUUID()` (consistent across tables).
9. FEAT-007’s old “one batch = whole pair / one delete” behavior is **superseded** by this FEAT for REQ-15.

## Figma
| State | Frame |
| --- | --- |
| Import History cards (per file) | [62946-4447](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62946-4447) |
| Import page (context) | [62939-4277](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62939-4277) |

## UX copy
Reuse existing `import.*` keys from [[42-copy-deck]]. Add only if Figma needs a new string (none identified beyond current Delete / Delete this import?).

| Key | New or reused |
| --- | --- |
| import.* history / delete / summary | reused |

## Technical notes
- Replace `src/log/store.ts` and `src/import/store.ts` `globalThis` backends with Drizzle repositories; keep function names where possible so FEAT-004–008 call sites stay thin.
- Electrolyte unique `(account_id, calendar_date)` enforced in DB.
- Import dedupe unique on samples as in data model.
- `.data/*.db` (or similar) gitignored; document in `.env.example` + AGENTS.md.
- Update FEAT-007 E2E/unit expectations for two history cards + per-file delete as part of this FEAT.
- No user-facing strings invented outside copy deck.

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-15 | Draft PRD after grill (scope, Drizzle, test DB, auth hashes, REQ-15, UI, local file) | /new-feature |
| 2026-08-15 | Status → `approved` / `in-progress`; start `/tdd-cycle` AC-1 | Owner approve |
| 2026-08-15 | AC-1 green — `src/db/schema` Drizzle tables per data model | /tdd-cycle |
| 2026-08-15 | AC-2 green — `seedDatabase` + `createTestDb` / migrate | /tdd-cycle |
| 2026-08-15 | AC-3 green — `signIn` verifies `Account.password_hash` (DB wins over env) | /tdd-cycle |
| 2026-08-15 | AC-4 green — log + import stores on Drizzle; no durable `globalThis` | /tdd-cycle |
| 2026-08-15 | AC-5 green — file DB reconnect via `createFileDb`; water survives new client | /tdd-cycle |
| 2026-08-15 | AC-6 green — pair import → two batches + shared `pair_id`; samples per file | /tdd-cycle |
| 2026-08-15 | AC-7 green — delete by file batch id leaves sibling; pair_id delete still removes both | /tdd-cycle |
| 2026-08-15 | AC-8 green — `listImportBatches` + Import History one card per file | /tdd-cycle |
| 2026-08-15 | AC-9 green — Demo cannot read/delete Laura water or import rows on shared DB | /tdd-cycle |
| 2026-08-15 | AC-10 green — `resolveDbMode`: memory / file / Turso; Vercel requires Turso | /tdd-cycle |
| 2026-08-15 | AC-11 green — Playwright water reload + two cards + delete one file; status → `done` | /tdd-cycle |
