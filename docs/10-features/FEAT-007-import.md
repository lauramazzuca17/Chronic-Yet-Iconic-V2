---
id: FEAT-007
type: prd
status: done
implements: [REQ-12, REQ-15, NFR-01, NFR-02, NFR-06]
depends_on: [FEAT-001, FEAT-002, FEAT-003]
tests: [tests/feat-007-import.test.ts, e2e/feat-007-import-journey.spec.ts]
created: 2026-08-13
updated: 2026-08-14
---
# FEAT-007 — Import (third-party CSV pair)

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|REQ-12]], [[01-requirements|REQ-15]], [[01-requirements|NFR-01]], [[01-requirements|NFR-02]], [[01-requirements|NFR-06]] · Depends: [[FEAT-001-auth-shell]], [[FEAT-002-signin-ui-cookies]], [[FEAT-003-shell-polish]]

## Problem / user story
As a signed-in user, I want to upload **both** third-party Apple Health CSVs (summary + detailed) in one operation so analytics later has my heart-rate and related samples — and I want to **batch-delete** a whole upload if I imported the wrong range.

## Acceptance criteria
- [x] AC-1: Import succeeds only when **both** summary and detailed CSVs are provided and headers match the expected shapes; missing either or bad headers → blunt error (`import.error_missing_pair` / parse error) and **no partial commit** (REQ-12, NFR-02).
- [x] AC-2: Valid fixture pair ingest maps detailed `Metric` → binding `metric_key`s; stores samples with America/New_York `recorded_at` from `Timestamp` (REQ-12).
- [x] AC-3: Summary day rows are stored (non-BP columns) as account-scoped samples/day aggregates for later analytics (REQ-12). **Never** import blood pressure (ignore BP columns if present).
- [x] AC-4: Re-import of the same samples **skips duplicates** by `(account_id, metric_key, recorded_at, value)`; success copy reports new + skipped counts (REQ-12 / data model).
- [x] AC-5: Import batches and samples are **account-scoped** — Demo cannot read or delete Laura’s imports (NFR-01).
- [x] AC-6: User can **batch-delete** one upload (`ImportBatch`); all samples from that batch are removed (REQ-15).
- [x] AC-7: `/import` UI matches Figma: Upload Files card (two pickers + Start import), Import History card (Database Summary + batch list with Completed / Processing / Failed + Delete → confirm), shell title/subtitle; sticky header OnScroll like Calendar (REQ-12, REQ-15, NFR-06).
- [x] AC-8: Playwright: Laura uploads fixture pair → sees success / history → batch-deletes → samples gone.

## Out of scope
- Native Apple Health **`.zip`** / **XML** import (v1). Figma filename “Export.xml” is illustrative only — product accepts **CSV** pair.
- Analytics charts / Lifestyle cards (FEAT for REQ-16/17/20).
- Per-sample delete of imported rows.
- Showing imports on Calendar or Home metric cards.
- Editing imported values.

## Assumptions (approved / locked)
1. **One upload = one `ImportBatch`** (pair). Both filenames stored; **history row displays the detailed CSV filename**.
2. Fixtures under `fixtures/import/` are the binding CSV shapes for tests.
3. Phone-first `/import`; visual lock via Figma frame + [[FEAT-007-brief]].
4. **Scroll:** main content scrolls behind sticky header; header uses existing OnScroll treatment (`#0B4041` @ 80%) — same as Calendar / shell.
5. **Batch row states** from Figma: **Completed**, **Processing**, **Failed**; delete is inline two-step: **Delete** → **Delete this import?** (armed, brand7).
6. **Database Summary** = total imported sample/record count for the signed-in account.
7. **Summary ingest:** persist **all non-BP** summary columns from the fixture/export shape (not only chart-needed columns).
8. **Processing** = **in-flight only** while the import request runs; then flip to **Completed** or **Failed** (not a durable queued status).

## Figma (binding visual references)
| State | Frame |
| --- | --- |
| Import page (upload + history + record states) | [62939-4277](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62939-4277) |

Composition (owner):
1. **Upload Files** card — instructions; **Summary CSV** + **Detailed CSV** pickers; **Start import**; error under button for reference.
2. **Import History** card — green **Database Summary** spotlight (`{count} health records stored.`); list of uploads.
3. Record styles: Completed (armed delete), Processing (default Delete), Failed (default Delete).

## UX copy (locked from Figma)
| Key | String | Status |
| --- | --- | --- |
| shell.title.import | Import | locked |
| shell.subtitle.import | Upload Apple Health export files to populate your health database. | locked Figma |
| import.upload.title | Upload Files | locked |
| import.upload.instructions | On your iphone goto My Health Export App → Select your date range → fetch data and export both summary and detailed. | locked Figma (keep Figma casing) |
| import.field.summary | Summary CSV | locked |
| import.field.detailed | Detailed CSV | locked |
| import.choose_file | Choose File | locked |
| import.no_file_selected | No file selected | locked |
| import.start | Start import | locked |
| import.error_missing_pair | Need both summary and detailed CSV files. | locked (shown under Start import) |
| import.history.title | Import History | locked |
| import.database_summary.title | Database Summary | locked |
| import.database_summary.count | {count} health records stored. | locked (`{count}` bold in UI) |
| import.status.completed | Completed | locked badge |
| import.status.processing | Processing | locked badge |
| import.status.failed | Failed | locked badge |
| import.batch.meta | {count} Records · {datetime} | locked pattern |
| import.entry.delete | Delete | locked (default) |
| import.entry.confirm_delete | Delete this import? | locked (armed; replaces longer deck draft) |
| import.success / import.duplicate_skipped | (existing deck) | keep for post-import feedback if not on frame |

## Technical notes
- Domain: in-memory `ImportBatch` + `ImportedSample` store (Turso later); account-scoped.
- Parse detailed + summary per [[01-requirements]] / [[03-data-model]]; skip BP columns.
- Dedupe UNIQUE key on ingest (skip, don’t fail whole batch).
- Route: existing `/import` under `(shell)`.
- UI: two cards; reuse shell sticky OnScroll (already global in `ShellChrome`).
- Design brief: [[FEAT-007-brief]].

## Open questions
- none

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-13 | Draft PRD for Import (REQ-12, REQ-15) | /new-feature |
| 2026-08-13 | Locked Figma 62939-4277 layout, copy, batch states, scroll-behind-header | Owner |
| 2026-08-13 | Locked: all non-BP summary columns; Processing = in-flight only; history shows detailed CSV filename | Owner |
| 2026-08-13 | **PRD approved** — ready for `/tdd-cycle` | Owner |
| 2026-08-13 | AC-1 green — pair required; no partial commit (`src/import/store`) | /tdd-cycle |
| 2026-08-13 | AC-2 green — detailed Metric → metric_key + NY recorded_at | /tdd-cycle |
| 2026-08-14 | AC-3 green — summary day rows (`summary_*` keys); BP columns skipped | /tdd-cycle |
| 2026-08-14 | AC-4 green — dedupe on re-import; inserted/skipped counts | /tdd-cycle |
| 2026-08-14 | AC-5 green — Demo cannot read/delete Laura import batches | /tdd-cycle |
| 2026-08-14 | AC-6 green — owner batch-delete removes batch + samples (reuse deleteImportBatch) | /tdd-cycle |
| 2026-08-14 | AC-7 green — Import UI Upload Files + History (Figma 62939-4277) | /tdd-cycle |
| 2026-08-14 | AC-8 green — Playwright upload + batch-delete; feature **done** | /tdd-cycle |
