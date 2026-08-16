# Design brief — Login page visual fidelity

Standalone brief for rebuilding the sign-in screen to match Figma. No repo paths required.

**Updated:** 2026-08-15  
**Owner note:** Production already has the moving koi; almost everything else still diverges from Figma. This pass is about making the first screen look like the mockup again.

---

## Product summary

**Chronic Yet Iconic** (never show “V2” in the UI) is a personal POTS health tracker: manual logs, Apple Health CSV import, and analytics for blood pressure, heart rate, and medications. Password-protected; seeded accounts only (Laura + Demo). No public signup, no clinician portal, no AI diagnosis.

**Tagline:** Make sense of your health trends.

**This brief covers only:** the **sign-in / login** screen (phone-first). Authenticated shell and other pages are out of scope for this pass.

**Stack in production:** Next.js App Router + React + TypeScript + MUI (MD3-oriented) + Turso. Login is a client form that posts credentials and establishes an HTTP-only session cookie.

---

## Audience and tone

| Segment | Need | Avoid |
| --- | --- | --- |
| Primary: Laura (owner) | Calm, private entry into her health notebook | Clinical lecture, cheerleading, “oopsie” errors |
| Secondary: Demo | Safe explore without owner data | Confusing marketing chrome |

**Voice:** Calm, grounded, curious, direct. Address **you**. Errors **blunt and informative**.

---

## Screens / frames to match

Figma file: https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2

| State | Frame name | Node |
| --- | --- | --- |
| Default | iPhone 13 & 14 - Log In Screen | `62827:29846` |
| Error | iPhone 13 & 14 - Log In - Error | `62829:31133` |

Primary viewport: **phone-first** (~390×844). Desktop is not the design target for this screen.

---

## Composition (must read as one scene)

1. **Full-bleed lilypad pond background** — top-down pond water (deep teal/green with ripples) and bright green lily pads at the edges. Not a flat CSS gradient. Not abstract blobs. The environment is the brand.
2. **White login card** centered with the koi as one stack in the viewport (no page scroll).
3. **Koi Lottie** under the card — circular pair of fish (~177×177; may shrink on short viewports). Sign-in only. Respect `prefers-reduced-motion` (hide or freeze animation). Page is **viewport-locked** (`100dvh`, `overflow: hidden`) — do not use Figma artboard top padding in a way that forces scroll on real phones.
4. **No** app shell, bottom nav, header, or secondary marketing content on this screen.
5. **Brand test:** If you remove the wordmark text, the pond + koi alone should still feel like this product’s entrance — not a generic green auth form.

---

## Real copy (use these strings only)

| Role | Exact string |
| --- | --- |
| Wordmark | Chronic Yet Iconic (three words; “Yet” styled differently — see below) |
| Username field label | Username |
| Password field label | Password |
| Primary CTA | Sign In |
| Invalid credentials error | Username or password is wrong. |

Do not invent headlines, helper text, “Forgot password?”, signup links, or social login.

---

## Visual system (locked from Figma)

### Background
- Asset: full-frame lilypad pond image (same family as Figma frame fill).
- Cover the viewport; maintain pond feel at phone width; avoid letterboxing that shows a blank color slab.

### Card
- **Responsive width** — not a fixed 314px. Match the rest of the app’s cards: **38px margin** on the left and right from the viewport edge; the card fills the remaining width (`width: calc(100% - 76px)` or equivalent).
- Corner radius **22px**.
- Fill white `#FFFFFF`.
- Shadow: soft elevation (approx. 0 4px 4px rgba(0,0,0,0.15) + 0 1px 1.5px rgba(0,0,0,0.3) / M3 elevation light).
- Padding: ~19px top, ~23px bottom, ~28px horizontal.
- Vertical stack gap ~10px between wordmark, fields block, and button area.

### Wordmark
- Font: **DM Sans**, ExtraLight / thin for “Chronic” and “Iconic”; **Medium Italic** for “Yet”.
- Size ~28px / line height ~36px; centered.
- Colors: “Chronic” / “Iconic” ≈ `#1D1B20`; “Yet” ≈ `#367057` (italic).
- Not a heavy bold system font. Not all-one-weight.

