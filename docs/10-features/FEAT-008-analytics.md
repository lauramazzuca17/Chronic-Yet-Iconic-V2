---
id: FEAT-008
type: prd
status: done
implements: [REQ-16, REQ-17, REQ-20, NFR-01, NFR-06]
depends_on: [FEAT-001, FEAT-002, FEAT-003, FEAT-004, FEAT-007]
tests: [tests/feat-008-analytics.test.ts, e2e/feat-008-analytics-journey.spec.ts]
created: 2026-08-14
updated: 2026-08-18
---
# FEAT-008 — Analytics (all tabs)

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|REQ-16]], [[01-requirements|REQ-17]], [[01-requirements|REQ-20]], [[01-requirements|NFR-01]], [[01-requirements|NFR-06]] · Depends: [[FEAT-001-auth-shell]], [[FEAT-002-signin-ui-cookies]], [[FEAT-003-shell-polish]], [[FEAT-004-manual-logging]], [[FEAT-007-import]]

## Problem / user story
As a signed-in user, I want **Analytics** with four tabs so I can explore medication impact, cardiovascular trends, recovery, and electrolytes lifestyle comparisons — using binding chart rules (detailed import HR only where required; never summary HR aggregates; never imported BP).

## Scope
**This FEAT includes all four tabs** (REQ-16 + REQ-17 + REQ-20). **All tab Figma frames are locked** (Medication → Cardiovascular → Recovery → Electrolytes).

### Figma tab labels (UI) ↔ requirements names
| Figma chip | Requirements section |
| --- | --- |
| Medication | Medication / Chart 1 (REQ-16) |
| Cardiovascular | Heart Trends / Charts 2–3 (REQ-17) |
| Recovery | Recovery / Charts 4–5 (REQ-17) |
| Electrolytes | Lifestyle cards (REQ-20) |

## Acceptance criteria
### Shell + tabs
- [x] AC-1: `/analytics` shell title **Analytics** + locked subtitle; four chips **Medication | Cardiovascular | Recovery | Electrolytes**; default **Medication** (REQ-16 / NFR-06 / Figma).

### Medication (Chart 1) — build first
- [x] AC-2: Medication Impact card: title + helper; **date control** (prev day / date field `MM/DD/YYYY` that opens a native calendar / next day); **Compare** [med] **with** [metric]; Recharts chart area (REQ-16 / Figma `62816:27152`).
- [x] AC-3: Domain series for selected America/New_York **calendar day** + medication + metric (`Heart Rate` | BP) with X slots `-2h | -1h | Dose | +1h | +2h` relative to take-time (REQ-16).
- [x] AC-4: Slot rule ±15 min closest; no interpolation (REQ-16).
- [x] AC-5: BP = manual systolic only; HR = manual BP-log HR + detailed `heart_rate` only (REQ-16).
- [x] AC-6: Medication dropdown lists catalog; names **with no log that day** are gray `#8E8E93` and **not selectable**; if multiple takes that day, chart uses **most recent** take-time as Dose (REQ-16, owner lock).
- [x] AC-7: Tooltips: BP `sys/dia` + time; HR `{n} bpm` + time (REQ-16).
- [x] AC-8: Account-scoped — Demo cannot read Laura analytics inputs (NFR-01).

### Cardiovascular / Recovery / Electrolytes
- [x] AC-9: Cardiovascular tab: Chart 2 (BP & HR) + Chart 3 (Tachycardia Burden) per REQ-17 + Figma `62953:4603` / `62953:4604`.
- [x] AC-10: Recovery tab: Chart 4 (HRV) Figma `62957:4735` + Chart 5 (walking HR) Figma `62959:4803` per REQ-17.
- [x] AC-11: Electrolytes tab: With/Without comparison cards per REQ-20 + Figma `62967:5991`.

### Journey
- [x] AC-12: Playwright: Laura opens Analytics → Medication → date/med/metric → sees chart or empty chart area per data.

## Out of scope
- Summary CSV HR aggregates as chart inputs.
- Imported BP (never).
- Today / Last 7 / Last 30 range on **Medication** tab (those ranges apply to other charts when designed).
- Clinician portal / AI diagnosis / native zip/XML.

## Assumptions (locked)
1. **All four tabs** in this FEAT; **all Figma frames locked**.
2. **Chart library = Recharts.**
3. Subtitle: **Compare how different factors impact your health over time.**
4. Medication window = **single America/New_York day** via date picker + prev/next (not 7/30 range).
5. Multi-dose that day → **most recent** take-time (not an error wall).
6. Untaken meds that day → shown in dropdown as disabled gray `#8E8E93`.
7. Phone-first; sticky OnScroll header; text/table fallback for critical BP/HR views.

