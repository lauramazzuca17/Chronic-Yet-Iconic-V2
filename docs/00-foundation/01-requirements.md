---
project: "Chronic Yet Iconic V2"
type: product-requirements
status: approved
approved: 2026-08-10
updated: 2026-08-10
---

# Product Requirements (master)

[[00-overview|← Overview]]

> [!important] Build gate
> Cursor Agent must not implement features while this doc is `working-draft`.
> Complete the full requirements list via `/define`, then set status to
> `approved` with the date. Per-feature PRDs in `docs/10-features/` implement
> requirements from this list and must reference their REQ-IDs.

## Product goal
Give the user the ability to log their health stats — manually or by import from date-ranged third-party Apple Health CSV exports (summary + detailed) — and gain insights on their health trends, especially the relationship between medications, blood pressure, and heart rate in the context of POTS.

## MVP scope
- One **log screen** for all manual entry types listed below.
- Logging: symptom, BP (with HR), meds, water (oz + daily total), electrolytes (daily Y/N), mood, event notes.
- **Delete** any manually logged entry; **batch-delete** imported CSV batches; electrolytes allow only one entry per day (block further creates until deleted).
- Home dashboard summarizing today's stats.
- Calendar: select a day and see **manual** logs for that day.
- Import via **third-party date-ranged CSV pair** (summary + detailed); **not** native Apple zip/XML.
- Analytics: charts and insights (e.g. how blood pressure reacted relative to medication).
- Password protection; **exactly two seeded accounts** (Laura + Demo); **no public registration**; Demo empty of health data; test account cannot see owner data.
- No whole-account self-delete required in v1.

### Manual log field contract (MVP)
| Type | Fields |
| --- | --- |
| Symptom | **name from fixed dropdown** (seeded catalog), severity (`Normal amount` / `Worse than usual` / `Better than usual`), date/time, optional notes |
| Blood pressure | systolic, diastolic, heart rate (at time of BP), date/time |
| Medication | **name from fixed dropdown** (seeded catalog), dose, date/time |
| Water | amount in oz; contribute to **total water drank that day** |
| Electrolytes | once-per-day **taken = yes** with date/time (no “log no” UI — absence means not taken); **block** a second create for that day until the existing entry is deleted |
| Mood | dropdown: awful \| not great \| okay \| good \| great; date/time |
| Event | event note (textarea), date/time |

### Import format contract (MVP) — third-party date-ranged CSV pair
**Primary v1 import:** CSV exports from a third-party app that pulls Apple Health for a **chosen date range**, producing two files. **Both files are required for every import** (the app exports them together):

| File | Role | Header / shape |
| --- | --- | --- |
| `*_summary_*.csv` | Daily aggregates | `Date` + aggregate columns (see fixtures) |
| `*_detailed_*.csv` | Point-in-time “raw” samples | `Timestamp,Date,Time,Metric,Value,Unit` |

Import UX must accept **both** in one operation; reject if either is missing or headers don’t match the expected shape (blunt error).

Reference fixtures: `fixtures/import/health_export_summary_20260810.csv`, `fixtures/import/health_export_detailed_20260810.csv`.

**Out of scope for v1:** native Apple Health export **`.zip`**, and **XML** imports.

**Blood pressure:** never imported — even if summary includes BP columns; BP remains **manual log only**.

#### Detailed CSV `Metric` → internal `metric_key` (binding)
| Export `Metric` | `metric_key` | Unit | Used by |
| --- | --- | --- | --- |
| `heart_rate` | `heart_rate` | bpm | Charts 1–3; Lifestyle avg HR |
| `resting_heart_rate` | `resting_heart_rate` | bpm | Lifestyle avg resting (not Charts 1–2) |
| `walking_heart_rate_avg` | `walking_heart_rate_average` | bpm | Chart 5; Lifestyle walking HR |
| `hrv_sdnn` | `heart_rate_variability` | ms | Chart 4 |
| `steps` | `step_count` | count | stored if present |
| `distance_walking_running` | `walking_running_distance` | mi | stored if present |
| `exercise_minutes` | `apple_exercise_time` | min | stored if present |
| `active_energy` / `basal_energy` / `flights_climbed` | stable keys if ingested | kcal / count | optional; not required for locked charts |

