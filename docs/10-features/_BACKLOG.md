---
type: backlog
status: living-document
updated: 2026-08-18
---
# Backlog — idea inbox

[[_PRD-INDEX|← Feature index]]

> [!note] Zero-friction capture
> Anyone (you in Obsidian, Claude mid-session) may append a one-liner here at
> any time — no REQ formality required. Ideas leave this list only by triage:
> promoted to a REQ row in [[01-requirements]] (then a FEAT PRD), explicitly
> deferred, or dropped. Triage happens during /define, /new-feature, or
> whenever you ask.

## Ideas
- [x] Upgrade Next.js to clear npm audit postcss/sharp highs — Next 16.3.1 (2026-08-18); production `npm audit --omit=dev` is 0
- [x] Extract one shared `TakenBadge` — Home + Log electrolytes (`src/components/TakenBadge.tsx`, 2026-08-18)
- [x] Set a global `box-sizing: border-box` — `tokens.css` (`*`, `*::before`, `*::after`), 2026-08-18
- [x] Calendar Month/Year selects crowd at 320px — compact chevrons + Year min 92px (2026-08-18)
- [ ] _(add more anytime)_

## Deferred (decided, not now)
| Idea | Why deferred | Revisit when |
| --- | --- | --- |
| Home **Health records** card (Figma) | Owner hid for v1; no REQ-01 amend | After Import FEAT + if Home should surface today’s import count |

## Dropped
| Idea | Why |
| --- | --- |
| Template example: add CSV export | Not a backlog idea — CSV import is MVP (REQ-11); removed template placeholder |
