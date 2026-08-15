---
id: FEAT-008
type: prd
status: draft
implements: [REQ-16, REQ-17, REQ-20, NFR-01, NFR-06]
depends_on: [FEAT-001, FEAT-002, FEAT-003, FEAT-004, FEAT-007]
tests: [tests/feat-008-analytics.test.ts]
created: 2026-08-14
updated: 2026-08-14
---
# FEAT-008 — Analytics (all tabs)

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|REQ-16]], [[01-requirements|REQ-17]], [[01-requirements|REQ-20]], [[01-requirements|NFR-01]], [[01-requirements|NFR-06]] · Depends: [[FEAT-001-auth-shell]], [[FEAT-002-signin-ui-cookies]], [[FEAT-003-shell-polish]], [[FEAT-004-manual-logging]], [[FEAT-007-import]]

## Problem / user story
As a signed-in user, I want **Analytics** with four tabs so I can explore medication impact, cardiovascular trends, recovery, and electrolytes lifestyle comparisons — using binding chart rules (detailed import HR only where required; never summary HR aggregates; never imported BP).

## Scope
**This FEAT includes all four tabs** (REQ-16 + REQ-17 + REQ-20). **Build / visual lock order:** Medication first (Figma in hand); Cardiovascular, Recovery, Electrolytes when owner shares those Figma frames.

### Figma tab labels (UI) ↔ requirements names
| Figma chip | Requirements section |
| --- | --- |
| Medication | Medication / Chart 1 (REQ-16) |
| Cardiovascular | Heart Trends / Charts 2–3 (REQ-17) |
| Recovery | Recovery / Charts 4–5 (REQ-17) |
| Electrolytes | Lifestyle cards (REQ-20) |

## Acceptance criteria
### Shell + tabs
- [ ] AC-1: `/analytics` shell title **Analytics** + locked subtitle; four chips **Medication | Cardiovascular | Recovery | Electrolytes**; default **Medication** (REQ-16 / NFR-06 / Figma).

### Medication (Chart 1) — build first
- [ ] AC-2: Medication Impact card: title + helper; **date control** (prev day / date field `MM/DD/YYYY` / next day); **Compare** [med] **with** [metric]; Recharts chart area (REQ-16 / Figma `62816:27152`).
- [ ] AC-3: Domain series for selected America/New_York **calendar day** + medication + metric (`Heart Rate` | BP) with X slots `-2h | -1h | Dose | +1h | +2h` relative to take-time (REQ-16).
- [ ] AC-4: Slot rule ±15 min closest; no interpolation (REQ-16).
- [ ] AC-5: BP = manual systolic only; HR = manual BP-log HR + detailed `heart_rate` only (REQ-16).
- [ ] AC-6: Medication dropdown lists catalog; names **with no log that day** are gray `#8E8E93` and **not selectable**; if multiple takes that day, chart uses **most recent** take-time as Dose (REQ-16, owner lock).
- [ ] AC-7: Tooltips: BP `sys/dia` + time; HR `{n} bpm` + time (REQ-16).
- [ ] AC-8: Account-scoped — Demo cannot read Laura analytics inputs (NFR-01).

### Cardiovascular / Recovery / Electrolytes
- [ ] AC-9: Cardiovascular tab: Chart 2 (BP & HR) + Chart 3 (Tachycardia Burden) per REQ-17 + Figma `62953:4603` / `62953:4604`.
- [ ] AC-10: Recovery tab implements Chart 4 + Chart 5 per REQ-17 (Figma TBD).
- [ ] AC-11: Electrolytes tab implements Lifestyle With/Without cards per REQ-20 (Figma TBD).

### Journey
- [ ] AC-12: Playwright: Laura opens Analytics → Medication → date/med/metric → sees chart or empty chart area per data.

## Out of scope
- Summary CSV HR aggregates as chart inputs.
- Imported BP (never).
- Today / Last 7 / Last 30 range on **Medication** tab (those ranges apply to other charts when designed).
- Clinician portal / AI diagnosis / native zip/XML.

## Assumptions (locked)
1. **All four tabs** in this FEAT; Medication Figma first, other tab Figma later.
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
| analytics.med.metric.hr | Heart Rate | locked |
| analytics.med.date_format | MM/DD/YYYY | locked display pattern (e.g. 08/01/2026) |
| analytics.med.prev_day / next_day | Previous day / Next day | a11y labels |
| analytics.med.unavailable | _(visual)_ | gray `#8E8E93`, not selectable — no separate string required |
| analytics.cardio.chart2.title | Blood Pressure and Heart Rate | locked Figma 62953:4603 |
| analytics.cardio.chart2.helper | See how changes in one may relate to changes in the other. | locked |
| analytics.range.today | Today | locked |
| analytics.range.last_7 | Last 7 Days | locked (Figma; REQ said “Past 7 days”) |
| analytics.range.last_30 | Last 30 Days | locked |
| analytics.cardio.chart3.title | Tachycardia Burden | locked Figma 62953:4604 |
| analytics.cardio.chart3.helper | Percent of heart rate readings ≥ 100 bpm | locked — math + UI ≥100 (overrides Figma `>`) |
| analytics.cardio.chart3.disclaimer_title | Data Disclaimer | locked |
| analytics.cardio.chart3.disclaimer_body | This chart is not a complete measure of tachycardia burden. Your Apple Watch does not provide continuous heart rate monitoring, and might not be worn at all times. Because of this, total time spent in tachycardia cannot be calculated.\n\nInstead, this chart shows the percentage of heart rate readings that were at or above the 100 bpm threshold. | locked |

## Technical notes
- Route: `/analytics`; Recharts for charts.
- Inputs: FEAT-004 logs + FEAT-007 detailed samples as each view requires.
- Never read `summary_*` HR keys for Charts 1–3 / Lifestyle imported HR.
- Domain pure functions; UI thin.

## Open questions
1. Figma frames for **Recovery** and **Electrolytes** (when ready).
2. Optional: empty-chart helper text when selected series has data gaps (dashed placeholder OK for v1).

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-14 | Draft PRD — Analytics shell + Medication (REQ-16) | /new-feature |
| 2026-08-14 | Expand to REQ-16/17/20; Recharts; Figma Medication; subtitle + tab labels | Owner |
| 2026-08-14 | Medication = single-day date picker + prev/next; disabled gray untaken meds; multi-dose → most recent | Owner + Figma 62816-27152 |
| 2026-08-14 | Cardiovascular Chart 2 + Chart 3 Figma + copy locked; ≥ vs > open | Owner Figma 62953:4603 / 4604 |
| 2026-08-14 | Chart 3 threshold = **≥ 100** bpm (math + copy) | Owner |
