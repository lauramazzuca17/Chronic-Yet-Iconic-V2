---
project: "Chronic Yet Iconic V2"
type: design-brief
status: design-contract
updated: 2026-08-18
---
# Design Brief and System

[[../00-foundation/00-overview|← Overview]]

> [!important] This document is a design contract
> UI implementation must match this brief and the tokens source below. A
> visual change starts here (or arrives via an imported handoff that updates
> this doc), then code follows.

## Aesthetic direction
Personal health tool: **calm, grounded, direct**. Material Design 3 language via **MUI** with an MD3-oriented theme. Prefer clear hierarchy and readable data density for logs/calendar/charts over decorative marketing layouts. Avoid playful illustration-led chrome, social-feed patterns, and “medical AI” visual tropes. A later design file (MD3 components) is the visual reference to reconcile into tokens + MUI.

## Design tokens — single source of truth
- **Tokens live in:** `src/styles/tokens.css` — code derives from this file; never hardcode raw values elsewhere in components when a token exists. Login layout helpers in `src/auth/login-page.ts` (`getLoginPageLayout`) mirror the same values for tests. Global `box-sizing: border-box` is set here (`*`, `*::before`, `*::after`) so `width: 100%` + padding cannot overflow gutters.
- Color roles, type scale, spacing, radii, motion: align to **MD3** roles (primary, surface, error, etc.) mapped through MUI theme; login palette locked from Figma `62827:29846` (2026-08-15).
- Motion: subtle; respect `prefers-reduced-motion`.

## Component inventory
| Component | Purpose | States to support |
| --- | --- | --- |
| App shell + nav | Dashboard / Log / Calendar / Analytics / Import | active, focus |
| Sign-in form | Username + password over pond + koi; fluid card 38px side margins | default, error, submitting (65% opacity disabled) |
| Dashboard summary | Today’s stats (BP row, meds, water+Taken badge, symptoms) | empty zeros, populated, electrolytes taken vs not |
| Log screen | All manual create types | validation error, success, electrolytes blocked |
| Calendar + day detail | Pick day; list entries; delete | empty day (`0 logged entries`), populated, today heading, Confirm Delete |
| Analytics controls + chart | BP vs medication / HR trends | empty data, loading, populated |
| Import uploader | CSV pair (summary + detailed) | idle, error under Start import, success |
| Import history | Database summary + batch list | Completed / Processing / Failed; Delete → Delete this import? |
| Confirm dialog | Delete manual or imported data | open, confirming (Import uses inline confirm link) |
| TakenBadge | Electrolytes Taken + X/check (`#efefef` 65px) | not taken (X), taken (check); Home compact / Log field-height |

## Accessibility rules (non-negotiable)
- Contrast ≥ WCAG AA; visible focus states; full keyboard operability;
  touch targets ≥ 44px; motion respects reduced-motion.
- Form fields have visible labels (not placeholder-only).
- Charts must have a text/table fallback or equivalent summary for critical BP/HR views (detail at analytics FEAT).

## Claude Design round-trip
- **Not used for this project** (owner decision 2026-08-13). Design source of truth is **Figma** + this brief / FEAT briefs; implement via `/tdd-cycle` (and Figma MCP when importing visuals).
- Outbound `/design-brief` still produces paste-ready briefs for humans / Figma — not Claude Design.
- Inbound `/import-design` remains available if a handoff bundle appears later; default path is Figma → build.

## Handoff log
| Date | Feature | Bundle path | Notes |
| --- | --- | --- | --- |
| 2026-08-18 | TakenBadge extract | — | Shared Home + Log electrolytes pill (`src/components/TakenBadge.tsx`) |
| 2026-08-18 | Import filename ellipsis | briefs/FEAT-007-brief.md | Chosen CSV names truncate in-column; `title` keeps full name |
| 2026-08-17 | Import visual fidelity | briefs/FEAT-007-brief.md | Figma `62939:4277` / Main `62946:4425`; sage summary + file-waveform |
| 2026-08-17 | Analytics visual fidelity | briefs/analytics-page-brief.md | Chips + Medication + Cardiovascular + Recovery + Electrolytes; koi favicon PNG |
| 2026-08-16 | Home visual fidelity | briefs/home-page-brief.md | Figma `62795:75` + `62920:2588`; 16px gutters; hide Health records; fix header/nav/50-50 overlap |
| 2026-08-15 | Login visual fidelity | briefs/login-page-brief.md | Figma `62827:29846` + error `62829:31133`; koi OK, rest diverges; card fluid width (38px side margins, not fixed 314px) |
| 2026-08-13 | FEAT-006 | briefs/FEAT-006-brief.md | Calendar states: past day list, today, empty, scroll header |
| 2026-08-13 | FEAT-005 | briefs/FEAT-005-brief.md | Home dashboard brief — paste to Claude Design |
| 2026-08-12 | FEAT-004 | briefs/FEAT-004-brief.md | Log UI brief — paste to Claude Design |
| 2026-08-10 | FEAT-001 | briefs/FEAT-001-brief.md | Design review complete — ready for PRD approval |
