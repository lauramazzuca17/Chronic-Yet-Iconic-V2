# Project Memory — Chronic Yet Iconic V2

Personal POTS health tracker and analytics web app (manual logs + third-party
Apple Health CSV imports). The full product/requirements source of truth lives
in `docs/` (an Obsidian vault). Read `docs/00-foundation/00-overview.md` first
when context is needed. If code and docs disagree, the docs win — fix one or
the other, never leave them out of sync.

## Imports (always loaded)
- @docs/20-testing/TDD-RULES.md
- @docs/30-state/STATUS.md

## Session start protocol (context recovery)
On every new session, before writing any code:
1. Read `docs/30-state/STATUS.md` — phase, active feature, built/not-built, blockers.
2. Read `docs/10-features/_PRD-INDEX.md` — feature list and statuses.
3. Read the PRD of any feature with status `in-progress`.
4. Run the test suite and confirm the result matches STATUS.md.
Only then act. Or the user can just run `/resume`.

## Gates (non-negotiable)
1. **Requirements before build.** No feature implementation while
   `docs/00-foundation/01-requirements.md` has status `working-draft`. The
   master requirements doc must reach status `approved` first. Use `/define`
   to get there. Fixing broken scaffolding is allowed; features are not.
2. **PRD before code.** Every feature is a PRD in `docs/10-features/` created
   from `FEAT-000-template.md`, linked to master requirement IDs
   (`implements: [REQ-xx]`), and approved by the user before implementation.
3. **TDD always.** No production code without a failing test first. See TDD-RULES.md.
4. **Contract docs win.** Docs marked `status: design-contract` are binding:
   the data model (schema), the copy deck (user-facing strings referenced by
   key), and the design brief (tokens/components). Change the doc first,
   then make code match. Docs marked `status: n/a` (per the project tier set
   in /define) are skipped entirely.
5. **Sync on every change.** Any behavior change must, in the same session,
   update: the feature PRD (criteria, status, `updated`, change history),
   `TEST-MAP.md`, `_PRD-INDEX.md`, and `STATUS.md`. If the change alters
   product scope, also update `01-requirements.md`.
6. **End-of-session handoff.** Rewrite `STATUS.md` (including Built /
   Not yet built / Blocked-on) before finishing, and append to `CHANGELOG.md`,
   so a fresh session resumes with zero conversational context.
7. **Decisions are recorded.** Non-obvious choices go in the decision log in
   `docs/00-foundation/06-decisions-risks-roadmap.md` (or the contract doc's
   own decision log if it has one).

## Repo layout
- `docs/` — Obsidian vault; requirements source of truth.
- `fixtures/import/` — canonical third-party summary + detailed CSV samples.
- App source (Next.js) — to be scaffolded under project root / `src` as decided at first FEAT.
- `tests/` — to be created with first FEAT skeletons.

## Architecture rules (non-negotiable, from docs)
1. **BP is manual-only** — never import blood pressure; no posture field on BP logs. ([[01-requirements]], [[00-overview]])
2. **Health data is account-scoped** — Laura and Demo are isolated; no public signup; Demo seeds empty. ([[01-requirements]], [[03-data-model]], [[04-privacy]])
3. **Canonical timezone is America/New_York** for store and display. ([[03-data-model]])
4. **Manual logs are create + delete only** in v1 (no edit); electrolytes at most once per calendar day until deleted. ([[01-requirements]])
5. **Import = both third-party CSVs** (summary + detailed) every time; **no** native Apple zip/XML in v1; skip duplicates on ingest. ([[01-requirements]], [[03-data-model]])
6. **Calendar shows manual logs only**; imports feed analytics. Charts 1–3 and Lifestyle imported HR come from **detailed** `heart_rate` (or named keys), never summary aggregates. ([[01-requirements]])
7. **No clinician portal, social, or AI diagnosis** — ever for this product scope. ([[01-requirements]])
8. **Stack:** Next.js 16 (App Router) + React + TS + MUI (MD3-oriented) + Turso + Vercel/GitHub; username/password sessions. ([[02-platform]])
9. **Contract docs bind:** data model, copy deck, design brief — change doc first, then code. ([[03-data-model]], [[42-copy-deck]], [[50-design-brief]])

## Commands & environment
- Install: `npm install`
- Run dev: `npm run dev`
- Test suite: `npm test` ← /tdd-cycle and /resume must run
- E2E (Playwright): `npm run test:e2e`
- Lint / typecheck: `npm run lint` / `npm run typecheck` (`next lint` was removed in Next 16; `lint` currently aliases `tsc --noEmit`)
- Build: `npm run build`
- Env: never commit `.env`; Turso URL/token + session secret in Vercel/local only ([[07-credentials]]); see `.env.example`
  - Local/E2E need `SESSION_SECRET` (≥32 chars) and `SEED_PASSWORD_LAURA` / `SEED_PASSWORD_DEMO`

## Conventions
- Package manager: npm (default unless changed at scaffold).
- Copy: reference `docs/40-brand/42-copy-deck.md` keys — never hardcode user-facing strings ad hoc.
- Voice: calm, grounded, curious, direct; address “you”; blunt informative errors ([[40-voice-and-tone]]).

## Slash commands available
- `/define` — set the project tier (lite/standard/full) and interview the user
  to complete the master requirements before any build
- `/resume` — rebuild full context from docs and report state
- `/new-feature` — create a PRD + test skeleton for an approved requirement
- `/tdd-cycle` — run one red→green→refactor loop for the active feature
- `/iterate` — fast test-first loop for small post-build changes (escalates to
  /new-feature if a requirement/criterion would change)
- `/sync-docs` — audit and repair doc/code/test/copy/design drift
- `/checkpoint` — flush all session state to disk now (run before long
  tasks or when context feels full)
- `/ship` — verify green + no drift, roll up changelog, bump version, tag
- `/design-brief` — compile a paste-ready brief for Claude Design
- `/import-design` — ingest a Claude Design handoff and build it via TDD

## Bundled skills (.cursor/skills/) and rules (.cursor/rules/)
- **grill-me** — say "grill me": relentless one-question-at-a-time
  stress-testing of a plan/requirements/PRD before approval; outcomes are
  written into requirements and decision logs.
- **frontend-design** — auto-applies to any UI work: named aesthetic
  direction, tokens-only styling, copy-deck strings, all component states,
  accessibility floor. Defers to design handoffs and 50-design-brief.md.
- **webapp-testing** — browser-level (Playwright) acceptance tests: one E2E
  per primary journey, registered in TEST-MAP, run in /tdd-cycle, /iterate
  (UI changes), and /ship.
- **security-audit** — structured pre-ship security review; critical/high
  findings block /ship and land in STATUS.md + the risks table.
- **rules/write-ahead.md** (always on) — decisions hit disk immediately;
  intent journaled to STATUS "In flight" before multi-step work; the
  session must be killable at any moment without information loss.
- **rules/guardrails.md** (always on) — no silent assumptions, minimum
  viable change, no orthogonal changes, stop at uncertainty.
- **rules/tdd.md** (always on) — the TDD enforcement rules.

Idea capture: append one-liners to docs/10-features/_BACKLOG.md anytime;
triage happens in /define or /new-feature.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

