---
project: "Chronic Yet Iconic V2"
type: design-brief
status: design-contract
updated: 2026-08-10
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
- **Tokens live in:** `src/styles/tokens.css` (create at scaffold) — code and any Claude Design round-trip derive from this file; never hardcode raw values elsewhere in components when a token exists.
- Color roles, type scale, spacing, radii, motion: align to **MD3** roles (primary, surface, error, etc.) mapped through MUI theme; exact palette from the forthcoming design handoff when imported.
- Motion: subtle; respect `prefers-reduced-motion`.

## Component inventory
| Component | Purpose | States to support |
| --- | --- | --- |
| App shell + nav | Dashboard / Log / Calendar / Analytics / Import | active, focus |
| Sign-in form | Username + password | default, error, submitting |
| Dashboard summary | Today’s stats (BP row, meds, water+Taken badge, symptoms) | empty zeros, populated, electrolytes taken vs not |
| Log screen | All manual create types | validation error, success, electrolytes blocked |
| Calendar + day detail | Pick day; list entries; delete | empty day (`0 logged entries`), populated, today heading, Confirm Delete |
| Analytics controls + chart | BP vs medication / HR trends | empty data, loading, populated |
| Import uploader | zip/CSV/XML | idle, parsing, success, error |
| Confirm dialog | Delete manual or imported data | open, confirming |

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
| 2026-08-13 | FEAT-006 | briefs/FEAT-006-brief.md | Calendar states: past day list, today, empty, scroll header |
| 2026-08-13 | FEAT-005 | briefs/FEAT-005-brief.md | Home dashboard brief — paste to Claude Design |
| 2026-08-12 | FEAT-004 | briefs/FEAT-004-brief.md | Log UI brief — paste to Claude Design |
| 2026-08-10 | FEAT-001 | briefs/FEAT-001-brief.md | Design review complete — ready for PRD approval |
