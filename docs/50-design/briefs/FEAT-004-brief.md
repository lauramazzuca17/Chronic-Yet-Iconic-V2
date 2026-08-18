# Design brief — FEAT-004 Manual logging (Log UI)

Paste-ready for Claude Design (or any design tool). Standalone — no repo paths required.

**Updated:** 2026-08-12

---

## Product summary

**Chronic Yet Iconic** (user-facing name) is a personal health tracker for someone living with POTS. Internal project name may include “V2”; **do not show “V2” in the UI.**

**Tagline:** Make sense of your health trends.

**FEAT-004 — Log screen:** One phone-first surface where a signed-in user creates and deletes all MVP manual log types: symptom, blood pressure, medication, water, electrolytes, mood, and event. Create + delete only (no edit). Blood pressure is manual-only and must **never** include a posture field (lying / sitting / standing).

This sits inside the existing authenticated app shell (header + bottom nav). Do not redesign login or the global shell chrome except as needed to show Log content correctly under the sticky header and above the bottom nav.

---

## Audience and tone

**Primary user:** Owner (Laura) logging on a phone, often at appointments or between daily readings.

**Tone:** Calm, grounded, curious, direct. Address **you**. Quiet success (“Saved.”). Errors blunt and informative — say what failed and what to do next; never blame the user. Destructive deletes are direct, not theatrical. No clinician portal, social, cheerleading, or AI-diagnosis visuals.

---

## Screens / flows to design

Design for **phone viewport only** (same constraint as the existing shell). Max content column ~430px centered if shown on a wider canvas — not a desktop layout.

### Shell context (already locked — reuse)
- Lilypad / pond atmosphere background on authenticated pages.
- Header: uppercase eyebrow **Chronic Yet Iconic**; orange icon Sign out; page title **Log**; subtitle **Track symptoms, vitals, medications, water, mood and other daily events.**
- Sticky header becomes `#0B4041` at 80% opacity when content scrolls under it.
- Bottom nav: Home, Log, Calendar, Analytics, Import; bar `#0B4041` @ 80%; active Log icon in pill `#082E33` @ 80% (~16px radius), label below pill.

### A. Log — type picker (idle / empty today)
Single screen that can start any of the seven types. Show a clear type chooser (chips, segmented control, or list — prefer thumb-friendly, not tiny tabs). When today has no entries, show an empty list under **Today** with calm empty guidance (reuse product empty spirit: nothing here yet → log a reading).

### B. Log — create form (per type)
After choosing a type, show fields for that type + shared **Date & Time** (defaults to now; user can change). Primary CTA is **type-specific** (e.g. **Log Symptom**). States: default, validation error, submitting (disabled + reduced opacity on CTA), success (quiet **Saved.** then return to list / reset for another entry).

**Blood pressure** — One row: Systolic | Diastolic | thin orange divider | **HR (bpm)**; second row: Date & Time; CTA **Log Blood Pressure**. **Do not** add posture.

**Symptom** — Symptom (dropdown from fixed catalog), Severity (Normal amount / Worse than usual / Better than usual), Date & Time, Notes (optional) with placeholder “Anything else to note...”. CTA: **Log Symptom**.

**Medication** — Row 1: **Medication** (catalog dropdown, flex) + **Dose** (narrow free text, e.g. `10 mg`); Row 2: **Date & Time**; CTA **Log Medication**.

**Water** — Row 1: read-only **Today’s Total** (`{oz} oz`) + numeric **Add Ounces** (placeholder **e.g. 32**); Row 2: **Date & Time**; CTA **Log Water**. (**Reset total** in Figma — **hide for v1**.)

**Electrolytes** — Figma: **Taken** chip + **Date & Time** (no Yes/No picker). Create always = taken yes; no row = not taken. Available: **Log Electrolytes**. Blocked: muted datetime, message **Electrolytes already logged for today.**

**Mood** — **Mood** dropdown (Awful / Not great / Okay / Good / Great); **Date & Time**; CTA **Log Mood**.

**Event** — **Note** multi-line **textarea** (placeholder **e.g. Walked 10 miles**; Figma shows single-line stand-in); **Date & Time**; CTA **Log Event**.

### C. Log — today’s entries list
Heading **Today**. List today’s logs with enough summary to identify type + key values + time. Each row supports delete (not edit). Empty state when none.

### D. Delete confirm (inline on entry card)
No modal for v1. Entry card: tap **Delete** → label becomes **Confirm Delete** in brand7 `#d95c1c`; second tap deletes the entry. Cancel by leaving the armed state (e.g. tap elsewhere / another control — confirm if wrong).

### Catalog values (dropdown options — use exactly)
**Symptoms:** Fatigue, Dizzy, Lightheaded, Nauseous, Syncope, Joint Pain, Joint Stiffness  

