# Cursor TDD Starter (Obsidian-driven)

A generalized project template for building with **Cursor Agent + Obsidian + test-driven development**. The `docs/` directory is the single source of truth; Cursor uses the project rules, commands, and skills in `.cursor/` to keep requirements, PRDs, tests, copy, design, status, and changelog synchronized.

## Start here
1. Unzip this folder.
2. Open the folder in Cursor.
3. Open `docs/` in Obsidian (as a vault or folder inside your vault).
4. In Cursor Agent, run `/define`.
5. Follow the workflow: approved requirements → approved PRD → `/tdd-cycle` → documentation sync → release.

## Cursor-native setup
- `AGENTS.md` — persistent project instructions and session protocol.
- `.cursor/rules/*.mdc` — project rules; the TDD, guardrail, write-ahead, and project-memory rules are always applied.
- `.cursor/commands/*.md` — reusable slash-command workflows such as `/define`, `/resume`, `/new-feature`, `/tdd-cycle`, `/iterate`, `/sync-docs`, `/checkpoint`, `/ship`, `/design-brief`, and `/import-design`.
- `.cursor/skills/*/SKILL.md` — specialized skills for security auditing, requirements grilling, frontend design, and browser-level testing.
- `docs/` — Obsidian vault and product source of truth.

Cursor recognizes project rules from `.cursor/rules` and custom commands from `.cursor/commands`; Agent Skills are also supported from `.cursor/skills`.

## The core rule
**Do not build ahead of the approved requirements.** Every behavior change must be test-first and must leave the docs, tests, and status in sync.

## If you are starting a real project
Run `/define` first. Do not start implementation until `docs/00-foundation/01-requirements.md` is marked `approved`.

## If you are returning to an existing project
Run `/resume`. It reconstructs context from disk, checks the current status, reconciles unexplained git changes, and runs the configured test suite before recommending the next action.

## Obsidian remains the human-facing source of truth
Use Obsidian to review and edit requirements, PRDs, design contracts, copy, decisions, roadmap, and status. Cursor Agent is the implementation partner. Chat history is not required for continuity.
