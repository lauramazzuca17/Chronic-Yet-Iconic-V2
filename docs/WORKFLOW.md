---
type: workflow
status: reference
---
# WORKFLOW — How to run this project

The operating manual for this template. (Prefer plain English? See
[[QUICKSTART]].) Two tools: **Obsidian** (the human's
primary markdown editor, opened on `docs/`) and **Cursor Agent** (pointed at
the project root). The vault is the single source of truth; code and tests
exist to satisfy it, and Cursor keeps everything in sync.

## The two roles

**You (in Obsidian):** write and edit intent — overview, requirements,
platform choices, brand voice, copy, design direction, roadmap. Review and
approve what Cursor Agent drafts. Wikilinks, frontmatter, callouts, and graph view
are the navigation layer.

**Cursor Agent (terminal):** interviews you to complete requirements, drafts
PRDs for approval, implements strictly via TDD, and maintains the index, test
map, copy deck, status, and changelog. Cursor never invents requirements and
never builds ahead of an approved requirement.

---

## Project size tiers

The first thing `/define` asks is the tier. Unused docs get frontmatter
`status: n/a` — they stay in the repo (upgrade the tier anytime by activating
them) and every command skips them.

| | **Lite** | **Standard** | **Full** |
| --- | --- | --- | --- |
| For | CLI tools, scripts, single-purpose utilities | Small apps/tools with a UI, maybe a DB | Real products: users, content, personal data |
| Foundation docs | 00, 01 | + 02, 03 (if data), 06 | + 04, 05, 07 |
| Brand docs | — | 40 voice, 42 copy deck | + 41 messaging |
| Design docs | — | 50 brief (if UI) | 50 brief |
| Always | 10-features, 20-testing, 30-state, WORKFLOW | same | same |
| Typical loop | /iterate for most changes | /new-feature + /iterate mix | /new-feature dominant |

---

## Phase 0 — Setup (once per project)

1. Copy this template as the project root; `git init`.
2. Open `docs/` in Obsidian (as a vault or folder inside your main vault).
3. Fill in the project name in `AGENTS.md`, plus the **Commands &
   environment** section as soon as the stack is chosen.
4. Start Cursor Agent at the project root.

## Phase 1 — Define (no code until this is done)

> [!important] The build gate
> `01-requirements.md` starts `working-draft`; Cursor will not implement
> features until it is `approved`. **A complete list of requirements — every
> functional requirement with an ID and an observable acceptance signal —
> must exist before anything is built.** Incomplete requirements are how
> projects drift and how doc-driven portability breaks.

1. Run **`/define`**. Cursor Agent sets the tier, then interviews you to complete
   the active docs in numeric order. For standard/full it includes a **brand
   pass**: voice-and-tone rules, (full) messaging, and seed copy-deck rows
   for predictable strings, so even the first build ships informative,
   on-brand copy instead of placeholders.
2. Work in passes: Cursor Agent asks → drafts into the docs → you refine in
   Obsidian → Cursor Agent challenges gaps. Any backlog entries get triaged.
   For a harder shakedown, say **"grill me"** — a bundled skill interviews
   you one question at a time (with a recommended answer each) until every
   branch of the plan is resolved, and writes the outcomes into the
   requirements and decision logs.
3. On your confirmation, `01-requirements.md` flips to `approved`, binding
   invariants are copied into AGENTS.md, and the build gate opens.
4. Contract docs (`design-contract` status) are now binding: **data model**
   (schema), **copy deck** (strings by key), **design brief** (tokens &
   components). Changes start in the doc; code follows.

## Phase 2 — Build (the feature loop)

1. **`/new-feature <description or REQ-IDs>`** — Cursor Agent drafts a PRD linked
   to the master requirements, fills its UX-copy keys against the copy deck,
   scaffolds failing/skipped tests, and **stops**.
2. **You review the PRD in Obsidian**; for complex features say
   **"grill me on this PRD"** first to stress-test it. Then approve
   (status → `approved`).
