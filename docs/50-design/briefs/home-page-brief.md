# Design brief — Home / Dashboard visual fidelity

Standalone brief for rebuilding the authenticated Home screen to match Figma. No repo paths required.

**Updated:** 2026-08-16  
**Feature:** FEAT-005 (behavior already shipped; this pass is visual fidelity)  
**Owner locks:** fluid cards with **16px** left/right viewport gutters (match Figma Home — not login’s 38px); half-width row = equal flex columns with gap (never overlapping, never fixed 170px); full-width cards = `100%` inside gutters; **Health records** card **hidden in v1**. Header block + bottom nav must match Figma type, padding, and icons.

---

## Product summary

**Chronic Yet Iconic** (never show “V2” in the UI) is a personal POTS health tracker. Home (`/`, title **Dashboard**) summarizes **today’s** manual logs at a glance inside the authenticated shell (header + bottom nav).

**Tagline:** Make sense of your health trends.

**This brief covers:** Dashboard content cards + how they sit under the existing shell. Shell chrome is already locked (FEAT-003) — refine only if spacing/type on the header block diverges from Figma; do not redesign bottom nav icons from scratch unless assets are missing.

**Stack:** Next.js App Router + React + TypeScript + MUI + Turso.

---

## Audience and tone

Calm, grounded, curious, direct. Address **you**. Empty/zero states are fine — show today’s zeros, never another day’s data. No cheerleading, clinician portal, or AI diagnosis chrome.

---

## Screens / frames to match

Figma file: https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2

| State | Frame / node | Node ID |
| --- | --- | --- |
| Full Home (empty-ish sample) | iPhone 13 & 14 - Home Dashboard | `62795:75` |
| Water card — electrolytes **taken** | Home Dashboard Card (Electrolytes Taken) | `62920:2588` |
| Water card — electrolytes **not taken** | Same water card on `62795:75` (Taken + X) | (on main frame) |

Primary viewport: **phone-first** (~390×844). Wider screens: content column with **16px** side gutters; cards fluid within that column (no fixed card widths).

---

## Composition

1. **Pond / lilypad atmosphere** behind shell (authenticated pages already use pond-like chrome — align to the same photographic pond family as login if still on CSS gradient).
2. **Header block** (shell): uppercase eyebrow **Chronic Yet Iconic** + orange sign-out; title **Dashboard** (Geist Black ~32/40 white); subtitle **Take a look around!** (Geist Medium ~16/20 white). Text shadow soft as Figma.
3. **Metric cards** under the header:
   - **Row:** BP Readings | Latest BP (two equal columns, gap ~16px total gutters)
   - **Full width:** Meds taken today
   - **Full width:** Total Water + **Taken** badge (electrolytes)
   - **Full width:** Symptom logs
   - **Do not render:** Health records (deferred)
4. **Bottom nav** — Home active (pill `#082E33` @ 80%); bar `#0B4041` @ 80%.
5. Content must scroll under sticky header when needed; bottom nav sticky. Unlike login, **page scroll is expected** if cards exceed the viewport.

---

## Real copy (use these)

| Role | Exact string |
| --- | --- |
| Eyebrow | Chronic Yet Iconic |
| Title | Dashboard |
| Subtitle | Take a look around! |
| Sign out | accessible name **Sign out** (icon control) |
| BP Readings | BP Readings / helper Manual BP entries |
| Latest BP | Latest BP / helper Most recent BP |
| Latest BP value | `{sys}/{dia}` (e.g. `100/80`) |
| Meds | Meds taken today / helper Logged medication |
| Water | Total Water / helper Amount of water drank today |
| Water value | `{oz}oz` (no space before `oz`) |
| Electrolytes badge | Taken |
| Symptoms | Symptom logs / helper Manual symptom entries |
| Nav | Home, Log, Calendar, Analytics, Import |

Do **not** invent a separate empty-day banner unless product re-locks it — Figma Home shows **zeros on cards** (copy deck notes `dashboard.empty` unused on Figma Home).

---

## Visual system (from Figma + owner locks)