### Fields
- MD3 **outlined** text fields (label sits on the border cutout).
- Height ~56px; border ≈ `#D1D1D6`; label ≈ `#484649` at 12px (Geist Regular); input text ≈ `#1C1B1F` at 16px.
- Stack gap ~16px between Username and Password.
- Visible labels always (not placeholder-only).

### Sign In button
- Pill / fully rounded (`rounded-full` / 100px).
- Fill brand orange `#F08429`.
- Label white, medium, ~14px.
- Horizontally centered under fields; modest top padding (~5px) before the button cluster.
- Touch target ≥ 44px tall.

### Submitting state
- Same orange fill at **65% opacity**.
- Control **disabled** until the request finishes.
- No spinner required by Figma; opacity + disabled is the lock.

### Error state (node `62829:31133`)
- Same layout as default.
- Error text **below** the Sign In button, centered.
- Exact product string: **Username or password is wrong.**
- Geist Light 12px / ~18px line height; color `#D95C1C`.
- (Figma placeholder “[Error Message Goes Here]” must not ship.)

### Koi
- Canonical motion asset already in product: koi-fish-color-v2 Lottie.
- Place under the card; ~177px box; gap ~10px from card.
- Decorative only (`aria-hidden`).

---

## Known gaps vs current production (fix these)

| Area | Figma | Current production (problem) |
| --- | --- | --- |
| Background | Photographic / painted lilypad pond | Flat CSS green gradient |
| Wordmark | DM Sans ExtraLight + italic green Yet | Heavier default/MUI weight, weaker brand |
| Card | 22px radius, Figma elevation, fluid width with 38px side margins | Generic MUI card proportions / fixed-width artboard lock |
| Fields | Outlined MD3 with border labels | MUI outlined but not Figma-tuned |
| Button | Compact pill under fields | Full-width pill, different density |
| Scene | Card + koi as one composition over pond | Koi present; scene still reads like “form on green” |

---

## Behavior (must preserve)

- Username + password → Sign In.
- Success: establish session and go to Home / Dashboard.
- Failure: stay on login; show **Username or password is wrong.**
- No public registration UI.
- Seeded accounts only (Laura, Demo).

---

## Accessibility

- Contrast ≥ WCAG AA on text and CTA.
- Visible focus rings on fields and button.
- Full keyboard: tab, submit with Enter.
- Touch targets ≥ 44px.
- Labels visible (not placeholder-only).
- Respect `prefers-reduced-motion` for koi.
- Errors announced accessibly (e.g. `role="alert"`).

---

## Design-system constraints

- Implement in the existing Next.js + MUI app (no Tailwind rewrite unless the project already uses it).
- Prefer CSS variables / theme tokens over one-off hex once tokens are updated for this screen.
- Pond background and koi are **login-only** brand moments; do not put the koi on authenticated shell pages.
- Do not add cards-for-decoration beyond the single login card.

---

## What “done” looks like

1. **Default:** Side-by-side with Figma `62827:29846` — pond background, wordmark treatment, card radius/shadow/padding, field chrome, orange pill CTA, koi under card — match closely at phone width.
2. **Error:** Same as default plus error string under the button in `#D95C1C` Light 12px (`62829:31133`).
3. **Submitting:** CTA `#F08429` at 65% opacity and disabled.
4. **Reduced motion:** Koi does not animate (or is static / hidden).
5. **Behavior:** Valid Laura/Demo credentials still sign in; invalid credentials show the locked error string without inventing new copy.
6. **Brand test:** First viewport feels like Chronic Yet Iconic’s pond entrance, not a generic green login form with a fish sticker.

---

## Implementation hint for the build agent

Figma source of truth: nodes above. Rebuild LoginForm visual layer to this brief; keep existing auth actions/session behavior. Export or reuse the pond background asset from the Figma frame fill if not already in the repo.