3. Optional for UI-heavy features: **`/design-brief FEAT-xxx`** → paste the
   generated brief into Claude Design (it uses your real copy, not lorem
   ipsum; you can also point Claude Design at this codebase/tokens file) →
   iterate visually → export the handoff bundle → **`/import-design`**.
   Cursor Agent reconciles tokens/copy/requirements, then builds it.
4. **`/tdd-cycle`** (repeat) — one red→green→refactor loop per criterion
   until the feature is `done`, docs updated, changelog appended.
5. Commit small and often.

## Phase 3 — Steady state (iterating from the terminal)

Once the initial build exists, most day-to-day work is terminal-first:

- **Small change (no requirement altered):** **`/iterate <description>`** —
  test-first, minimal doc touch (changelog + status only). Cursor Agent escalates
  to /new-feature automatically if the change would alter an acceptance
  criterion, add a requirement, or touch a contract doc. This is the default
  verb for lite projects.
- **New capability:** amend `01-requirements.md` first (Cursor Agent proposes the
  REQ rows), then the Phase 2 loop.
- **Idea, not now:** one line in `_BACKLOG.md` — triaged later; the master
  list stays honest without blocking momentum.
- **Copy change:** edit the value in `42-copy-deck.md` in Obsidian, then
  `/iterate propagate copy changes`.
- **Bug:** failing regression test first, then fix.
- **Docs hand-edited or things feel off:** **`/sync-docs`**.
- **Release:** **`/ship [patch|minor|major]`** — green suite + drift audit,
  changelog rollup, version bump, tag commands printed.

## Bundled skills — where they fire in the process

The template ships five skills in `.cursor/skills/` plus always-on rules in
`.cursor/rules/`. Cursor activates them automatically; you can also invoke
them by name.

| Skill | Fires when | Process touchpoint |
| --- | --- | --- |
| grill-me | "grill me" / before approvals | Phase 1 requirements, complex PRDs |
| frontend-design | any UI implementation | Phase 2 UI features, /import-design |
| webapp-testing | web UI features | journey E2E tests in /tdd-cycle, /iterate, /ship |
| security-audit | before releases; after auth/data features | blocks /ship on critical findings (standard/full) |
| guardrails (rule) | always | protects /iterate from scope creep and assumptions |

Two of these (frontend design, webapp testing) mirror official Anthropic
skills; the bundled versions are integrated with this template's contract
docs. If you also want Anthropic's maintained originals, install their
skills marketplace per their docs — installed skills coexist with bundled
ones, and the bundled versions defer to your contract docs either way.

## Session handoff & portability (every session)

Preservation is continuous, not just end-of-session: an always-on
write-ahead rule makes Cursor Agent record every approval/decision the moment it
happens and journal its intent to STATUS.md before multi-step work — so
even an abruptly killed session (context limit, crash) leaves docs + git
that fully explain the state, and `/resume` reconciles any uncommitted diff
against the journal. Run **`/checkpoint`** anytime to force a full flush.

Cursor Agent also ends every session by rewriting `30-state/STATUS.md` (phase, active
feature, Built / Not-yet-built + blocked-on, suite results, next actions) and
appending to CHANGELOG. Any new session — new day, new machine, fresh
context — starts with **`/resume`**. The vault *is* the memory; chat history
is never required.

---

## Kickoff examples by tier

### Lite — a CLI tool
> *"A `csvtrim` command-line tool that cleans messy CSV files: strips empty
> rows/columns, normalizes headers, outputs to stdout or a file."*

1. Copy template → `git init` → open `docs/` in Obsidian → start Cursor Agent.
2. `/define` → answer "lite". Interview yields ~8-12 REQ rows, e.g.
   `REQ-01: strip fully-empty rows | signal: given fixture A, output has no
   empty rows`. 02–07, 40s, 50s → `n/a`. Approve.
3. `/new-feature REQ-01 REQ-02 core trimming` → approve PRD → `/tdd-cycle`
   until done. Maybe one more FEAT for file output. Initial build done.
