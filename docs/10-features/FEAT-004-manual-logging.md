---
id: FEAT-004
type: prd
status: done
implements: [REQ-02, REQ-03, REQ-04, REQ-05, REQ-06, REQ-07, REQ-08, REQ-09, REQ-10, NFR-01]
depends_on: [FEAT-001, FEAT-002, FEAT-003]
tests: [tests/feat-004-manual-logging.test.ts, e2e/feat-004-water-journey.spec.ts, e2e/feat-004-remaining-forms.spec.ts]
created: 2026-08-11
updated: 2026-08-13
---
# FEAT-004 — Manual logging (single Log screen)

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|REQ-02]]–[[01-requirements|REQ-10]], [[01-requirements|NFR-01]] · Depends: [[FEAT-001-auth-shell]], [[FEAT-002-signin-ui-cookies]], [[FEAT-003-shell-polish]]

## Problem / user story
As a signed-in user, I want to create and delete all MVP manual log types from one Log screen so I can capture BP, symptoms, meds, water, electrolytes, mood, and events without leaving the app — and without editing past entries in v1.

## Acceptance criteria
- [x] AC-1: `/log` is a **single** create surface that can start a symptom, BP, medication, water, electrolyte, mood, or event entry (REQ-02).
- [x] AC-2: User can create a **BP** log with systolic, diastolic, HR at measurement, and date/time; entry is persisted for the account and appears in today’s entries for that date (REQ-03). **No posture field.**
- [x] AC-3: User can create a **symptom** log: name from seeded catalog only, severity (`Normal amount` / `Worse than usual` / `Better than usual`), date/time, optional notes (REQ-04).
- [x] AC-4: User can create a **medication** log: name from seeded catalog only, dose (free text), date/time (REQ-05).
- [x] AC-5: User can create **water** logs in oz; daily total for that America/New_York calendar date equals the sum of amounts (e.g. 8 + 8 → 16) (REQ-06).
- [x] AC-6: User can create **electrolytes taken (yes)** **once per calendar day** (America/New_York) with Date & Time (Figma: Taken chip + datetime — no create-no); a second create that day is blocked with `log.electrolytes.blocked` until the existing entry is deleted (REQ-07).
- [x] AC-7: User can create a **mood** log from the fixed set (awful / not great / okay / good / great) with date/time (REQ-08).
- [x] AC-8: User can create an **event** note (textarea) with date/time (REQ-09).
- [x] AC-9: User can **delete** any manual log entry of any type via Today entry card: tap **Delete** → **Confirm Delete** (brand7); second tap removes the entry; **no edit** UI in v1 (REQ-10).
- [x] AC-10: Manual logs are **account-scoped** — Demo cannot read or delete Laura’s logs (NFR-01).
- [x] AC-11: Symptom and medication catalogs match the binding seeded lists in [[03-data-model]]; free-text / unknown names are rejected.
- [x] AC-12: Playwright: signed-in Laura opens Log, creates a water entry, sees it (and daily total), deletes it, confirms it is gone.

## Out of scope
- Home dashboard summaries (REQ-01).
- Calendar day-picker UI (REQ-11) — persistence is verified via Log “today’s entries” + account-scoped queries that calendar will reuse later.
- Import / analytics (REQ-12+).
- Edit-in-place for any log type.
- Adding custom symptom/med names in-app (seeded catalogs only).
- BP posture or imported BP.
- Water **Reset total** control (present in Figma; hidden in v1).

## Assumptions (say if wrong before approve)
1. **Verify without Calendar UI:** “appears on calendar day detail” from master REQs is satisfied in this FEAT by persisted rows + a **today’s entries** list on `/log` (same queries calendar will call). Full calendar FEAT comes later.
2. **Default date/time:** `recorded_at` defaults to **now** in America/New_York; user may change date/time on create.
3. **Electrolyte day key:** `calendar_date` = America/New_York calendar date of `recorded_at` (UNIQUE per account+date).
4. **Storage:** Turso schema per [[03-data-model]] for catalogs + seven log tables (or equivalent migrations) lands in this FEAT; tests use synthetic data only.
5. **Success / delete:** quiet `log.save_success` after create; delete is **inline** on the entry card (Delete → Confirm Delete), not a modal.
6. **One FEAT** covers all seven create types + delete (large); `/tdd-cycle` will go AC-by-AC.

