Run the Define phase. Do not write any application code during /define.

1. First question — project size tier (record it in 00-overview frontmatter
   as `tier:` and in STATUS.md):
   - **lite** — CLI tool, script, or single-purpose utility. Active docs:
     00-overview (short), 01-requirements, 20-testing, 30-state. Set every
     other doc's frontmatter status to `n/a` (they stay in the repo and can
     be upgraded later).
   - **standard** — small app/tool with a UI and possibly persistent data.
     Adds: 02-platform, 03-data-model (if data), 06-decisions-risks-roadmap,
     40-voice-and-tone, 42-copy-deck, 50-design-brief (if UI).
   - **full** — a real product with users, content, or personal data.
     Everything, including 04-privacy, 05-operations, 07-credentials,
     41-messaging.
2. Read every ACTIVE doc. List what is filled in, placeholder, or contradictory.
3. Interview the user, a few questions at a time, completing active docs in
   numeric order. For standard/full, include a brand pass (voice-and-tone,
   messaging, seed copy-deck entries for predictable strings: app name,
   tagline, common errors, empty states).
4. Triage docs/10-features/_BACKLOG.md if it has entries: promote to REQ
   rows, defer, or drop — user decides.
5. Draft the docs from answers. Never invent requirements — ask. Defer open
   items to the decision table in 06 (or STATUS.md blockers for lite).
6. Challenge gaps: missing journeys, unstated edge cases, untestable
   requirements (every REQ needs an observable acceptance signal).
7. Before approval, offer a "grill me" pass (see .cursor/skills/grill-me)
   to stress-test the requirements one question at a time.
8. When the user confirms the list is complete, set 01-requirements.md to
   `approved` with date, copy binding invariants into AGENTS.md
   "Architecture rules", update STATUS.md, and report the build gate open.
