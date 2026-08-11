Input: $ARGUMENTS

1. Move/confirm the handoff bundle under docs/50-design/handoffs/<feature>/.
2. Read it fully. Extract: screens/flows, components, tokens, interaction
   notes, and any design intent text.
3. Reconcile contracts BEFORE coding:
   - Tokens: diff against the project's single tokens source named in
     50-design-brief.md; propose updates to the brief + tokens file.
   - Copy: diff strings against 42-copy-deck.md; the deck wins — flag
     mismatches for the user instead of silently adopting handoff copy.
   - Requirements: if the design implies behavior not in the FEAT PRD,
     propose PRD/REQ amendments and wait for approval.
4. Implement through the normal loop: update the FEAT PRD's technical
   notes/UX copy section, then /tdd-cycle per criterion. Visual-only details
   that can't be unit-tested get a manual-check row in TEST-MAP exemptions.
5. Update STATUS.md and CHANGELOG.md as usual.