**Medications:** Midodrine, Propranolol, Claritin, Adderall XR, Magnesium Glycinate, Gabapentin, Celecoxib, Metoclopramide, Tirzepatide, Vitamin D

---

## Real copy strings (use these — no lorem ipsum)

| Key | String |
| --- | --- |
| shell.eyebrow | Chronic Yet Iconic |
| shell.title.log | Log |
| shell.subtitle.log | Track symptoms, vitals, medications, water, mood and other daily events. |
| auth.logout | Sign out (accessible name; icon-only control) |
| nav.home | Home |
| nav.log | Log |
| nav.calendar | Calendar |
| nav.analytics | Analytics |
| nav.import | Import |
| log.action.log_symptom | Log Symptom |
| log.action.log_blood_pressure | Log Blood Pressure |
| log.action.log_medication | Log Medication |
| log.action.log_water | Log Water |
| log.action.log_mood | Log Mood |
| log.action.log_event | Log Event |
| log.action.log_electrolyte | Log Electrolytes |
| log.entry.delete | Delete |
| log.entry.confirm_delete | Confirm Delete |
| log.save_success | Saved. |
| log.delete_confirm | Delete this entry? It can’t be undone. |
| log.electrolytes.blocked | Electrolytes already logged for today. |
| log.today_heading | Today |
| log.entries_count | {count} logged entries |
| log.water_total_label | Today’s Total |
| log.water_total_value | {oz} oz |
| log.water_reset | Reset total |
| log.type.symptom | Symptom |
| log.type.blood_pressure | Blood Pressure |
| log.type.medication | Medication |
| log.type.water | Water |
| log.type.electrolyte | Electrolytes |
| log.type.mood | Mood |
| log.type.event | Event |
| log.field.date_time | Date & Time |
| log.field.systolic | Systolic |
| log.field.diastolic | Diastolic |
| log.field.heart_rate | HR (bpm) |
| log.field.notes | Notes (optional) |
| log.field.notes_placeholder | Anything else to note... |
| log.field.dose | Dose |
| log.field.amount_oz | Add Ounces |
| log.field.amount_oz_placeholder | e.g. 32 |
| log.field.taken | Taken |
| log.field.note | Note |
| log.field.note_placeholder | e.g. Walked 10 miles |
| log.field.symptom_name | Symptom |
| log.field.medication_name | Medication |
| log.field.severity | Severity |
| log.field.mood | Mood |
| log.severity.usual | Normal amount |
| log.severity.worse_than_usual | Worse than usual |
| log.severity.better_than_usual | Better than usual |
| log.mood.awful | Awful |
| log.mood.not_great | Not great |
| log.mood.okay | Okay |
| log.mood.good | Good |
| log.mood.great | Great |
| log.electrolyte.yes | Yes |
| log.electrolyte.no | No |
| common.error_generic | Couldn’t finish that. Try again. |
| common.empty_state | Nothing here yet. Log a reading or import Health data. |

---

## Design-system constraints

- **Aesthetic:** Calm personal health notebook; Material Design 3 language (MUI later). Clear hierarchy and readable density — not marketing, not clinical AI.
- **Shell tokens already in product:** bottom nav / scrolled header `#0B4041` @ 80%; active nav pill `#082E33` @ 80%; Sign out / accent orange `#f08429`. Prefer aligning Log CTAs and focus with that system rather than introducing a new palette.
- **Lilypad atmosphere** continues behind shell content; Log body should remain readable (contrast on pond).
- **No cards in the hero sense** — the shell is already the frame. Use structure for interaction (forms, list rows, confirm dialog), not decorative card stacks.
- **Phone-first only** — no dedicated wide/desktop Log layout.
- Prefer one vertical composition: type → form → today’s list, scrollable under sticky header / above sticky nav.
- Motion: subtle; respect `prefers-reduced-motion`.

---

## Accessibility requirements

- WCAG AA contrast; visible focus; full keyboard order through type picker → fields → type CTA → list → delete.
- Touch targets ≥ 44px.
- Visible labels on all fields (not placeholder-only).
- Delete: announce state change Delete → Confirm Delete; second activation must be clear as destructive.
- Electrolytes blocked message must be announced / associated with the control, not color-only.
- Dropdowns (catalog, severity, mood) must expose accessible names matching the copy strings.

---

## What “done” looks like (acceptance → design coverage)