Summary-only columns (Sleep*, Blood Oxygen, Respiratory Rate, etc.) may be mapped at import FEAT when needed; locked charts above are driven by **detailed** samples (+ manual logs).

`Timestamp` is authoritative for `recorded_at` (includes offset, e.g. `-04:00`); normalize to America/New_York per data model.

### Analytics — imported HR source rule (binding)
For **Chart 1 (Medication impact)**, **Chart 2 (BP & HR over time)**, **Chart 3 (tachycardia %)**, and **Lifestyle comparison cards (view 6)**: all **imported** heart-rate-related values come from the **detailed** CSV only — **never** from the summary CSV aggregates. (Summary may still be stored for other uses; these views must not read summary HR columns.)

Specific detailed `Metric` keys per view remain as listed in each chart/card section below.

### Analytics — information architecture (binding)
Four tabs on the analytics page (Figma chips): **Medication** | **Cardiovascular** | **Recovery** | **Electrolytes**. **Six views total:** five charts + one Electrolytes/Lifestyle comparison section (not a chart). Requirements sections below still use Heart Trends / Lifestyle as analytic names where noted.

### Analytics — Medication tab: Medication impact chart (binding)
- **Only chart on this tab.**
- **Controls:** date select (America/New_York day) with previous/next day; medication name dropdown (catalog); metric dropdown: `heart rate` | `bp`.
- **X-axis:** time relative to medication **take-time** that day: `-2h`, `-1h`, `Dose`, `+1h`, `+2h` (`Dose` = take-time t=0, not dosage amount). If multiple takes of that med that day, use the **most recent** take-time as t=0.
- **Medication dropdown:** catalog names with **no log that day** appear in gray `#8E8E93` and are **not selectable**.
- **Y-axis / data sources:**
  - Metric **BP:** **manual BP logs only** (systolic for Y; never Apple Health).
  - Metric **HR:** **manual BP-log heart rate** + imported detailed **`heart_rate`** only (not resting).
- **Slot value rule:** for each X-axis time T, among candidate points in **±15 minutes**, pick the **closest in time**; else blank. No interpolation. BP candidates = manual BP logs. HR candidates = manual BP-log HR + detailed **`heart_rate`** imports.
- **Tooltip** on data point:
  - If metric=BP: full reading **sys/dia** + time (e.g. `8:07 AM`).
  - If metric=HR: exact HR (e.g. `105 bpm`) + time.

### Analytics — Heart Trends tab: Chart 2 — BP & HR over time (binding)
- **Type:** two-line **overlay** on one chart (not side-by-side) to show interaction between BP and HR.
- **Range control (UI):** `Today` | `Last 7 Days` | `Last 30 Days` (America/New_York; Figma 62953:4603).
- **X-axis:** time across the selected range.
- **Y-axis:** shared numeric scale **50–190** (fixed). Plots **systolic** (manual BP) and **HR** (manual BP-log HR + detailed CSV **`heart_rate`**) as two lines — intentional shared axis so patterns (HR up when BP up/down) are visible together. POTS variability is the point: use point **`heart_rate`**, not resting.
- **Style:** both lines **semi-faded** by default; on hover/focus of a line, that line goes to **full opacity** (other stays faded).
- **BP** line: manual only.
- **HR** line: manual BP-log HR + imported detailed **`heart_rate`** (not resting).
### Analytics — Heart Trends tab: Chart 3 — Tachycardia reading burden (binding)
- **Goal:** Show the clinician this is not occasional spikes — a substantial share of HR readings are ≥100 bpm. (Total time-in-tachycardia is out of scope.)
- **Type:** bar chart (horizontal OK: days on one axis, % on the other).
- **Day axis:** last **6 days + today** (7 bars), America/New_York, weekday labels ending with today.
- **Value:** **percentage (0–100)** of that day’s HR readings that are **≥ 100** bpm (owner lock; overrides Figma `>` wording).
- **UI (Figma 62953:4604):** title Tachycardia Burden; helper; bar chart for last 6 days + today; Data Disclaimer callout (copy deck — helper/disclaimer use ≥ / “at or above”).
- **Data sources (Chart 3 only):** **manual BP-log HR** + imported detailed **`heart_rate`**. Not resting HR.
- Denominator = all Chart-3-eligible HR readings that day; numerator = those **≥ 100**. If denominator is 0, show empty/zero state for that day (no divide-by-zero).