## UX copy
| Key | New or reused |
| --- | --- |
| shell.title.log / shell.subtitle.log | reused |
| log.save_success | reused |
| log.delete_confirm | reused |
| log.electrolytes.blocked | reused |
| log.type.* (7 types) | **new** |
| log.field.* (shared fields) | **new** |
| log.severity.* | **new** |
| log.mood.* | **new** |
| log.entry.delete / log.entry.confirm_delete | **new** (inline two-step delete) |
| log.delete_confirm / log.action.delete | reused keys; modal path not used in v1 Log UI |

| log.field.note_placeholder | **new** |
| log.today_heading / log.water_total_label / log.water_total_value / log.entries_count | **new** |
| log.water_reset | **new** — Figma only; **hidden in v1** |
| log.field.amount_oz_placeholder | **new** |
| log.field.notes_placeholder | **new** |
| common.error_generic | reused |

## Technical notes
- Extend `/log` under `(shell)`; reuse session + account isolation patterns from FEAT-001/002.
- Seed symptom + medication catalogs for Laura and Demo from [[03-data-model]] binding lists (Demo may have catalogs; **zero** health log rows at seed — already FEAT-001 AC-10).
- Domain helpers / repository: create + delete + list-by-account+date; water daily sum; electrolyte uniqueness enforcement.
- Mood storage keys: `awful` \| `not_great` \| `okay` \| `good` \| `great`; severity: `usual` \| `worse_than_usual` \| `better_than_usual` — UI labels from copy deck.
- Tests: Vitest for domain rules (electrolyte block, water sum, catalogs, isolation); Playwright AC-12 for primary journey.
- Phone-first; no desktop log layout.

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-11 | Draft PRD for manual logging (REQ-02–10) | /new-feature |
| 2026-08-12 | Copy locked to Log Figma Frame 2 (Normal amount, Log Symptom, Notes optional, Date & Time) | Owner |
| 2026-08-12 | BP form: Sys/Dia/HR one row + Date & Time; `HR (bpm)`; Log Blood Pressure CTA | Owner Figma |
| 2026-08-13 | Water: hide Reset total in v1; placeholder e.g. 32 | Owner |
| 2026-08-13 | Event Note = textarea (Figma single-line is stand-in only) | Owner |
| 2026-08-13 | Electrolytes: yes-only create; blocked copy = Figma short string; REQ-07 updated | Owner |
| 2026-08-13 | Today entry card: **Delete** text control → confirm dialog | Owner Figma |
| 2026-08-13 | Delete revised: inline Delete → Confirm Delete (brand7 `#d95c1c`); no modal | Owner Figma |
| 2026-08-13 | PRD **approved** (Log Figma walkthrough complete) | Owner |
| 2026-08-13 | AC-1 done — `getManualLogTypes` seven keys | /tdd-cycle |
| 2026-08-13 | AC-2 done — BP create + today list; no posture (`src/log/store`) | /tdd-cycle |
| 2026-08-13 | AC-3 done — symptom create from catalog + severity + optional notes | /tdd-cycle |
| 2026-08-13 | AC-4 done — medication create from catalog + dose + date/time | /tdd-cycle |
| 2026-08-13 | AC-5 done — water create + daily oz sum by calendar date | /tdd-cycle |
| 2026-08-13 | AC-6 done — electrolytes once/day; blocked + delete unblock | /tdd-cycle |
| 2026-08-13 | AC-7 done — mood create from fixed enum + date/time | /tdd-cycle |
| 2026-08-13 | AC-8 done — event note create + date/time | /tdd-cycle |
| 2026-08-13 | AC-9 done — delete any of 7 types; no update API (domain; UI two-step later) | /tdd-cycle |
| 2026-08-13 | AC-10 done — Demo cannot list/sum/delete Laura logs | /tdd-cycle |
| 2026-08-13 | AC-11 done — catalogs match data model; unknown names rejected | /tdd-cycle |
| 2026-08-13 | AC-12 done — Log water UI + Playwright journey; FEAT-004 **done** | /tdd-cycle |
| 2026-08-13 | Reopened **in-progress** — wire remaining Log create forms (symptom/BP/med/electrolyte/mood/event UI) | Owner |
| 2026-08-13 | Remaining Log create forms UI + E2E; FEAT-004 **done** again | /tdd-cycle |