## Figma (binding)
| State | Frame |
| --- | --- |
| Analytics page (header + Medication) | [62816-27151](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62816-27151) |
| Medication main / date + Compare controls | [62816-27152](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62816-27152) |
| Chart 2 — BP & HR (Cardiovascular) | [62953-4603](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62953-4603) |
| Chart 3 — Tachycardia Burden (Cardiovascular) | [62953-4604](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62953-4604) |
| Chart 4 — Heart Rate Variability (Recovery) | [62957-4735](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62957-4735) |
| Chart 5 — Average Walking Heart Rate (Recovery) | [62959-4803](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62959-4803) |
| Electrolytes full page (With/Without cards) | [62967-5991](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62967-5991) |

## UX copy (locked)
| Key | String | Status |
| --- | --- | --- |
| shell.title.analytics | Analytics | locked |
| shell.subtitle.analytics | Compare how different factors impact your health over time. | locked |
| analytics.tab.medication | Medication | locked |
| analytics.tab.cardiovascular | Cardiovascular | locked |
| analytics.tab.recovery | Recovery | locked |
| analytics.tab.electrolytes | Electrolytes | locked |
| analytics.med.title | Medication Impact | locked |
| analytics.med.helper | See how your vitals change before and after taking a medication. | locked |
| analytics.med.compare | Compare | locked |
| analytics.med.with | with | locked |
| analytics.med.select_empty | Medication | locked — empty Compare select (Figma) |
| analytics.med.metric.hr | Heart Rate | locked |
| analytics.med.metric.bp | BP | locked |
| analytics.med.date_format | MM/DD/YYYY | locked display pattern (e.g. 08/01/2026) |
| analytics.med.prev_day / next_day | Previous day / Next day | a11y labels |
| analytics.med.unavailable | _(visual)_ | gray `#8E8E93`, not selectable — no separate string required |
| analytics.med.empty_window | No {stat} logged during this timeframe | `{stat}` = HR or BP |
| analytics.med.empty_window.hr | HR | |
| analytics.med.empty_window.bp | BP | |
| analytics.med.pick_date | Choose date | a11y for date-field calendar |
| analytics.cardio.chart2.title | Blood Pressure and Heart Rate | locked Figma 62953:4603 |
| analytics.cardio.chart2.helper | See how changes in one may relate to changes in the other. | locked |
| analytics.range.today | Today | locked |
| analytics.range.last_7 | Last 7 Days | locked (Figma; REQ said “Past 7 days”) |
| analytics.range.last_30 | Last 30 Days | locked |
| analytics.cardio.chart3.title | Tachycardia Burden | locked Figma 62953:4604 |
| analytics.cardio.chart3.helper | Percent of heart rate readings ≥ 100 bpm | locked — math + UI ≥100 (overrides Figma `>`) |
| analytics.cardio.chart3.disclaimer_title | Data Disclaimer | locked |
| analytics.cardio.chart3.disclaimer_body | This chart is not a complete measure of tachycardia burden. Your Apple Watch does not provide continuous heart rate monitoring, and might not be worn at all times. Because of this, total time spent in tachycardia cannot be calculated.\n\nInstead, this chart shows the percentage of heart rate readings that were at or above the 100 bpm threshold. | locked |
| analytics.recovery.hrv.title | Heart Rate Variability | locked Figma 62957:4735 |
| analytics.recovery.hrv.helper | HRV measures the changes in time between your heartbeats. | locked |
| analytics.recovery.hrv.info_title | What your HRV shows | locked |
| analytics.recovery.hrv.info_intro | Your autonomic nervous system controls HRV through two competing parts: | locked |
| analytics.recovery.hrv.info_sympathetic | Sympathetic system: The "fight-or-flight" response that speeds up your heart during stress or action. | locked; bold label in UI |
| analytics.recovery.hrv.info_parasympathetic | Parasympathetic system: The "rest-and-digest" response that slows down your heart and creates variation between beats. | locked; bold label in UI |
| analytics.recovery.hrv.info_footer | What does this mean for someone with POTs? No clue. But when I figure it out I’ll have this chart to reference. | locked from Figma (spelling POTs as designed) |
| analytics.recovery.walking.title | Average Walking Heart Rate | locked Figma 62959:4803 |
| analytics.recovery.walking.helper | Walks outside can be very challenging. This chart will show what your average heart rate is during these walks. | locked |
| analytics.recovery.walking.range_note | Last 7 Days \| Last 30 Days only (no Today) | locked control set |
| analytics.electrolytes.title | Electrolytes | locked Figma 62967:5991 |
| analytics.electrolytes.helper | See how days with electrolytes compare to days without. | locked |
| analytics.electrolytes.with_title | With Electrolytes | locked |
| analytics.electrolytes.with_helper | Averages based on days you logged electrolytes | locked |
| analytics.electrolytes.without_title | Without Electrolytes | locked |
| analytics.electrolytes.without_helper | Averages based on days you didn’t log electrolytes | locked |
| analytics.electrolytes.metric.avg_hr | Avg HR | locked |
| analytics.electrolytes.metric.avg_resting | Avg Resting | locked |
| analytics.electrolytes.metric.avg_walking | Avg Walking | locked |
| analytics.electrolytes.metric.avg_bp | Avg BP | locked |
| analytics.electrolytes.unit.bpm | bpm | locked unit suffix |

