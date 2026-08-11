Feature request: $ARGUMENTS

0. Gate check: 01-requirements.md must be `approved`. If the request isn't
   covered by existing REQ-IDs, first propose the new/changed requirement
   rows for the user's approval and update 01-requirements.md — the master
   list stays complete before code. If the request matches a _BACKLOG.md
   entry, promote it (and remove it from the backlog).
1. Assign the next FEAT-ID from docs/10-features/_PRD-INDEX.md.
2. Copy FEAT-000-template.md to FEAT-<id>-<slug>.md and fill it in, setting
   `implements:` to the covered REQ-IDs. If the feature has user-facing
   copy, fill the "UX copy" section with keys and add/reuse rows in
   42-copy-deck.md. Ask clarifying questions — do not invent requirements.
3. Add the feature to _PRD-INDEX.md with status `draft`.
4. Create a skeleton test file: one failing test per acceptance criterion
   (marked skipped/todo except the first). Register in TEST-MAP.md.
5. Update STATUS.md, then stop and wait for the user's approval of the PRD
   before implementing. For complex features, offer a "grill me" pass to
   stress-test the PRD before approval. If the feature has significant UI, suggest
   /design-brief as an optional next step before building.