### Analytics — Recovery tab (binding)
Two charts on this tab.

#### Chart 4 — HRV over time
- **Type:** line chart.
- **Range control (UI):** `Today` | `Last 7 Days` | `Last 30 Days` (America/New_York; Figma 62957:4735).
- **X-axis:** time across the selected range.
- **Y-axis:** Heart Rate Variability (ms).
- **Data source:** imported **`heart_rate_variability`** (`hrv_sdnn` in detailed CSV) only.
- **UI (Figma 62957:4735):** title Heart Rate Variability; helper; range switch; dashed chart placeholder; “What your HRV shows” info callout (copy deck).

#### Chart 5 — Average walking HR over time
- **Type:** line chart.
- **Range control (UI):** `Last 7 Days` | `Last 30 Days` only — **no Today** (Figma 62959:4803; overrides earlier three-option range).
- **X-axis:** time across the selected range.
- **Y-axis:** Walking Heart Rate Average (count/min).
- **Data source:** imported **`walking_heart_rate_average`** (`walking_heart_rate_avg` in detailed CSV) only.
- **UI (Figma 62959:4803):** title Average Walking Heart Rate; helper; two-option range switch; dashed chart placeholder.

### Analytics — Lifestyle tab: Electrolytes comparison cards (binding)
v1 has **one section**, not a chart: **two comparison cards** (Figma `62967:5991`).
- **Section title / helper:** Electrolytes / “See how days with electrolytes compare to days without.”
- **Window:** from the **first calendar day with electrolytes = yes** through the latest data (America/New_York). No comparison averages before that first “with” day.
- **With cohort:** days in that window with electrolytes **yes**.
- **Without cohort:** days in that window **not** explicitly logged as electrolytes yes (explicit `no` or no electrolyte log).

#### Card 1 — With Electrolytes / Card 2 — Without Electrolytes
Each card (2×2 metric grid per Figma):
- **Avg HR** — mean of manual BP-log HR + imported **`heart_rate`** on cohort days
- **Avg Resting** — mean of imported **`resting_heart_rate`**
- **Avg Walking** — mean of imported **`walking_heart_rate_average`**
- **Avg BP** — **mean systolic over mean diastolic** (display like `100/60`), both from manual BP logs only

If a cohort has no samples for a metric, show an empty/not-enough-data state for that metric (not zero pretending to be real).

### Dashboard — today’s summary (binding)
For the current America/New_York calendar day, show:
1. Count of BP readings that day
2. Most recent BP that day — systolic / diastolic
3. Count of medication logs that day
4. Total water drank that day (oz)
5. Total number of symptoms logged that day
6. Electrolytes taken that day — Y/N (plus not-logged if none)

## Out of scope / non-goals
- Clinician portals (never).
- Multi-condition support (not considering; product solves a specific personal POTS goal).
- Social features of any kind.
- AI diagnosis (never).
- Importing blood pressure from any import file (never — manual BP only).
- Posture on BP readings (lying/sitting/standing) — never in v1 (or later unless requirements change).
- Native Apple Health **`.zip`** export ingest (v1).
- **XML** health imports (v1).

## Primary journeys
1. Open app → home dashboard → see a summary of today's stats.
2. Open app → **log screen** → record entries (including blood pressure + heart rate and other MVP log types on that same screen).
3. Open app → calendar → select a date from a week ago → see **manual** logs for that day (not imports).
4. Open app → analytics → Medication (or other) tab → use chart controls → view chart / tooltips.
5. Open app → import → upload **both** third-party CSVs (summary + detailed) together.
6. Sign in with password; use a separate test account that cannot access owner health data.
7. Delete a manual log entry (including electrolytes, which then allows logging electrolytes again that day).
8. Delete an **import batch** (removes all samples from that upload).

## Functional requirements

