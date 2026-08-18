---
project: "Chronic Yet Iconic V2"
type: copy-deck
status: design-contract
updated: 2026-08-15
---
# Copy Deck — canonical user-facing strings

[[40-voice-and-tone|← Voice and tone]]

> [!important] This document is a design contract
> Every user-facing string in the product traces to a key here. Code
> references strings by key (constants file, i18n table, or equivalent named
> in Platform doc). To change copy: edit the value here in Obsidian, then
> tell Claude (or run /iterate) to propagate. /sync-docs audits drift both
> directions. Claude adds rows when features introduce new strings.

**Key convention:** `area.surface.slug` (e.g. `auth.login.error_generic`,
`cli.help.description`, `export.empty_state.body`).

| Key | String | Context / constraints |
| --- | --- | --- |
| app.name | Chronic Yet Iconic | User-facing product name (UI, login wordmark) |
| app.name.internal | Chronic Yet Iconic V2 | Repo / docs / internal only — not shown in UI |
| app.tagline | Make sense of your health trends | ≤ 8 words |
| common.error_generic | Couldn’t finish that. Try again. | Blunt; never blames user |
| common.empty_state | Nothing here yet. Log a reading or import Health data. | Why empty + first action |
| auth.login.title | Sign In | Optional page title if used; login frame uses wordmark |
| auth.login.submit | Sign In | Matches Figma CTA |
| auth.login.error_invalid | Username or password is wrong. | Blunt; below Sign In button (Figma error frame) |
| auth.field.username | Username | Outlined field label |
| auth.field.password | Password | Outlined field label |
| auth.logout | Sign out | |
| nav.home | Home | Bottom nav label for the Dashboard route (short) |
| nav.log | Log | |
| nav.calendar | Calendar | |
| nav.analytics | Analytics | |
| nav.import | Import | |
| shell.eyebrow | Chronic Yet Iconic | Header eyebrow on all signed-in pages (uppercase in UI) |
| shell.title.dashboard | Dashboard | Page title for Home/Dashboard route |
| shell.title.log | Log | |
| shell.title.calendar | Calendar | |
| shell.title.analytics | Analytics | |
| shell.title.import | Import | |
| shell.placeholder.body | This section is next. | Placeholder routes until their FEATs |
| shell.subtitle.dashboard | Take a look around! | Locked from Home Figma header |
| shell.subtitle.log | Track symptoms, vitals, medications, water, mood and other daily events. | Log header subtitle — locked from Figma Frame 1 |
| shell.subtitle.calendar | Select a day to review everything you logged. | Locked from Calendar Figma |
| calendar.empty_day | _(unused)_ | Empty = heading + `0 logged entries` only (Figma 62910-6163); no separate empty blurb |
| calendar.day_heading | {weekday} · {Month} {D}, {YYYY} | Locked pattern e.g. Thursday · August 6, 2026 |
| calendar.day_heading_today | Today | When selected day is today (Figma) |
| shell.subtitle.analytics | Compare how different factors impact your health over time. | Locked from Analytics Figma 62816-27151 |
| analytics.tab.medication | Medication | Analytics chip |
| analytics.tab.cardiovascular | Cardiovascular | Analytics chip |
| analytics.tab.recovery | Recovery | Analytics chip |
| analytics.tab.electrolytes | Electrolytes | Analytics chip |
| analytics.med.title | Medication Impact | Figma 62816-27152 |
| analytics.med.helper | See how your vitals change before and after taking a medication. | Figma |
| analytics.med.compare | Compare | Figma |
| analytics.med.with | with | Figma |
| analytics.med.select_empty | Medication | Compare dropdown when no med logged that day |
| analytics.med.metric.hr | Heart Rate | Metric dropdown |
| analytics.med.metric.bp | BP | Metric dropdown |
| analytics.med.prev_day | Previous day | a11y |
| analytics.med.next_day | Next day | a11y |
| analytics.med.date_format | MM/DD/YYYY | Display pattern |
| analytics.cardio.chart2.title | Blood Pressure and Heart Rate | Figma 62953-4603 |
| analytics.cardio.chart2.helper | See how changes in one may relate to changes in the other. | Figma 62953-4603 |
| analytics.range.today | Today | Chart range segmented control |
| analytics.range.last_7 | Last 7 Days | Figma (not “Past 7 days”) |
| analytics.range.last_30 | Last 30 Days | Figma |
| analytics.cardio.chart3.title | Tachycardia Burden | Figma 62953-4604 |
| analytics.cardio.chart3.helper | Percent of heart rate readings ≥ 100 bpm | Owner lock ≥100 (overrides Figma `>`) |
| analytics.cardio.chart3.disclaimer_title | Data Disclaimer | Figma 62953-4604 |
| analytics.cardio.chart3.disclaimer_body | This chart is not a complete measure of tachycardia burden. Your Apple Watch does not provide continuous heart rate monitoring, and might not be worn at all times. Because of this, total time spent in tachycardia cannot be calculated.\n\nInstead, this chart shows the percentage of heart rate readings that were at or above the 100 bpm threshold. | ≥100 lock |
| analytics.recovery.hrv.title | Heart Rate Variability | Figma 62957-4735 |
| analytics.recovery.hrv.helper | HRV measures the changes in time between your heartbeats. | Figma 62957-4735 |
| analytics.recovery.hrv.info_title | What your HRV shows | Figma info callout |
| analytics.recovery.hrv.info_intro | Your autonomic nervous system controls HRV through two competing parts: | Figma |
| analytics.recovery.hrv.info_sympathetic | Sympathetic system: The "fight-or-flight" response that speeds up your heart during stress or action. | Bold label in UI |
| analytics.recovery.hrv.info_parasympathetic | Parasympathetic system: The "rest-and-digest" response that slows down your heart and creates variation between beats. | Bold label in UI |
| analytics.recovery.hrv.info_footer | What does this mean for someone with POTs? No clue. But when I figure it out I’ll have this chart to reference. | Figma spelling POTs |
| analytics.recovery.walking.title | Average Walking Heart Rate | Figma 62959-4803 |
| analytics.recovery.walking.helper | Walks outside can be very challenging. This chart will show what your average heart rate is during these walks. | Figma 62959-4803 |
| analytics.electrolytes.title | Electrolytes | Figma 62967-5991 |
| analytics.electrolytes.helper | See how days with electrolytes compare to days without. | Figma |
| analytics.electrolytes.with_title | With Electrolytes | Figma card |
| analytics.electrolytes.with_helper | Averages based on days you logged electrolytes | Figma |
| analytics.electrolytes.without_title | Without Electrolytes | Figma card |
| analytics.electrolytes.without_helper | Averages based on days you didn’t log electrolytes | Figma |
| analytics.electrolytes.metric.avg_hr | Avg HR | Figma metric label |
| analytics.electrolytes.metric.avg_resting | Avg Resting | Figma |
| analytics.electrolytes.metric.avg_walking | Avg Walking | Figma |
| analytics.electrolytes.metric.avg_bp | Avg BP | Figma |
| analytics.electrolytes.unit.bpm | bpm | Unit suffix for HR metrics |
| analytics.electrolytes.empty | Log electrolytes to unlock this comparison. | Empty state when no electrolytes-yes day |
| shell.subtitle.import | Upload Apple Health export files to populate your health database. | Locked from Import Figma 62939-4277 |
| dashboard.empty | No stats for today yet. Add a log or import data. | Unused on Figma Home (zeros on cards); keep until confirmed drop |
| dashboard.metric.bp_count | BP Readings | Home Figma |
| dashboard.metric.bp_count_helper | Manual BP entries | Home Figma |
| dashboard.metric.bp_latest | Latest BP | Home Figma |
| dashboard.metric.bp_latest_helper | Most recent BP | Home Figma |
| dashboard.metric.bp_latest_empty | — | Prefer show placeholder value or empty; confirm vs Figma empty state |
| dashboard.metric.bp_latest_value | {sys}/{dia} | Home Figma pattern |
| dashboard.metric.meds_count | Meds taken today | Home Figma |
| dashboard.metric.meds_helper | Logged medication | Home Figma |
| dashboard.metric.water_total | Total Water | Home Figma |
| dashboard.metric.water_helper | Amount of water drank today | Home Figma |
| dashboard.metric.water_value | {oz}oz | Home Figma (no space before oz) |
| dashboard.metric.electrolytes_taken | Taken | Badge label on water card (Figma) |
| dashboard.metric.symptoms_count | Symptom logs | Home Figma |
| dashboard.metric.symptoms_helper | Manual symptom entries | Home Figma |
| dashboard.metric.health_records | Health records | Deferred — Figma card **hidden in v1** (FEAT-005) |
| dashboard.metric.health_records_helper | Records imported from Apple Health today | Deferred with health_records card |
| dashboard.metric.count_value | {count} | Shared count display |
| dashboard.electrolytes.not_logged | Not logged | Superseded by Taken + X icon on Figma; keep until cleanup |
| log.save_success | Saved. | Quiet confirmation |
| log.delete_confirm | Delete this entry? It can’t be undone. | Reserved / unused if inline confirm ships; was dialog copy |
| log.electrolytes.blocked | Electrolytes already logged for today. | Locked from Figma blocked state |
| log.action.log_symptom | Log Symptom | Create CTA — Symptom form (Figma) |
| log.action.log_blood_pressure | Log Blood Pressure | Create CTA — BP form (Figma) |
| log.action.log_medication | Log Medication | Create CTA — Medication form (Figma) |
| log.action.log_water | Log Water | Create CTA — Water form (Figma) |
| log.action.log_mood | Log Mood | Create CTA — Mood form (Figma) |
| log.action.log_event | Log Event | Create CTA — Event form (Figma) |
| log.action.log_electrolyte | Log Electrolytes | Create CTA — Electrolytes available state (Figma) |
| log.action.delete | Delete entry | Legacy confirm-dialog label; v1 uses inline entry controls |
| log.entry.delete | Delete | Entry card default state (zinc-500) |
| log.entry.confirm_delete | Confirm Delete | Entry card armed state; color **brand7** `#d95c1c` |
| log.today_heading | Today | Entries list heading on Log — locked from Figma Frame 1 |
| log.entries_count | {count} logged entries | Today list subtitle; `{count}` = integer (incl. 0) |
| log.water_total_label | Today’s Total | Water form day-sum label (Figma) |
| log.water_total_value | {oz} oz | Water form day-sum value; `{oz}` = daily sum |
| log.water_reset | Reset total | Figma-only; **hidden / out of scope for v1** |
| log.type.symptom | Symptom | Type picker |
| log.type.blood_pressure | Blood Pressure | Figma Log chips 62898:1748 |
| log.type.medication | Medication | |
| log.type.water | Water | |
| log.type.electrolyte | Electrolytes | |
| log.type.mood | Mood | |
| log.type.event | Event | |
| log.field.date_time | Date & Time | Locked from Figma Log form |
| log.field.systolic | Systolic | mmHg |
| log.field.diastolic | Diastolic | mmHg |
| log.field.heart_rate | HR (bpm) | Short label on BP form (Figma); accessible name should still convey heart rate |
| log.field.notes | Notes (optional) | Locked from Figma Symptom form |
| log.field.notes_placeholder | Anything else to note... | Notes field placeholder |
| log.field.dose | Dose | Free text |
| log.field.amount_oz | Add Ounces | Numeric oz input on Water form (Figma) |
| log.field.amount_oz_placeholder | e.g. 32 | Water Add Ounces placeholder — locked |
| log.field.taken | Taken | Electrolytes status chip; create always means taken = yes |
| log.field.note | Note | Event body — **textarea** (multi-line); Figma single-line is a stand-in |
| log.field.note_placeholder | e.g. Walked 10 miles | Event Note placeholder (Figma) |
| log.field.symptom_name | Symptom | Catalog dropdown |
| log.field.medication_name | Medication | Catalog dropdown |
| log.field.severity | Severity | |
| log.field.mood | Mood | |
| log.severity.usual | Normal amount | Storage key still `usual`; UI label locked from Figma |
| log.severity.worse_than_usual | Worse than usual | |
| log.severity.better_than_usual | Better than usual | |
| log.mood.awful | Awful | |
| log.mood.not_great | Not great | |
| log.mood.okay | Okay | |
| log.mood.good | Good | |
| log.mood.great | Great | |
| log.electrolyte.yes | Yes | Stored value when an electrolytes row exists |
| log.electrolyte.no | No | Implied by **no row** for that day — not a create option in v1 |
| import.success | Import finished — {count} new samples. | `{count}` = integer |
| import.duplicate_skipped | Skipped {count} duplicates. | |
| import.pair_required | Upload both the summary and detailed CSV files. | Guidance (upload card uses Figma instructions) |
| import.error_missing_pair | Need both summary and detailed CSV files. | Locked under Start import (Figma) |
| import.delete_confirm | _(superseded)_ | Use `import.entry.confirm_delete` |
| import.upload.title | Upload Files | Locked Import Figma |
| import.upload.instructions | On your iphone goto My Health Export App → Select your date range → fetch data and export both summary and detailed. | Locked Figma casing |
| import.field.summary | Summary CSV | Locked |
| import.field.detailed | Detailed CSV | Locked |
| import.choose_file | Choose File | Locked |
| import.no_file_selected | No file selected | Locked |
| import.start | Start import | Locked |
| import.history.title | Import History | Locked |
| import.database_summary.title | Database Summary | Locked |
| import.database_summary.count | {count} health records stored. | `{count}` emphasized in UI |
| import.status.completed | Completed | Badge |
| import.status.processing | Processing | Badge |
| import.status.failed | Failed | Badge |
| import.batch.meta | {count} Records · {datetime} | Locked pattern |
| import.entry.delete | Delete | Default (gray) |
| import.entry.confirm_delete | Delete this import? | Armed (brand7); supersedes longer delete_confirm |

## Placeholders & formatting rules
- Variables use `{name}` (e.g. `{count}`).
- Buttons: title/sentence case per key (“Sign In”, “Delete entry”).
- No emoji in product strings unless explicitly added later.
- Severity UI labels: `log.severity.*` (Normal amount / Worse than usual / Better than usual).
- Create CTAs are type-specific (e.g. `log.action.log_symptom`); additional `log.action.log_*` keys land as each form frame is reviewed.
- Mood UI labels: `log.mood.*` (Awful / Not great / Okay / Good / Great).