| Criterion | Design must show |
| --- | --- |
| AC-1 | One Log screen; all seven types reachable without leaving Log |
| AC-2 | BP form: systolic, diastolic, HR, date/time; **no posture** |
| AC-3 | Symptom: catalog dropdown, three severities, date/time, optional notes |
| AC-4 | Medication: catalog dropdown, dose, date/time |
| AC-5 | Water amount + visible **Water today: {oz} oz** reflecting daily sum |
| AC-6 | Electrolytes taken=yes once/day; blocked state with Figma short string |
| AC-7 | Mood five options + date/time |
| AC-8 | Event textarea note + date/time |
| AC-9 | Today’s list + inline Delete → Confirm Delete; no edit affordance |
| AC-10 | N/A visually (account isolation) — do not invent shared/multi-user UI |
| AC-11 | Dropdown options limited to the catalogs above (no free-text name field) |
| AC-12 | Journey frames: create water → see entry + total → delete → empty/gone |

**Out of scope for this brief:** Dashboard stats, Calendar day picker, Import, Analytics, editing entries, adding custom symptom/med names, desktop shell.

---

## Frames suggested for handoff

1. Log — empty today + type picker  
2. Log — Blood pressure form (default)  
3. Log — Symptom form  
4. Log — Water form with daily total + one entry in list  
5. Log — Electrolytes blocked  
6. Log — populated today’s list  
7. Delete confirm overlay  

Optional: Medication, Mood, Event forms if they share the same pattern as Symptom (then one representative “dropdown + fields” frame may suffice with notes).

---

## Tip for Claude Design

Point the design tool at this product’s existing shell / login Figma and any tokens file so Log UI matches the real phone chrome (pond background, header, bottom nav, orange accent) instead of inventing a new visual system.

---

## Frame walkthrough — locked notes

### Frame 1 — Log empty today + type picker
**Figma:** `iPhone 13 & 14 - Log - Empty Today` (node `62805:700`)  
**Reviewed:** 2026-08-12 with owner

**Structure (reuse shell; focus Log main):**
1. **Header block** — existing shell (eyebrow, Log title, subtitle, Sign out). Lilypad visible in header zone.
2. **Chip Groups** — horizontal scroll of type chips (active = orange fill `#f08429`; inactive = white). Selects which create form is shown.
3. **Log page body** — sage panel (`#b7cc87` / brand3): Form Group (ignore field details until later frames) + **Entries List** empty state.
4. **Bottom nav** — existing; Log active.

**Entries empty state (this frame):**
- Heading: **Today**
- Subtext: **0 logged entries**

**Scroll / clip behavior (owner — binding for implement):**
- Chip Groups stay fixed in place under the header (sticky).
- Only **Log page body** content scrolls vertically.
- Scrolling body content passes **behind the Chip Groups** and is **clipped at the top edge of the Chip Groups** — it must **not** scroll up into or behind the header block.
- Bottom nav remains fixed as today.

**Deferred on this frame:** Form Group field layout/copy (later frames).

**Figma chip row note:** Component shows seven real types (Symptom → Event) plus two placeholder chips labeled **Label** — product ships **seven** chips only (owner confirmed).

### Frame 2 — Log Symptom form (populated shell; ignore Today list contents)
**Figma:** `iPhone 13 & 14 - Log` (node `62898:1747`) — **Symptom** chip active (not Blood Pressure)  
**Reviewed:** 2026-08-12 with owner

**Same chrome as Frame 1:** header, sticky Chip Groups, sage body, bottom nav (Log active). Owner: ignore filled Today list until list frames.

**Form Group (Symptom) — structure locked:**
1. Outlined select **Symptom** — catalog value (example: Fatigue); trailing dropdown chevron
2. Outlined select **Severity** — UI values: Normal amount / Worse than usual / Better than usual (storage key for first remains `usual`)
3. Outlined **Date & Time** — example `08/09/2026 2:30 PM`; trailing calendar icon
4. Outlined multiline **Notes (optional)** — placeholder **Anything else to note...**
5. Primary CTA pill orange `#f08429`: **Log Symptom** (`log.action.log_symptom`)

**Field pattern:** MD3-style outlined fields; floating/cutout labels on the top border; white form card ~12px radius on sage panel.

**Deferred:** Today list row layout (populated list appears in this frame but ignored for now).

**Copy:** Frame 2 drifts resolved — deck matches Figma (owner 2026-08-12). Other type CTAs TBD as frames land.

### Frame 3 — Blood Pressure form group
**Figma:** `Blood Pressure` (node `62905:2022`)  
**Reviewed:** 2026-08-12 with owner

**Layout (Form Group only — same shell/chips pattern as prior frames):**
1. **Row 1 — BP Reading:** three equal outlined fields in one horizontal row — **Systolic**, **Diastolic**, then a thin **orange vertical divider**, then **HR (bpm)**. No posture.
2. **Row 2:** full-width **Date & Time** with calendar trailing icon.
3. **CTA:** orange **Log Blood Pressure** (`log.action.log_blood_pressure`).

**Copy locked:** `log.field.heart_rate` = **HR (bpm)**; `log.action.log_blood_pressure` = **Log Blood Pressure**.