| ID | Requirement | Acceptance signal |
| --- | --- | --- |
| REQ-01 | Home dashboard summarizes **today** (America/New_York) with: (1) **count of BP readings** today, (2) **most recent BP** today as systolic/diastolic, (3) **count of meds logged** today, (4) **total water oz** today, (5) **count of symptoms** today, (6) **electrolytes Y/N** for today (or not-logged state) | Given known today logs, dashboard shows those six summary fields; with no logs, empty/zero/not-logged states — not another day's data |
| REQ-02 | All manual log types are entered from a **single log screen** | UI exposes one log surface that can create symptom, BP, med, water, electrolyte, mood, and event entries (no separate apps/screens required per type for create) |
| REQ-03 | User can log a blood pressure reading: systolic, diastolic, HR at measurement, date/time | After submit, entry with those four fields appears in today's data and that day's calendar detail |
| REQ-04 | User can log a symptom: name from **fixed** dropdown, severity (Normal amount / Worse than usual / Better than usual), date/time, optional notes | Name from seeded catalog only; severity one of the three labels; saved entry shows fields on calendar day detail |
| REQ-05 | User can log a medication: name from **fixed** dropdown, dose, date/time | Name from seeded catalog only; saved entry shows correct name, dose, timestamp on calendar day detail |
| REQ-06 | User can log water in oz and see total water for that day | Logging 8 oz then 8 oz yields daily total 16 oz for that date |
| REQ-07 | User can log electrolytes **taken (yes)** once per calendar day with date/time; there is **no create-no** path (no row = not taken); further creates that day are blocked until delete | First save is a taken=yes row; second create attempt is rejected/blocked with `log.electrolytes.blocked`; after delete, create succeeds again |
| REQ-08 | User can log mood from dropdown (awful, not great, okay, good, great) with date/time | Saved mood value and timestamp appear on calendar day detail |
| REQ-09 | User can log an event note (textarea) with date/time | Note text and timestamp appear on that day's calendar detail |
| REQ-10 | User can delete any manually logged entry (no edit in v1) | After delete, entry no longer appears on dashboard/calendar/analytics; no edit UI required in v1 |
| REQ-11 | Calendar lets user pick a past day and see **manual logs only** for that day (not Apple Health / CSV / XML imports — imports feed analytics) | Selecting a date shows that day’s manual entries only; imported samples do not appear on calendar |
| REQ-12 | User must import **both** third-party CSVs together (**detailed** + **summary**) in one import operation; map detailed `Metric` values to binding `metric_key`s; store summary day rows | Import succeeds only when both files present and parse; analytics can use imported data; missing either file → blunt error, no partial commit |
| REQ-15 | User can **batch-delete** an import (one upload = one `ImportBatch`): deleting the batch removes all its imported rows | After batch delete, those samples no longer appear in analytics; no per-sample import delete required in v1 |
| REQ-16 | Analytics four tabs; six views. **Medication** — Medication impact chart (single-day date + prev/next; multi-dose → most recent take; untaken meds gray/disabled in dropdown). Imported HR for Charts 1–3 and Lifestyle from **detailed CSV only** (never summary HR aggregates) | Per binding contracts |
| REQ-17 | **Heart Trends** charts 2–3; **Recovery** charts 4–5 (as previously specified) | Per binding contracts |
| REQ-20 | **Lifestyle** tab (v1): With vs Without electrolytes cards from first electrolytes-yes day; Without = not explicitly yes; each card: avg HR (manual HR + detailed **`heart_rate`**), avg resting (detailed **`resting_heart_rate`**), avg BP as **avg sys / avg dia**, avg walking (detailed **`walking_heart_rate_average`**). Imported HR metrics from **detailed CSV only** | Cards match binding contract |
| REQ-18 | Owner account is protected by password (authentication required to access their data) | Unauthenticated access cannot read owner health records; correct password grants access |
| REQ-19 | Exactly two **seeded** accounts (**Laura** + **Demo**); Demo starts **empty** of health data; test account cannot see owner data; **no public self-registration** | Seed creates both; Demo has no logs/imports; no signup route; cross-account reads fail |

## Non-functional requirements

