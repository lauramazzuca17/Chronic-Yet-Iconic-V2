# Design brief — FEAT-007 Import (third-party CSV pair)

Paste-ready for design review. Standalone — no repo paths required.

**Updated:** 2026-08-18

**Figma file:** CYI — V2 (`WkhupgI4GcrvhLPqJV4T7d`)

Binding frame:
1. Import page (upload + history + record states) — node `62939:4277`

---

## Product summary

**Chronic Yet Iconic** (user-facing name) is a personal health tracker for someone living with POTS. Do not show “V2” in the UI.

**FEAT-007 — Import:** Authenticated `/import` where the user uploads **both** summary and detailed third-party Health CSVs in one operation, sees a database summary count, and can batch-delete past uploads. Native Apple zip/XML are out of scope (Figma may show `Export.xml` as a placeholder filename only).

---

## Audience and tone

Calm, grounded, curious, direct. Blunt errors. Destructive confirm is direct (“Delete this import?”). No clinician/social/AI-diagnosis chrome.

---

## Screens / flows

**Phone viewport only.** Max content ~430px.

### Shell (reuse — same as Calendar)
- Lilypad / pond atmosphere background.
- Header: eyebrow **Chronic Yet Iconic**; Sign out; title **Import**; subtitle **Upload Apple Health export files to populate your health database.**
- Content scrolls **behind** sticky header; OnScroll → `#0B4041` @ **80%** opacity (identical to Calendar).
- Bottom nav: Home, Log, Calendar, Analytics, **Import** (active).

### A. Upload Files card
1. Title **Upload Files**
2. Instructions (Figma): how to export from My Health Export App (summary + detailed).
3. Two columns: **Summary CSV** / **Detailed CSV** — **Choose File** + **No file selected** (or filename when chosen).
4. Full-width orange **Start import**
5. Error under button (reference): **Need both summary and detailed CSV files.**

### B. Import History card
1. Title **Import History**
2. Green spotlight **Database Summary** — `{count} health records stored.` (count emphasized).
3. List of import batches:
   - Meta: `{count} Records · {datetime}`
   - Filename line = **detailed CSV** original filename
   - Status badge: **Completed** (green) / **Processing** (amber, in-flight only) / **Failed** (coral)
   - Delete: default **Delete** (gray) → armed **Delete this import?** (brand7 `#d95c1c`)

**Data locks:** store all non-BP summary columns; Processing is not a durable queue state.

## As built — visual (`62946:4425`, 2026-08-17)

Tokens live in `src/import/layout.ts`.

| Property | Value |
| --- | --- |
| Main | px 16 / pb 16 / gap 10 |
| Upload card | white, radius **8**, pad 18/16, inner gap 16 |
| Titles | 20/28 semibold `#1d1b20` |
| Instructions / idle filename | 12/18 `#71717b` |
| File pickers | two columns, gap **28**; Choose File 28px visual (4px pad), `#d1d1d6` stroke, 44px tap via `::after`; chosen filenames ellipsis-truncate in-column (`title` = full name) |
| Start import | brand6 `#f08429`, 34px visual, 14/18 semibold white, 44px tap |
| History card | white, radius **12**, pt 10 / px 16 / pb 18, gap 8 |
| Database Summary | sage `#f2f5ed`, radius 8, pad 18/16; file-waveform **18×24** in 22×30; title 18/22 medium brand4; count 14/18 with **bold** number |
| Batch row | 68px; badge overlaps top-right; card offset 10px; border `#d1d5dc`; Delete gray → armed brand7 |

## Copy keys (locked)

---

## Copy keys (locked)

| Key | String |
| --- | --- |
| shell.title.import | Import |
| shell.subtitle.import | Upload Apple Health export files to populate your health database. |
| import.upload.title | Upload Files |
| import.upload.instructions | On your iphone goto My Health Export App → Select your date range → fetch data and export both summary and detailed. |
| import.field.summary / detailed | Summary CSV / Detailed CSV |
| import.choose_file | Choose File |
| import.no_file_selected | No file selected |
| import.start | Start import |
| import.error_missing_pair | Need both summary and detailed CSV files. |
| import.history.title | Import History |
| import.database_summary.title | Database Summary |
| import.database_summary.count | {count} health records stored. |
| import.status.* | Completed / Processing / Failed |
| import.entry.delete / confirm_delete | Delete / Delete this import? |

---

## Out of scope for this brief
Analytics charts, Calendar imports, zip/XML ingest, per-sample delete, desktop shell.
