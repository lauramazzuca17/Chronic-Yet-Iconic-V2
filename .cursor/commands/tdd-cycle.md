For the feature marked in-progress in STATUS.md:
1. RED: pick the next unmet acceptance criterion, write/unskip its test,
   run it, and show the failure.
2. GREEN: write the minimum code to pass. Run and show it passing.
3. REFACTOR: clean up with the suite green.
4. Update the PRD (check off the criterion), TEST-MAP.md, and STATUS.md.
5. For UI features, ensure the affected journey has/passes its E2E test
   per .cursor/skills/webapp-testing before closing out.
6. If all criteria pass: run the full suite, set the feature to `done` in
   the PRD and _PRD-INDEX.md, move it to "Built" in STATUS.md, append to
   CHANGELOG.md, and summarize.
