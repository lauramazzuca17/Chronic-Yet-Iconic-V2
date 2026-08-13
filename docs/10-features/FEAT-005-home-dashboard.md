---
id: FEAT-005
type: prd
status: done
implements: [REQ-01, NFR-01]
depends_on: [FEAT-001, FEAT-002, FEAT-003, FEAT-004]
tests: [tests/feat-005-home-dashboard.test.ts, e2e/feat-005-home-journey.spec.ts]
created: 2026-08-13
updated: 2026-08-13
---
# FEAT-005 — Home dashboard (today’s summary)

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|REQ-01]], [[01-requirements|NFR-01]] · Depends: [[FEAT-001-auth-shell]], [[FEAT-002-signin-ui-cookies]], [[FEAT-003-shell-polish]], [[FEAT-004-manual-logging]]

Figma: [Home Dashboard](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62795-75) · [Water card electrolytes taken](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62920-2588)

## Problem / user story
As a signed-in user, I want the Home/Dashboard route (`/`) to summarize **today’s** activity at a glance — BP, meds, water + electrolytes, and symptoms — so I can see the day without opening Log or Calendar.

## Layout (locked from Figma; Health records hidden in v1)
1. **Header block** (shell): eyebrow, **Dashboard**, subtitle **Take a look around!**, Sign out.
2. **Row:** **BP Readings** card (count) | **Latest BP** card (sys/dia).
3. **Full width:** **Meds taken today** (count).
4. **Full width:** **Total Water** (oz) with nested **Taken** electrolytes badge (X = not taken / no row; check = taken-yes row).
5. **Full width:** **Symptom logs** (count).
6. ~~**Health records**~~ — **hidden in v1** (Figma has it; owner deferred; do not ship the card).

## Acceptance criteria
- [x] AC-1: Home shows **BP Readings** count for today America/New_York (REQ-01.1). Copy: title `BP Readings`, helper `Manual BP entries`.
- [x] AC-2: Home shows **Latest BP** as **systolic/diastolic only** when ≥1 BP today; otherwise empty/placeholder per Figma (REQ-01.2). **No HR. No posture.** Helper: `Most recent BP`.
- [x] AC-3: Home shows **Meds taken today** count (REQ-01.3). Helper: `Logged medication`.
- [x] AC-4: Home shows **Total Water** as `{n}oz` for today (REQ-01.4 / water sum). Helper: `Amount of water drank today`.
- [x] AC-5: Home shows **Symptom logs** count today (REQ-01.5). Helper: `Manual symptom entries`.
- [x] AC-6: Home shows electrolytes **inside the water card** as **Taken** badge: check = taken-yes row exists; X = no row (REQ-01.6). No create-no path.
- [x] AC-7: Empty/zero day still shows all cards with `0` / empty latest / Taken+X — **never** another calendar day’s data (REQ-01).
- [x] AC-8: Summaries are **account-scoped** — Demo cannot see Laura’s today stats (NFR-01).
- [x] AC-9: Playwright: signed-in Laura with known today logs sees BP/meds/water/symptoms (and electrolytes badge) reflect those logs on `/`.

## Out of scope
- **Health records** card on Home (Figma present; **v1 hide** — no REQ-01 amend).
- Mood / event summaries on Home.
- Calendar day picker or historical Home ranges.
- Editing logs from the dashboard.
- Redesigning shell chrome (reuse FEAT-003).
- Import ingest UI.

## Assumptions (approved)
1. **Most recent BP** = highest `recorded_at` among today’s BP rows; display **sys/dia only**.
2. **Electrolytes:** nested in Total Water card; **Taken** label always; icon check vs X per Figma.
3. **Water display** uses Figma form `0oz` (no space) via copy key.
4. **Subtitle** locked to Figma: **Take a look around!**
5. **Phone-first**; white rounded metric cards over pond background per Figma.
6. Health records card stays out of the DOM/layout for v1 (not just visually empty).

## UX copy (locked from Figma)
| Key | String | Status |
| --- | --- | --- |
| shell.title.dashboard | Dashboard | reused |
| shell.subtitle.dashboard | Take a look around! | locked Figma |
| dashboard.metric.bp_count | BP Readings | locked Figma |
| dashboard.metric.bp_count_helper | Manual BP entries | locked Figma |
| dashboard.metric.bp_latest | Latest BP | locked Figma |
| dashboard.metric.bp_latest_helper | Most recent BP | locked Figma |
| dashboard.metric.bp_latest_value | {sys}/{dia} | locked pattern |
| dashboard.metric.meds_count | Meds taken today | locked Figma |
| dashboard.metric.meds_helper | Logged medication | locked Figma |
| dashboard.metric.water_total | Total Water | locked Figma |
| dashboard.metric.water_helper | Amount of water drank today | locked Figma |
| dashboard.metric.water_value | {oz}oz | locked Figma (no space) |
| dashboard.metric.electrolytes_taken | Taken | locked Figma badge |
| dashboard.metric.symptoms_count | Symptom logs | locked Figma |
| dashboard.metric.symptoms_helper | Manual symptom entries | locked Figma |
| dashboard.metric.count_value | {count} | shared |

## Technical notes
- Route `/` under `(shell)`; implement card layout from Figma **without** Health records.
- Domain: `getTodayDashboardSummary(accountId, calendarDate)` from FEAT-004 store.
- Electrolytes badge: presentational only on Home (no create from badge).
- Tests: Vitest summary math/isolation; Playwright AC-9.

## Open questions
- none

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-13 | Draft PRD for Home dashboard (REQ-01) | /new-feature |
| 2026-08-13 | Locked: latest BP sys/dia only; electrolytes from Figma card; design-brief before build | Owner |
| 2026-08-13 | Figma walkthrough: layout + copy; Health records card flagged vs REQ-01 | Owner |
| 2026-08-13 | Hide Health records card in v1; drop AC; no REQ-01 amend | Owner |
| 2026-08-13 | **PRD approved** — ready for `/tdd-cycle` | Owner |
| 2026-08-13 | AC-1 green — `getTodayDashboardSummary.bpCount` | /tdd-cycle |
| 2026-08-13 | AC-2 green — `latestBp` sys/dia or null | /tdd-cycle |
| 2026-08-13 | AC-3 green — `medsCount` | /tdd-cycle |
| 2026-08-13 | AC-4 green — `waterTotalOz` | /tdd-cycle |
| 2026-08-13 | AC-5 green — `symptomsCount` | /tdd-cycle |
| 2026-08-13 | AC-6 green — `electrolytesTaken` boolean | /tdd-cycle |
| 2026-08-13 | AC-7 green — empty day zeros; other-day data excluded (regression; no new prod code) | /tdd-cycle |
| 2026-08-13 | AC-8 green — Demo cannot see Laura stats (account-scoped; no new prod code) | /tdd-cycle |
| 2026-08-13 | AC-9 green — Home UI + Playwright journey; feature **done** | /tdd-cycle |

