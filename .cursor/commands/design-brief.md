Target: $ARGUMENTS (default: the in-progress feature in STATUS.md).

1. Gather: 00-overview (what/who), 41-messaging (positioning, audience) if
   active, 40-voice-and-tone, 50-design-brief (aesthetic direction, tokens,
   components, accessibility rules), the target FEAT PRD (journeys +
   acceptance criteria), and the relevant 42-copy-deck strings.
2. Compose ONE self-contained markdown brief (no wikilinks, no repo paths —
   it must stand alone when pasted into Claude Design): product summary,
   audience & tone, the flow/screens to design, real copy strings to use
   (never lorem ipsum), design-system constraints, accessibility
   requirements, and what "done" looks like per acceptance criterion.
3. Save it to docs/50-design/briefs/<target>-brief.md and print it in full
   for copy/paste. Remind the user: in Claude Design they can also point it
   at this codebase/tokens file so outputs match the real product.
