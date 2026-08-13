# Design brief — FEAT-005 Home dashboard (today’s summary)

Paste-ready for Claude Design (or any design tool). Standalone — no repo paths required.

**Updated:** 2026-08-13

---

## Product summary

**Chronic Yet Iconic** (user-facing name) is a personal health tracker for someone living with POTS. Internal project name may include “V2”; **do not show “V2” in the UI.**

**Tagline:** Make sense of your health trends.

**FEAT-005 — Home / Dashboard:** The authenticated landing route where a signed-in user sees a **summary of today’s manual logs** at a glance. Six fields only (America/New_York “today”):

1. Count of BP readings today  
2. Most recent BP today as **systolic/diastolic only** (no HR on Home; never posture)  
3. Count of medications logged today  
4. Total water oz today  
5. Count of symptoms logged today  
6. Electrolytes for today — presentation follows the **Home Figma card** (taken = affirmative; no row = not logged; there is no “log no” create path)

This sits inside the existing authenticated app shell (header + bottom nav). Do **not** redesign login or global shell chrome except as needed so Dashboard content sits correctly under the sticky header and above the bottom nav.

---

## Audience and tone

**Primary user:** Owner (Laura) checking the phone between readings / before care conversations.

**Tone:** Calm, grounded, curious, direct. Address **you**. Empty states explain why it’s empty and the first useful action (log a reading or import). No clinician portal, social, cheerleading, or AI-diagnosis visuals.

---

## Screens / flows to design

Design for **phone viewport only**. Max content column ~430px centered if shown on a wider canvas — not a desktop dashboard layout.

### Shell context (already locked — reuse)
- Lilypad / pond atmosphere background on authenticated pages.
- Header: uppercase eyebrow **Chronic Yet Iconic**; orange icon Sign out; page title **Dashboard**; subtitle **Take a look around!**
- Sticky header becomes `#0B4041` at 80% opacity when content scrolls under it.
- Bottom nav: Home, Log, Calendar, Analytics, Import; bar `#0B4041` @ 80%; active **Home** icon in pill `#082E33` @ 80% (~16px radius), label below pill.

### A. Dashboard — populated today
One composition: today’s six summary fields readable in one thumb-scroll without feeling like a dense admin dashboard. Prefer clear hierarchy (BP / vitals emphasis is appropriate — BP and HR matter clinically, but **Home shows BP count + latest sys/dia only**, not HR).

Show all six metrics even when some are zero (counts can be `0`; latest BP uses empty string; electrolytes use not-logged treatment from the Figma card).

### B. Dashboard — empty today (no manual logs)
Still show the six metric slots in empty/zero/not-logged states — **never** another day’s data. Include calm empty guidance: **No stats for today yet. Add a log or import data.** Optional soft affordance toward Log (visual only in this brief; no new nav chrome).

### C. Electrolytes card (binding visual)
Match the **Figma Home electrolytes card** exactly for yes vs not-logged presentation (icons, chip, Yes/No styling, copy). Product rule underneath: a stored taken-yes row = affirmative; absence of a row = not logged (not a stored “no”).

### D. Latest BP empty vs populated
- Populated: format **{sys}/{dia}** (e.g. `120/80`).  
- Empty: **No BP logged today** (or Figma-locked equivalent if different).  
- Do **not** show HR or posture on Home.

### Out of scope for this brief
- **Health records** card (present in Figma; **hidden in v1** — do not include in build)  
- Mood / event summaries  
- Charts / analytics  
- Calendar day picker  
- Editing logs from Home  
- Import stats on Home  
- Desktop-only layouts  

---

## Real copy strings (use these — no lorem ipsum)

| Key | String |
| --- | --- |
| shell.eyebrow | Chronic Yet Iconic |
| shell.title.dashboard | Dashboard |
| shell.subtitle.dashboard | Take a look around! |
| auth.logout | Sign out (accessible name; icon-only control) |
| nav.home | Home |
| nav.log | Log |
| nav.calendar | Calendar |
| nav.analytics | Analytics |
| nav.import | Import |
| dashboard.empty | No stats for today yet. Add a log or import data. |
| dashboard.metric.bp_count | BP readings |
| dashboard.metric.bp_latest | Latest BP |
| dashboard.metric.bp_latest_empty | No BP logged today |
| dashboard.metric.bp_latest_value | {sys}/{dia} |
| dashboard.metric.meds_count | Medications |
| dashboard.metric.water_total | Water |
| dashboard.metric.symptoms_count | Symptoms |
| dashboard.metric.electrolytes | Electrolytes |
| dashboard.electrolytes.not_logged | Not logged |
| dashboard.metric.count_value | {count} |
| log.electrolyte.yes | Yes |
| log.water_total_value | {oz} oz |

**Note:** If the Figma Home electrolytes card uses different visible strings than `Yes` / `Not logged`, lock those strings from Figma and treat the table rows above as drafts until reconciled.

**Example populated values (synthetic):** BP readings `2`; Latest BP `118/76`; Medications `1`; Water `16 oz`; Symptoms `3`; Electrolytes affirmative per Figma card.

---

## Design-system constraints

- Aesthetic: calm, grounded, direct personal health tool — MD3-oriented via MUI language. Prefer readable data density over marketing decoration.
- Reuse shell tokens already locked: teal bar `#0B4041` @ 80%, active pill `#082E33` @ 80%, accent/sign-out orange `#f08429`, brand7 `#d95c1c` only if a destructive control appears (Home has none required).
- Prefer a single vertical composition — not a card-heavy dashboard of unrelated widgets. Cards are OK only if they are the interaction/readability container for a metric.
- Avoid: purple gradients, cream/serif “AI brochure” look, broadsheet newspaper columns, glow effects, emoji, multi-layer shadow stacks.
- Atmosphere background already exists (pond/lilypad); keep content legible over it.
- Motion: subtle only; respect `prefers-reduced-motion`.

---

## Accessibility requirements

- Contrast ≥ WCAG AA; visible focus; keyboard operable.
- Touch targets ≥ 44px for any tappable control.
- Metric labels associated with values (not value-only tiles).
- Empty/not-logged states must be text-readable, not color-only.
- If icons are used for electrolytes, include text (or accessible name) matching the Figma card.

---

## What “done” looks like (acceptance)

| Criterion | Design must show |
| --- | --- |
| AC-1 | BP readings count for today |
| AC-2 | Latest BP as sys/dia only; empty state when none; no HR/posture |
| AC-3 | Medications count today |
| AC-4 | Water total oz today |
| AC-5 | Symptoms count today |
| AC-6 | Electrolytes card matching Figma yes vs not-logged treatment |
| AC-7 | Empty day: zeros / empty latest / not-logged + empty guidance; not another day’s data |
| AC-8 | (Engineering) account isolation — design as personal “your day” only |
| AC-9 | (Engineering) E2E with known logs — design must expose labeled metrics automation can target |

---

## Deliverables requested from design

1. Phone frame(s): Dashboard **populated** and **empty** (and electrolytes yes vs not-logged if separate).  
2. Spec notes for spacing/type if not tokenized.  
3. Exact electrolytes card strings if they differ from the draft table above.  
4. Optional: light motion notes for metric appear (keep subtle).

When designing in Claude Design / Figma, also point the tool at this product’s codebase and token source so colors/type match the real shell.
