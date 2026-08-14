---
id: FEAT-006
type: prd
status: done
implements: [REQ-11, NFR-01]
depends_on: [FEAT-001, FEAT-002, FEAT-003, FEAT-004]
tests: [tests/feat-006-calendar.test.ts, e2e/feat-006-calendar-journey.spec.ts]
created: 2026-08-13
updated: 2026-08-13
---
# FEAT-006 — Calendar (manual day detail)

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|REQ-11]], [[01-requirements|NFR-01]] · Depends: [[FEAT-001-auth-shell]], [[FEAT-002-signin-ui-cookies]], [[FEAT-003-shell-polish]], [[FEAT-004-manual-logging]]

## Problem / user story
As a signed-in user, I want to open **Calendar**, pick a day (America/New_York), and see that day’s **manual** logs so I can review what I logged — without seeing Apple Health / CSV imports (those feed analytics only).

## Acceptance criteria
- [x] AC-1: Domain (and Calendar UI) can list **manual log entries** for a selected America/New_York calendar date for the signed-in account (REQ-11). Other dates’ entries are excluded.
- [x] AC-2: Changing the selected date swaps the list — **never** mixes entries across days (REQ-11).
- [x] AC-3: Empty selected day yields no entries / calm empty state copy — not another day’s data (REQ-11).
- [x] AC-4: Listing uses the **manual-log store only**; imported samples never appear on Calendar (REQ-11). (Until Import FEAT exists, enforced by query source.)
- [x] AC-5: Day lists are **account-scoped** — Demo cannot see Laura’s day entries (NFR-01).
- [x] AC-6: User can **delete** a manual entry from the selected day’s list via inline **Delete → Confirm Delete** (REQ-10 reuse on Calendar).
- [x] AC-7: `/calendar` shows shell title **Calendar** + subtitle; default selected day = **today** America/New_York; month/day picker lets user pick a past day (REQ-11 / NFR-06 reuse).
- [x] AC-8: Playwright: signed-in Laura with a log on a past day opens Calendar, selects that day, sees the entry, deletes it, confirms it is gone.

## Out of scope
- Creating new logs from Calendar (create stays on `/log`).
- Edit-in-place for any log type.
- Showing imported Apple Health / CSV / XML samples on Calendar.
- Analytics charts or Lifestyle summaries.
- Multi-month range search / jump-to-year UI beyond normal month navigation.
- Claude Design (not used on this project).

## Assumptions (approved)
1. **Default selection** = **today** (America/New_York) when opening `/calendar`.
2. **Reuse** `listTodayEntries(accountId, calendarDate)` (or alias) from FEAT-004 for day lists.
3. **Delete** on Calendar day-detail entry cards is **in scope** (inline Delete → Confirm Delete).
4. **Phone-first**; visual lock via Figma frames + [[FEAT-006-brief]].
5. Day markers / chip chrome: follow Figma only (selected = orange square; today = underline).

## Figma (binding visual references)
| State | Frame |
| --- | --- |
| Past/other day + long entry list | [62811-26284](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62811-26284) |
| Selected day = **today** | [62888-11530](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62888-11530) |
| Selected day with **0** logs | [62910-6163](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62910-6163) |
| **Scroll** — calendar + list under header; sticky header `#0B4041` @ 80% | [62811-26890](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62811-26890) |

## UX copy (locked from Figma)
| Key | String | Status |
| --- | --- | --- |
| shell.title.calendar | Calendar | locked |
| shell.subtitle.calendar | Select a day to review everything you logged. | locked Figma |
| calendar.day_heading | {weekday} · {Month} {D}, {YYYY} | locked pattern |
| calendar.day_heading_today | Today | locked when selected = today |
| log.entries_count | {count} logged entries | reused (incl. `0 logged entries`) |
| log.entry.delete / confirm_delete | Delete / Confirm Delete | reused FEAT-004 |
| log.type.* | Symptom, Blood pressure, … | reused |

## Technical notes
- Route: existing `/calendar` under `(shell)`.
- Domain: account-scoped manual entries by `calendarDate`; no import store reads.
- UI: month card + entries card; Delete → Confirm Delete on entry cards; sticky scroll header per Figma.
- Tests: Vitest day/account isolation + delete; Playwright AC-8.
- Design brief: [[FEAT-006-brief]].

## Open questions
- none

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-13 | Draft PRD for Calendar (REQ-11) | /new-feature |
| 2026-08-13 | Locked delete on entry cards; Figma state frames + design-brief | Owner |
| 2026-08-13 | Locked subtitle + day heading / Today / entries_count empty from Figma | Owner + brief |
| 2026-08-13 | **PRD approved** — ready for `/tdd-cycle` | Owner |
| 2026-08-13 | AC-1 green — `listManualLogsForDate` | /tdd-cycle |
| 2026-08-13 | AC-2 green — date swap never mixes days (regression; no new prod code) | /tdd-cycle |
| 2026-08-13 | AC-3 green — empty day returns [] (regression; no new prod code) | /tdd-cycle |
| 2026-08-13 | AC-4 green — listing from `log/store` only + manual type filter | /tdd-cycle |
| 2026-08-13 | AC-5 green — Demo cannot see Laura day entries (account-scoped) | /tdd-cycle |
| 2026-08-13 | AC-6 green — delete removes entry from day list (reuse deleteManualLog) | /tdd-cycle |
| 2026-08-13 | AC-7 green — Calendar UI + selection helpers (month grid, default today) | /tdd-cycle |
| 2026-08-13 | AC-8 green — Playwright past-day review + delete; feature **done** | /tdd-cycle |