## Technical notes
- Route: `/analytics`; Recharts for charts.
- Inputs: FEAT-004 logs + FEAT-007 detailed samples as each view requires.
- Never read `summary_*` HR keys for Charts 1–3 / Lifestyle imported HR.
- Domain pure functions; UI thin.

## Open questions
- none

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-14 | Draft PRD — Analytics shell + Medication (REQ-16) | /new-feature |
| 2026-08-14 | Expand to REQ-16/17/20; Recharts; Figma Medication; subtitle + tab labels | Owner |
| 2026-08-14 | Medication = single-day date picker + prev/next; disabled gray untaken meds; multi-dose → most recent | Owner + Figma 62816-27152 |
| 2026-08-14 | Cardiovascular Chart 2 + Chart 3 Figma + copy locked; ≥ vs > open | Owner Figma 62953:4603 / 4604 |
| 2026-08-14 | Chart 3 threshold = **≥ 100** bpm (math + copy) | Owner |
| 2026-08-14 | Chart 4 HRV Figma + copy locked (range + info callout) | Owner Figma 62957:4735 |
| 2026-08-14 | Chart 5 walking HR Figma; range = Last 7 / Last 30 only (no Today) | Owner Figma 62959:4803 |
| 2026-08-15 | Electrolytes full-page Figma + With/Without card copy locked | Owner Figma 62967:5991 |
| 2026-08-15 | Status → `approved` / `in-progress`; start `/tdd-cycle` AC-1 | Owner ready for tdd-cycle |
| 2026-08-15 | AC-1 green — `src/analytics/tabs` + shell subtitle | /tdd-cycle |
| 2026-08-15 | AC-2 green — Medication Impact card chrome + date helpers | /tdd-cycle |
| 2026-08-15 | AC-3 green — `buildMedicationImpactSeries` slots −2h…+2h | /tdd-cycle |
| 2026-08-15 | AC-4 green — ±15 min closest slot fill; no interpolation | /tdd-cycle |
| 2026-08-15 | AC-5 green — BP systolic; HR = manual + detailed heart_rate | /tdd-cycle |
| 2026-08-15 | AC-6 green — disabled `#8E8E93` untaken meds; multi-dose most recent | /tdd-cycle |
| 2026-08-15 | AC-7 green — tooltips BP `sys/dia` + time; HR `{n} bpm` + time | /tdd-cycle |
| 2026-08-15 | AC-8 green — Demo cannot read Laura analytics (regression lock) | /tdd-cycle |
| 2026-08-15 | AC-9 green — Chart 2 overlay + Chart 3 tachycardia ≥100 | /tdd-cycle |
| 2026-08-15 | AC-10 green — HRV + walking HR series (Chart 4–5) | /tdd-cycle |
| 2026-08-15 | AC-11 green — Electrolytes With/Without comparison cards | /tdd-cycle |
| 2026-08-17 | Compare select stays enabled with “Medication” empty label; date caps white per owner screenshot; pills clamp at 122px | Owner visual pass |
| 2026-08-18 | Empty window copy (`No HR/BP logged during this timeframe`); native date picker on the date field; tooltip without leading colon; y-axis plotted min−30 / max+30 | Owner |
| 2026-08-18 | Client chart helpers moved to `medication-chart.ts` so Analytics does not bundle `node:fs` | Vercel `next build` |
