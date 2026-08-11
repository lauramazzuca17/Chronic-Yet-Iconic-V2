1. Run the full test suite; abort with a report if anything fails.
2. Run /sync-docs checks in audit-only mode; abort if drift is found, and
   list it. For UI projects, the green check in step 1 includes the E2E
   suite (see .cursor/skills/webapp-testing).
2b. Security gate (standard/full tiers): run the security-audit skill.
   Critical/high findings block the release unless the user explicitly
   accepts them in the decision log.
3. Determine the next version from $ARGUMENTS (default: patch) and the
   project's version file(s) — update them.
4. Roll up unreleased CHANGELOG.md lines under a new "## vX.Y.Z — YYYY-MM-DD"
   heading.
5. Update STATUS.md (phase/next actions), then print the exact git commands
   to commit and tag (do not push without being asked).