### Page gutters
- **16px** left/right from viewport (Figma Home).
- Full-column cards: **width 100%** of the content column inside gutters (`box-sizing: border-box`).
- Half-width row: two equal flex children (`flex: 1`, `minWidth: 0`) with a small horizontal gap — **must not overlap** at 390px or any width.
- Vertical rhythm between card rows ~8px (Figma wrappers).

### Header block (must match Figma — currently wrong in production)
- Eyebrow: Geist **Light** 16/20, white, uppercase, soft text shadow.
- Title: Geist **Black** 32/40, white, soft text shadow.
- Subtitle: Geist **Medium** 16/20, white, soft text shadow.
- Padding: Figma header block `pt ~23` / `pb ~20` / `px 16`.
- Sign out: orange **arrow-right-from-bracket** glyph from Figma (not a wrong/generic icon); ≥44px hit target.

### Bottom nav (must match Figma — currently wrong in production)
- Bar `#0B4041` @ 80%; height ~64px; five equal items.
- Active Home: icon in pill `#082E33` @ 80%, radius 16px; label below.
- Icons: use Figma nav SVGs (lily pad / log / calendar / analytics / import) — not mismatched placeholders.
- Labels: white, Roboto/MD3 label medium ~12/16, tracking 0.5px.

### Metric card (default)
- White `#FFFFFF`, radius **12px**
- Shadow: soft dual drop (≈ `0 4px 4px rgba(12,12,13,0.05)` + `0 4px 4px rgba(12,12,13,0.1)` / SDS Drop Shadow 300)
- Padding: **8px** top, **10px** bottom, **16px** horizontal
- Title: ~18px / 22px, medium, `#448774`
- Value: ~30px / 36px, black (900), `#F08429`
- Helper: ~14px / 20px, regular, `#8E8E93`

### Half-width row (BP Readings + Latest BP)
- Two equal fluid columns sharing width inside the 38px gutters
- Same card chrome as full-width cards

### Water + Taken badge
- Same card chrome; **horizontal** layout: text stack flexes; badge compact (~**52px** wide with `box-sizing: border-box` — do not let padding inflate past Figma).
- Badge: fill `#EFEFEF`, radius **4px**, pad ~6×6, label **Taken** Geist Regular 14/`#5C5C60`
- Icon under label: **Figma assets** (`x-square` node `62977:6515`, `check-square` node `62920:2598`) — stroke-width **3.5**, not hand-drawn thin strokes.
- Badge is presentational status (not a create control)

### Header spacing lock
- Eyebrow→title gap is only the header stack gap (**6px**). Sign-out must **not** use a 44px layout height on that row (hit target can expand invisibly).

### Out of scope
- Health records card
- Mood / events / charts on Home
- Koi Lottie (login-only)

---

## Behavior to preserve

- America/New_York “today” only
- BP count; latest sys/dia only (no HR/posture)
- Meds count; water oz sum; symptom count
- Electrolytes: taken-yes row → taken icon; no row → not-taken icon
- Account isolation (Laura ≠ Demo)

---

## Accessibility

- Contrast ≥ AA; labeled metrics (title + value)
- Sign out ≥ 44px hit target
- Taken state not color-only (icon + **Taken** text)
- Keyboard: nav + sign out operable

---

## What “done” looks like

1. Side-by-side with Figma `62795:75` at phone width: header type, card type/colors, 2-up BP row, water+Taken, meds, symptoms — **no Health records**.
2. Electrolytes taken state matches `62920:2588` (check); not-taken matches main frame (X).
3. Cards fluid with **16px** side gutters; full cards 100% width; 50/50 row equal flex with gap (no overlap at 390); `box-sizing: border-box`.
3b. Header type/padding/sign-out icon and bottom nav icons/active pill match Figma.
4. Existing FEAT-005 tests / E2E still green; add layout token tests if helpful.
5. Owner annotated screenshot pass (same communication pattern as login).

---

## Implementation hint

Reuse `DashboardScreen` + shell chrome; restyle cards to tokens in `tokens.css` / layout helpers. Export pond bg for shell if still gradient-only. Download Taken check/X icons from Figma assets — do not invent glyphs.
