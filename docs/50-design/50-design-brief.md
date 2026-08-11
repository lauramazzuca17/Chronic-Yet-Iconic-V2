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
| Dashboard summary | Today’s stats | empty, populated |
| Log screen | All manual create types | validation error, success, electrolytes blocked |
| Calendar + day detail | Pick day; list entries; delete | empty day, populated, confirm delete |
| Analytics controls + chart | BP vs medication / HR trends | empty data, loading, populated |
| Import uploader | zip/CSV/XML | idle, parsing, success, error |
| Confirm dialog | Delete manual or imported data | open, confirming |

## Accessibility rules (non-negotiable)
- Contrast ≥ WCAG AA; visible focus states; full keyboard operability;
  touch targets ≥ 44px; motion respects reduced-motion.
- Form fields have visible labels (not placeholder-only).
- Charts must have a text/table fallback or equivalent summary for critical BP/HR views (detail at analytics FEAT).

## Claude Design round-trip
- Outbound: run `/design-brief [FEAT-ID]` → paste the generated brief from
  `briefs/` into Claude Design (optionally point it at the codebase/tokens).
- Inbound: save the handoff bundle to `handoffs/<feature>/` → run
  `/import-design` → contracts reconciled → built via /tdd-cycle.

## Handoff log
| Date | Feature | Bundle path | Notes |
| --- | --- | --- | --- |
| 2026-08-10 | FEAT-001 | briefs/FEAT-001-brief.md | Design review complete — ready for PRD approval |
