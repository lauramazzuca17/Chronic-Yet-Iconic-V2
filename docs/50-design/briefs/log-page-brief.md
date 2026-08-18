# Design brief — Log page visual fidelity

Standalone brief for rebuilding the Log screen to match Figma. No repo paths required.

**Updated:** 2026-08-16  
**Feature:** FEAT-004 (behavior already shipped; this pass is visual fidelity)  
**Shell:** Reuse Home-polished chrome (Geist header, Figma nav/logout icons, pond bg, 16px gutters). Active nav = **Log**.

---

## Product summary

**Chronic Yet Iconic** — personal POTS tracker. **Log** is the single surface to create/delete all MVP manual types: symptom, blood pressure, medication, water, electrolytes, mood, event. Create + delete only (no edit). **No posture** on BP.

---

## Primary Figma frames

File: https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2

| State | Node |
| --- | --- |
| **Main (owner focus)** | `62898:1748` — [open](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62898-1748) |
| Empty today | `62805:700` — [open](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62805-700) |
| Log with Symptom active (full) | `62898:1747` — [open](https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2?node-id=62898-1747) |
| Blood Pressure form | `62905:2022` |
| Medication form | `62906:2314` |
| Water form | `62906:2164` |
| Mood form | `62907:2193` |
| Event form | `62907:2283` |
| Electrolytes not taken | `62907:5537` |
| Electrolytes taken / blocked | `62907:2282` |
| Today entry card | `62910:6163` |
| Delete → Confirm Delete | `62811:25282` / `62910:6297` |

---

## Owner locks (from Home / login lessons)

- **Primary visual target:** Main `62898:1748` (chips + symptom form + Today list).
- **16px** side gutters (same as Home Figma — not login’s 38px).
- Fluid widths: full-width controls/cards = `100%` inside gutters; `box-sizing: border-box` (no padding overflow).
- Header type/padding/sign-out already locked on shell — Log only changes title/subtitle copy.
- Prefer **annotated screenshots** after build for gaps.
- Hide Figma **Reset total** on Water for v1 (already product lock).
- Chips: horizontal scroll; selected `#f08429` / white label; idle white / `#49454f` + soft shadow; pill radius 100; Geist 14/18; Figma visual height ~26px (44px hit target). Strip is **sticky and opaque brand3 `#b7cc87`** (full-bleed past the 16px gutters) so scrolling entries are clipped at its edge, never visible behind the chips.
- Form + Today: white cards radius 12; **py 18** (Today has no extra form field offset); form fields use MUI `variant="outlined"` locked shrunk (filled state); label Geist 12/18 `#484649`, value 16/24 `#1c1b1f`; CTA compact px10/py4 radius 6 (Figma), expanded hit target.
- Log body under header: solid brand3 `#b7cc87` (pond remains in header band only).
- **Inline stat pill** (Water `Today's Total`, Electrolytes `Taken`): `#efefef`, radius 4, px10/py6, gap 2, min-height 56 so it bottom-aligns with the field sharing its row (row gap 8). Label Geist 14/18 `#5c5c60`. Water width **132px** with value Geist **24/26 semibold `#1d1b20`** (not the orange accent); Electrolytes width **65px** uses the shared `TakenBadge` (same 22px `x-square` / `check-square` as Home).
- **Electrolytes states:** not taken (`62907:5537`) = `x-square` + enabled Date & Time + `Log Electrolytes` CTA. Taken (`62907:2282`) = `check-square` + Date & Time disabled (`#fafafa` fill, `#79747e` label and value) + the notice `Electrolytes already logged for today.` in Geist 12/18 **black**, which **replaces** the CTA rather than sitting beside a disabled one.

---

## Composition

1. Shell header: **Log** + subtitle **Track symptoms, vitals, medications, water, mood and other daily events.**
2. Type chooser (chips) for seven types — thumb-friendly.
3. Active type create form (fields + Date & Time + type-specific CTA).
4. **Today** list of today’s entries; empty calm state when none.
5. Delete: inline **Delete** → **Confirm Delete** (brand7 `#d95c1c`); no modal.
6. Bottom nav: **Log** active.

---

## What “done” looks like

1. Side-by-side with primary frames at ~390 width: chips, forms, Today list, delete confirm.
2. All seven create forms match their Figma nodes for spacing/type/chrome.
3. FEAT-004 unit + E2E stay green; add layout token tests if useful.
4. Owner annotated screenshot pass.

---

## Implementation hint

Restyle existing `LogScreen` (and related form components) against Figma; keep domain/actions. Reuse shell from Home pass. Export any missing icons from Figma nodes — do not invent glyphs.
