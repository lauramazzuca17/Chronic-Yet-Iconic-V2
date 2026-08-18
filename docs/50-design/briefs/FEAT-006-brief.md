# Design brief — FEAT-006 Calendar (manual day detail)

Paste-ready for Claude Design (or any design tool). Standalone — no repo paths required.

**Updated:** 2026-08-18

**Figma file:** CYI — V2 (`WkhupgI4GcrvhLPqJV4T7d`)

Binding frames (implement these states; do not invent extra chrome):
1. Past/other day + long entry list — node `62811:26284`
2. Selected day = today (calendar chrome) — node `62888:11530`
3. Selected day with 0 logs (list header) — node `62910:6163`
4. Scrolled Calendar (header treatment) — node `62811:26890`

---

## Product summary

**Chronic Yet Iconic** (user-facing name) is a personal health tracker for someone living with POTS. Internal project name may include “V2”; **do not show “V2” in the UI.**

**Tagline:** Make sense of your health trends.

**FEAT-006 — Calendar:** The authenticated `/calendar` route where a signed-in user picks an America/New_York calendar day and reviews that day’s **manual** logs only (symptom, BP, medication, water, electrolytes, mood, event). **Imported Apple Health / CSV samples never appear here** — imports feed analytics later.

Create stays on Log. Calendar is review + delete.

---

## Audience and tone

**Primary user:** Owner (Laura) reviewing what they logged on a past or current day, often on a phone between care conversations.

**Tone:** Calm, grounded, curious, direct. Address **you**. Empty days use a quiet zero count — not cheerleading or shame. Destructive confirm is direct. No clinician portal, social, or AI-diagnosis visuals.

---

## Screens / flows to design

Design for **phone viewport only**. Max content column ~430px centered if shown on a wider canvas.

### Shell context (already locked — reuse)
- Lilypad / pond atmosphere background on authenticated pages.
- Header: uppercase eyebrow **Chronic Yet Iconic**; orange icon Sign out; page title **Calendar**; subtitle **Select a day to review everything you logged.**
- Sticky header becomes `#0B4041` at **80% opacity** when content scrolls under it (same treatment as other shell pages).
- Bottom nav: Home, Log, Calendar, Analytics, Import; bar `#0B4041` @ 80%; active **Calendar** icon in pill `#082E33` @ 80% (~16px radius), label below pill.

### A. Calendar — past/other day with many entries (primary frame)
Composition (top → bottom):
1. Shell header (eyebrow, title, subtitle, Sign out).
2. **Month card** (white, large radius): prev/next chevrons; **month** dropdown; **year** dropdown; weekday row Su–Sa; day grid.
   - **Selected day:** orange rounded-square fill (`#f08429` family), white day number.
   - **Today** (when not selected): dark underline under the day number.
   - Out-of-month days (**both** leading and trailing): muted/faded.
3. **Entries card** (white, large radius): day heading + count, then stacked entry cards with **Delete**.

Day heading when not today: **Thursday · August 6, 2026** (weekday · Month D, YYYY).  
Count: **6 logged entries** (pattern `{count} logged entries`).

Each entry card reuses the Log `LogEntryCard` (`62811:25282` / `62910:6297`):
- Eyebrow `SYMPTOM  8:12 AM` (uppercase type + double space + time; 11px `#71717b`)
- Summary line (e.g. `Fatigue - Normal amount`, `100/75 - 100 bpm`; 12px `#1d1b20`)
- **Delete** text control on the value row (12px `#71717b`); armed **Confirm Delete** in brand7 `#d95c1c`

### B. Calendar — selected day is today
Same overall layout as A. Calendar grid shows **today** selected (orange square). List heading uses **Today** instead of the long date string. Count still uses `{count} logged entries`.

### C. Calendar — zero logs for selected day
Same layout; list card shows heading (**Today** or dated heading) and **0 logged entries**. **No** separate “No logs for this day.” blurb in Figma — do not add one unless owner adds it later. No phantom entries from other days.

### D. Calendar — scrolled
Content (month card + entries) scrolls **under** the sticky header. On scroll:
- Header gains solid/teal `#0B4041` at **80% opacity**.
- Subtitle may sit in a translucent teal strip under the title row per scroll frame — match Figma `62811:26890`.
- Bottom nav stays fixed; Calendar remains active.

### Out of scope for this brief
- Create forms on Calendar  
- Edit-in-place  
- Import samples on Calendar  
- Analytics / charts  
- Desktop-only layouts  
- Extra day “dot” markers unless already in the linked Figma frames  

---

## Real copy strings (use these — no lorem ipsum)

| Key | String |
| --- | --- |
| shell.eyebrow | Chronic Yet Iconic |
| shell.title.calendar | Calendar |
| shell.subtitle.calendar | Select a day to review everything you logged. |
| auth.logout | Sign out (accessible name; icon-only control) |
| nav.home | Home |
| nav.log | Log |
| nav.calendar | Calendar |
| nav.analytics | Analytics |
| nav.import | Import |
| calendar.day_heading | {weekday} · {Month} {D}, {YYYY} |
| calendar.day_heading_today | Today |
| log.entries_count | {count} logged entries |
| log.entry.delete | Delete |
| log.entry.confirm_delete | Confirm Delete |
| log.type.symptom | Symptom |
| log.type.blood_pressure | Blood pressure |
| log.type.medication | Medication |
| log.type.water | Water |
| log.type.electrolyte | Electrolytes |
| log.type.mood | Mood |
| log.type.event | Event |

