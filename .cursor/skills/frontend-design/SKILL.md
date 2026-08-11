---
name: frontend-design
description: Design-quality guidance for building or restyling any UI (web app, component, page, CLI TUI). Use whenever implementing user-facing interface work, importing a design handoff, or when the user asks for UI that doesn't look generic. Integrated with docs/50-design/50-design-brief.md.
---

# Frontend Design — intentional, non-generic UI

## Order of authority
1. An imported Claude Design handoff for this feature (docs/50-design/handoffs/).
2. docs/50-design/50-design-brief.md (design contract: direction, tokens, components).
3. This skill's defaults, below.
If (1) or (2) exist, follow them; use this skill to fill gaps, never to
override them. If neither exists and the UI is substantial, propose filling
in 50-design-brief.md first (a 10-minute pass beats restyling later).

## Commit to a direction before code
Pick and NAME one clear aesthetic direction (e.g. dense-utilitarian,
editorial, playful-rounded, brutalist, retro-terminal) consistent with the
product's voice in docs/40-brand/40-voice-and-tone.md. State the choice in
one sentence, then execute it consistently. The failure mode to avoid is the
generic default look: centered card on gradient, boilerplate hero, identical
rounded buttons, purple-on-white, lorem ipsum.

## Execution rules
- **Tokens only.** All colors/spacing/type come from the tokens source named
  in 50-design-brief.md. No raw hex/px values scattered in components. If a
  needed token doesn't exist, add it to the tokens file AND the brief.
- **Real copy only.** Strings come from docs/40-brand/42-copy-deck.md keys.
  Missing string → add a row to the deck (matching voice rules), never
  placeholder text.
- **Typography and spacing carry the design.** Choose a deliberate type
  scale and consistent spacing rhythm; these matter more than decoration.
- **States are part of the design.** Every component ships hover/focus/
  active, loading, empty, error, and disabled states — styled, not default.
- **Accessibility is non-negotiable** (from the brief): AA contrast, visible
  focus, keyboard operability, ≥44px touch targets, reduced-motion respect,
  semantic HTML before ARIA.
- **Document what you established.** New components/patterns get a row in
  the brief's component inventory in the same session.
