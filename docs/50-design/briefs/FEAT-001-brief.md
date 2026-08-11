# Design brief — FEAT-001 Seeded auth + app shell

Paste-ready for Claude Design (or any design tool). Standalone — no repo paths required.

**Updated:** 2026-08-10 after login Figma review (owner walkthrough).

---

## Product summary

**Chronic Yet Iconic** (user-facing name) is a personal health tracker for someone living with POTS. Internal project name may include “V2”; **do not show “V2” in the UI.**

**Tagline:** Make sense of your health trends.

**FEAT-001:** Username/password sign-in for seeded accounts **Laura** and **Demo**, session protection, and a **phone-first** app shell with bottom/nav to Dashboard, Log, Calendar, Analytics, Import (placeholders OK). **Desktop shell is out of MVP** — primary use is on a phone at appointments.

**Stack later:** Next.js + React + TypeScript + MUI (MD3-oriented) + Turso.

---

## Audience and tone

Calm, grounded, curious, direct. Address **you**. Errors blunt and informative. No signup, social, clinician, or AI-diagnosis chrome.

---

## Login — locked from Figma

### Frames
| State | Node |
| --- | --- |
| Default login | `62827:29846` — iPhone 13 & 14 - Log In Screen |
| Error login | `62829:31133` — iPhone 13 & 14 - Log In - Error |

File: https://www.figma.com/design/WkhupgI4GcrvhLPqJV4T7d/CYI---V2

### Visual system
- **Lilypad pond** background: full-bleed frame fill on **sign-in and authenticated pages**.
- **Koi Lottie** (`koi-fish-color-v2`): **sign-in screen only** (not on app shell). Canonical asset: `public/lottie/koi-fish-color-v2.json`. Respect `prefers-reduced-motion`.
- **Main** group (login): card + koi; **extra top padding** + vertical centering so the koi lands below the card as in Figma. Keep that padding; browser chrome covers notched safe areas.
- White login **card** (~22px radius, soft shadow).
- Wordmark: **Chronic** + italic green **Yet** (`#367057`) + **Iconic** — no “V2”.
- Outlined fields: Username, Password (MD3 outlined).
- CTA: pill, brand orange (`#f08429`), label **Sign In**.
- **Submitting:** button fill `#f08429` at **65% opacity**, control **disabled** until the request finishes.
- **Error state:** centered under the button, Geist Light 12px, `#d95c1c`. Product string: **Username or password is wrong.**

### Layout notes from owner
- Lilypad background on pages that use the app chrome (login + shell).
- Koi animation **login only**.
- Login Main padding preserved for koi placement; no extra notch insets beyond the design.

---

## App shell — locked from Figma (partial; active nav styles TBD)

### Frames
| State | Node |
| --- | --- |
| Shell default | `62829:31220` — App Shell |
| Shell on scroll | `62829:31330` — App Shell - On Scroll |
| Active nav | `62833:31388` — Navigation Bar (Nav item 01 active) |

### Header block (every authenticated page)
1. **Eyebrow row:** left = **Chronic Yet Iconic** (uppercase styling per Figma); right = **Sign out** as orange icon (arrow-from-bracket), not text label.
2. **Title:** page name (e.g. Dashboard/Home, Log, Calendar, Analytics, Import).
3. **Subtitle:** short page description (per-page copy keys).
4. **Default background:** transparent.
5. **Scrolled / overlapping content (esp. Dashboard & Calendar when main scrolls):** sticky header; main content scrolls **under** the header; header fill **`#0B4041` at 80% opacity** (`rgba(11,64,65,0.8)`).

### Bottom navigation
1. Five destinations with icon + label: Home, Log, Calendar, Analytics, Import.
2. Bar fill **`#0B4041` at 80% opacity**; main content can scroll behind it and remain partially visible.
3. **Active** item (Figma `62833:31388`, Nav item 01):
   - Icon sits inside a **pill/capsule** container: fill **`#082E33` at 80% opacity** (`rgba(8,46,51,0.8)`), ~16px corner radius, ~46×24 icon area.
   - Label stays **below** the pill (pill wraps icon only, not the label).
   - Inactive items: icon with no pill background.
4. Apply the same active treatment to whichever route is current (not only Home).

### Nav labels
- Bottom nav item 1 label: **Home** (`nav.home`).
- Page title for that route: **Dashboard** (`shell.title.dashboard`).
- Other nav/title pairs match: Log, Calendar, Analytics, Import.

### Sign out
Icon-only control in header eyebrow (orange). Still maps to action `auth.logout` / accessible name “Sign out”.

MVP constraint: **phone viewport only** for shell; no dedicated desktop shell layouts in v1.

---

## Real copy strings

| Key | String |
| --- | --- |
| app.name | Chronic Yet Iconic |
| app.name.internal | Chronic Yet Iconic V2 (docs/repo only) |
| app.tagline | Make sense of your health trends |
| auth.login.submit | Sign In |
| auth.login.title | Sign In |
| auth.login.error_invalid | Username or password is wrong. |
| auth.field.username | Username |
| auth.field.password | Password |
| auth.logout | Sign out |
| nav.home | Home |
| nav.log | Log |
| nav.calendar | Calendar |
| nav.analytics | Analytics |
| nav.import | Import |
| shell.eyebrow | Chronic Yet Iconic |
| shell.title.dashboard | Dashboard |
| shell.placeholder.body | This section is next. |

---

## Accessibility

- WCAG AA contrast; visible focus; keyboard order username → password → Sign In.
- Touch targets ≥ 44px; labels not placeholder-only.
- Error text under button must be available to assistive tech (not color-only).
- Respect `prefers-reduced-motion` for koi animation (static frame or reduced motion).

---

## Done for FEAT-001 design

- Login: default, error, submitting (65% opacity + disabled); koi Lottie sign-in only; lilypad background.
- Shell: header (eyebrow + Sign out icon + title + subtitle); scroll header `#0B4041`@80%; bottom nav `#0B4041`@80%; active icon pill `#082E33`@80%.
- Nav label Home / page title Dashboard.
- Phone-first; desktop shell out of MVP.
- **Design review complete** — ready for PRD approval, then `/tdd-cycle` (optional `/import-design` if a handoff bundle is exported).