**Example list values (synthetic):** Fatigue - Normal amount; 100/75 - 100 bpm; Midodrine · 10 mg; 8 oz; Taken; Okay; Walked 10 miles.

---

## Design-system constraints

- Aesthetic: calm, grounded, direct personal health tool — MD3-oriented via MUI language.
- Reuse shell tokens: teal bar `#0B4041` @ 80%, active pill `#082E33` @ 80%, accent/sign-out orange `#f08429`, brand7 `#d95c1c` for Confirm Delete.
- Selection fill on calendar days: accent orange family matching Figma.
- Prefer white rounded metric/list cards over pond background (same language as Home/Log).
- Avoid: purple gradients, cream/serif “AI brochure” look, broadsheet newspaper columns, glow stacks, emoji.
- Motion: subtle only; respect `prefers-reduced-motion`.

---

## Accessibility requirements

- Contrast ≥ WCAG AA; visible focus; keyboard operable (month nav, day cells, Delete / Confirm Delete).
- Touch targets ≥ 44px for day cells and delete controls.
- Selected day and today indicator must not be color-only (selected has fill + number contrast; today has underline).
- Entry type + time + summary readable as text; Delete has accessible name.
- Empty day: `0 logged entries` is text-readable.

---

## What “done” looks like (acceptance)

| Criterion | Design must show |
| --- | --- |
| AC-1 | Day list of manual entries for the selected date |
| AC-2 | Changing selected day swaps the list (no mixed days) |
| AC-3 | Zero-entry day: heading + `0 logged entries` only |
| AC-4 | Manual entry types only — no import/Apple Health rows |
| AC-5 | (Engineering) account isolation — personal “your logs” framing |
| AC-6 | Delete → Confirm Delete on each entry card |
| AC-7 | Calendar title/subtitle; default today; month/year picker + day grid |
| AC-8 | (Engineering) E2E — labeled day cells + entry cards + delete for automation |

---

## Deliverables requested from design

1. Phone frames already provided in Figma — treat the four nodes above as source of truth.  
2. Spec notes for month/year dropdowns, day-cell states (default / today underline / selected / out-of-month), and scroll header if not tokenized.  
3. Confirm entry summary formats match Log entry cards where possible.  
4. Optional: light motion notes for month change / day select (keep subtle).

When designing in Claude Design / Figma, also point the tool at this product’s codebase and token source so colors/type match the real shell.

---

## As built — day cell (2026-08-17)

Tokens live in `src/calendar/layout.ts` (`CALENDAR_DAY`), measured from Figma
`62888:11530` (selected ≠ today) and `62888:11531` (selected = today).

| Property | Value |
| --- | --- |
| Cell visual | 40×40, radius 8 (`--sds-size-radius-200`) |
| Tap target | 44px tall, expanded invisibly around the 40px visual |
| Grid | 7 × 40px + 6 × 1px gap = **286px**, centered in the card's 326px inner width |
| Day number | 16px, weight 400 |
| Selected | fill `#f08429` (Brand6), number `#f5f5f5` (`text-brand-on-brand`) |
| In-month number | `#1e1e1e` (`text-default-default`) |
| Out-of-month number | `#b3b3b3` (`text-disabled-default`) |
| Weekday label | `#757575` (`text-default-secondary`), 12/20 |
| Today | `text-decoration: underline` on the number, 3px offset — **not** a cell border |

Notes:
- Today and selected are independent: a day that is both shows an underlined
  `#f5f5f5` number on the orange square. `aria-current="date"` marks today so
  the indicator is not underline-only.
- Figma's day numbers inherit **Inter 16** from the Simple Design System library
  the calendar instance came from; we render the project font (Geist) at 16px
  rather than introduce a second typeface. See decision log.
- Figma's grid is 286px wide against a 326px card interior; we keep it fluid with
  a 286px max-width so 320px phones shrink the cells (to ~36px) instead of
  overflowing. Weekday labels share the day grid's track — in Figma the header
  row spans the full 326px and is very slightly wider than the day columns.
- **Out-of-month cells are greyed at both ends** (`#b3b3b3`) — owner-confirmed
  2026-08-17. Figma's reference month (Sep 2025) happens to leave its single
  **leading** cell empty while greying trailing days; that asymmetry is a
  quirk of the reference frame, not the intent. Pinned by
  `tests/calendar-visual-layout.test.ts`.
- Month card padding is 16px on the sides/bottom (`cardPadPx`) but **24px on
  top** (`monthCardPadTopPx`). Figma's 16px assumes selects with no floating
  label; our MUI Month/Year labels overhang their boxes and sat only 9px off
  the card edge. Owner asked for more padding above the calendar.
- Month/Year stay **side-by-side** at 320px (not stacked). Chevrons are 24px
  visual / 44px hit; Year is a fixed 92px so `2026` cannot ellipsize to `2…`;
  Month flexes. Pinned by `tests/calendar-visual-layout.test.ts`.