4. From then on it's nearly all terminal: `/iterate add --delimiter flag`,
   `/iterate speed up large files`, `/ship patch`. Voice still matters even
   here — help text and errors follow AGENTS.md tone defaults; activate
   `40-voice-and-tone.md` later if you want it explicit.

### Standard — a small web app
> *"A habit tracker PWA: add habits, check them off daily, see streaks.
> Local-first storage, no accounts."*

1. Setup as above. `/define` → "standard". Interview covers overview,
   full REQ table (entry, check-off, streak math, empty states), 02-platform
   (stack + local-first shape), 03-data-model (habit/checkin entities —
   binding), 06 roadmap, then the brand pass: voice ("encouraging, never
   guilt-tripping"), copy-deck seeds (`streak.empty_state`, `habit.done`),
   and 50-design-brief (aesthetic + tokens file location). Approve.
2. `/new-feature habit CRUD` → approve → `/tdd-cycle`. For the streak screen:
   `/design-brief FEAT-003` → Claude Design → handoff → `/import-design` →
   `/tdd-cycle`.
3. Steady state: `/iterate` for tweaks (UI tweaks re-run the journey's E2E
   test), copy edits in Obsidian + `/iterate propagate`, `/ship minor` when
   a feature lands — which runs the security audit before tagging.

### Full — a real product
> *"A booking site for a tutoring service: browse tutors, book sessions,
> email confirmations, admin panel, real student data."*

1. Setup, then `/define` → "full". Everything activates. Expect multiple
   define passes: 01 requirements + journeys, 02 platform, 03 data model
   with its own decision log, **04-privacy data inventory + required
   decisions (these become blockers — features touching personal data stay
   "not yet built: blocked on 04 approvals")**, 05 release operations,
   06 decisions/owners/phases, 07 credentials tracker, 41 messaging,
   voice + copy deck, design brief. Approve when complete.
2. Build in roadmap phase order; STATUS.md's blocked-on list keeps any
   session from building ahead of an open privacy/legal decision.
3. Steady state adds `/sync-docs` on a cadence and `/ship` per release;
   marketing surfaces (landing, onboarding) draw from 41-messaging so the
   UI explains *why*, not just *what*.

---

## Obsidian conventions used throughout

- **Frontmatter** on every doc (`type`, `status`, `tier`, `updated`,
  `implements`) — Dataview-queryable, Cursor Agent-parseable.
- **Statuses:** `working-draft` → `approved`; `design-contract` = binding;
  `requires-review` = human sign-off needed; `living-document` = continuously
  updated; `n/a` = inactive at this tier (skipped by all commands).
- **Wikilinks** between docs; foundation docs back-link to `[[00-overview]]`.
- **Callouts** (`> [!important]`, `> [!warning]`, `> [!danger]`) mark gates,
  contracts, and safety rules — for you and as strong signals to Cursor Agent.
- **Mermaid** for architecture/ER diagrams; renders in Obsidian, readable by
  Cursor Agent.
- **Never store secrets in the vault** — see [[07-credentials]].

## Quick reference — order of operations

| When | Do |
| --- | --- |
| New project | Setup → `/define` (pick tier) until requirements `approved` |
| Start any session | `/resume` |
| Long task ahead / context filling | `/checkpoint` |
| Build a feature | `/new-feature` → approve PRD → (`/design-brief` → Claude Design → `/import-design`)? → `/tdd-cycle` |
| Small tweak post-build | `/iterate` |
| New idea later | Amend requirements first → `/new-feature` (or park in `_BACKLOG`) |
| Plan feels shaky | Say "grill me" — stress-test before approving |
| Copy change | Edit 42-copy-deck in Obsidian → `/iterate propagate` |
| Edited docs by hand | `/sync-docs` |
| Found a bug | Failing regression test → fix |
| Cut a release | `/ship [patch\|minor\|major]` (runs E2E + security gate) |
| End any session | Cursor Agent rewrites STATUS.md + CHANGELOG.md |
