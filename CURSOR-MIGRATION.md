# Cursor migration notes

This template was converted from the supplied Claude Code TDD starter to Cursor-native project configuration.

- `CLAUDE.md` → `AGENTS.md`
- `.claude/rules/*.md` → `.cursor/rules/*.mdc` with Cursor frontmatter
- `.claude/commands/*.md` → `.cursor/commands/*.md`
- `.claude/skills/*` → `.cursor/skills/*` with the existing SKILL.md frontmatter preserved
- Obsidian docs and their workflow semantics are preserved
- External Claude Design handoff steps remain available where the original workflow used them

Cursor currently supports project rules in `.cursor/rules`, custom slash commands in `.cursor/commands`, and Agent Skills in `.cursor/skills`.