| ID | Requirement | Acceptance signal |
| --- | --- | --- |
| NFR-01 | Personal health data stays private to the account that created it; no clinician portal or social sharing; app access limited to seeded accounts | No clinician/social/signup surfaces; cross-account reads of health data fail in tests |
| NFR-02 | v1 import uses date-ranged third-party CSVs (avoid giant native Apple zip) | No zip/XML import path required in v1; fixtures document expected CSV shapes |
| NFR-03 | No AI diagnosis features | Product surfaces contain no diagnosis or AI-diagnosis capability |
| NFR-05 | v1 deploy treated as private: seeded accounts + strong passwords; URL not published broadly; no extra IdP/allowlist required for Define | Documented in privacy/ops; no public signup |
| NFR-06 | Authenticated **phone-first app shell** matches the approved design brief: bottom nav (Home/Log/Calendar/Analytics/Import), sticky scroll header treatment, page title + subtitle, Sign out control | Shell chrome matches FEAT-001 brief / Figma; nav reaches each primary route; phone viewport primary |

## Open items (Define)
- [x] Exact Apple Health metrics for v1 — **replaced** by third-party summary+detailed CSV contract + fixtures.
- [x] Native Apple zip / XML — **out of scope** for v1 (owner decision).
- [x] Electrolytes same-day rule — once per day; block until deleted.
- [x] Delete for all manual log types — REQ-10.
- [x] Symptom/med catalogs + severity — seeded fixed lists; three-way severity.
- [x] Auth population — two seeded accounts; no public registration.
- [x] Delete imported data — REQ-15 (**batch-delete**).
- [x] Calendar shows manual logs only (imports → analytics) — REQ-11.

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-10 | Drafted goal, MVP, non-goals, journeys; proposed REQ/NFR tables from /define | Define phase |
| 2026-08-10 | Single log screen; detailed field contract; mood; auth + second account; HR as part of BP; renumbered REQs | User clarifications |
| 2026-08-10 | Apple Health metric contract; electrolytes once/day + block; delete all manual logs (REQ-10); renumbered import/analytics/auth REQs | User clarifications |
| 2026-08-10 | Timezone America/New_York; delete-only logs; import skip duplicates; symptom/med dropdown catalogs | Data model Define |
| 2026-08-10 | Import path: third-party summary+detailed CSV only; no native Apple zip/XML; fixtures under fixtures/import/ | Grill-me |
| 2026-08-10 | Status → `approved` | Build gate opened after Define + grill-me |
| 2026-08-10 | Charts 1–2 HR series: detailed `heart_rate` + manual (not resting) | Grill-me |
| 2026-08-10 | Chart 3 / Lifestyle HR import key | Use detailed `heart_rate` (not heart_rate_avg) | Grill-me |
| 2026-08-10 | Seeded catalogs + severity labels; seeded-only auth; delete imports (REQ-15); renumber analytics/auth; NFR-04 | User clarifications |
| 2026-08-10 | BP never imported — manual only; no BP posture field | Grill-me Q1–Q2 |
| 2026-08-10 | Med chart: med + HR/BP; X −2h…+2h; Y systolic/HR; ≤1 dose; nearest BP-log within ±15m else blank | Grill-me Q3–Q5 |
| 2026-08-10 | Dashboard six-field today summary; import batch-delete; med chart date picker | Grill-me Q6–Q8 |
| 2026-08-12 | Symptom severity UI label Usual → **Normal amount**; matches Log Figma | Owner Frame 2 |
| 2026-08-13 | REQ-07: electrolytes create **yes only** (absence = no); blocked copy shortened to Figma string | Owner Log Figma |
| 2026-08-11 | NFR-06 phone-first app shell chrome (design-brief fidelity) | FEAT-003 shell polish — **approved** with FEAT-003 |
| 2026-08-14 | Analytics chips: Medication / Cardiovascular / Recovery / Electrolytes | Owner + Figma |
| 2026-08-14 | Chart 2 UI range labels Today / Last 7 Days / Last 30 Days; Chart 3 Figma + disclaimer; threshold locked ≥ 100 | Owner Cardiovascular Figma |
| 2026-08-14 | Chart 4 HRV Figma: range labels + “What your HRV shows” callout | Owner Figma 62957:4735 |
| 2026-08-14 | Chart 5 walking HR: Last 7 / Last 30 only (no Today) | Owner Figma 62959:4803 |
| 2026-08-15 | Electrolytes comparison UI: With/Without cards + Avg HR/Resting/Walking/BP | Owner Figma 62967:5991 |