### Frame 4 — Medication form group
**Figma:** Medication form (node `62906:2314`)  
**Reviewed:** 2026-08-13 with owner

**Layout:**
1. **Row 1:** **Medication** (catalog dropdown, grows) + **Dose** (fixed ~104px free text; example `10 mg`)
2. **Row 2:** full-width **Date & Time** + calendar icon
3. **CTA:** **Log Medication** (`log.action.log_medication`)

Matches REQ-05; no extra questions blocked.

### Frame 5 — Water form group
**Figma:** Water form (node `62906:2164`)  
**Reviewed:** 2026-08-13 with owner

**Layout:**
1. **Input row:** **Day Total oz** group (label **Today’s Total**, value **`{oz} oz`**, gray chip) + outlined **Add Ounces** (numeric only; placeholder **e.g. 32**)
2. **Date & Time** full width
3. **Button row:** **Log Water** only in v1 (Figma also shows **Reset total** — **hide for v1**)

**Copy:** `log.water_total_label` / `log.water_total_value`; `log.field.amount_oz` = Add Ounces; `log.field.amount_oz_placeholder` = e.g. 32; `log.action.log_water`.

**Resolved (owner 2026-08-13):** Reset total hidden in v1; placeholder ships as **e.g. 32**.

### Frame 6 — Mood form group
**Figma:** Mood form (node `62907:2193`)  
**Reviewed:** 2026-08-13 with owner

**Layout:**
1. Full-width **Mood** dropdown (example: Okay; options per `log.mood.*`)
2. Full-width **Date & Time** + calendar icon
3. CTA **Log Mood** (`log.action.log_mood`)

Matches REQ-08; no open questions.

### Frame 7 — Event form group
**Figma:** Event form (node `62907:2283`)  
**Reviewed:** 2026-08-13 with owner

**Layout:**
1. Full-width **Note** as a **textarea** (multi-line; Figma used a single-line outlined field as a stand-in — owner: ship textarea). Placeholder **e.g. Walked 10 miles**
2. Full-width **Date & Time** + calendar icon
3. CTA **Log Event** (`log.action.log_event`)

Matches REQ-09. **Resolved (owner 2026-08-13):** Note is textarea despite Figma single-line mock.

### Frame 8a — Electrolytes available (not yet logged that day)
**Figma:** node `62907:5537` (`taken=No`)  
**Reviewed:** 2026-08-13 with owner

**Layout:**
1. Row: gray **Taken** chip (left) + **Date & Time** (flex)
2. CTA **Log Electrolytes** (`log.action.log_electrolyte`)

### Frame 8b — Electrolytes blocked (already logged that day)
**Figma:** node `62907:2282` (`taken=Yes`)  
**Reviewed:** 2026-08-13 with owner

**Layout:**
1. Row: **Taken** chip (checked) + **Date & Time** muted/disabled (no further create)
2. No Log CTA — status line: **Electrolytes already logged for today.** (Figma)
3. Change path remains: delete today’s electrolytes entry from Today list (REQ-07), then form returns to 8a

**Resolved (owner 2026-08-13):**
1. Create **yes only** — no UI to log “No”; absence of a row = not taken. Layout follows Figma (Taken chip + Date & Time + Log / blocked).
2. Blocked copy = Figma short string: **Electrolytes already logged for today.**

### Frame 9a — Today list empty
**Figma:** node `62910:6163`  
**Reviewed:** 2026-08-13 with owner

- White card ~12px radius
- Title **Today** (`log.today_heading`)
- Subtitle **0 logged entries** (`log.entries_count` with `{count}=0`)
- No entry rows

### Frame 9b — Today list populated
**Figma:** node `62811:26443`  
**Reviewed:** 2026-08-13 with owner

- Same card header: **Today** + **{n} logged entries**
- Stack of **Entry Card** rows (~44px, 8px radius, light border):
  - Line 1 (eyebrow): type + time, small uppercase gray — e.g. `SYMPTOM  8:12 AM`, `BLOOD PRESSURE  8:12 AM`
  - Line 2 (value): summary — e.g. `Fatigue - Normal amount`, `100/75 - 100 bpm`
- Gap ~8px between cards
- Each card: **Delete** (default) → tap arms **Confirm Delete** in brand7 `#d95c1c` → second tap deletes
- No modal delete dialog in v1

### Frame 9c — Entry card default
**Figma:** node `62811:25282` (`state=Default`)  
**Reviewed:** 2026-08-13 with owner

- Eyebrow + value + **Delete** (zinc-500)

### Frame 9d — Entry card confirm delete
**Figma:** node `62910:6297` (`state=Confirm Delete`)  
**Reviewed:** 2026-08-13 with owner

- Same card; action label **Confirm Delete** in **brand7** `#d95c1c`
- Second tap confirms delete and removes the row
