---
type: quickstart
status: reference
---
# QUICKSTART — the plain-English walkthrough

The no-jargon version of [[WORKFLOW]]. Two workflows: getting a new project
to its first working version, and iterating on it forever after.

---

## Workflow 1 — New project → first working version

**Step 1 — Make your project folder.** Copy this template, rename it to your
project's name, run `git init` inside it. This folder is now the permanent
home of everything: docs, code, and tests.

**Step 2 — Open the docs in Obsidian.** Point Obsidian at the `docs/` folder
(as a vault, or inside your existing vault). Don't fill anything in yet —
Cursor will interview you. Obsidian is simply where *you* read and edit
documents from now on.

**Step 3 — Start Cursor Agent in the folder.** Open a terminal, `cd` into the
project, launch Cursor Agent. It reads `AGENTS.md` automatically and learns
all the rules — including the big one: *it may not build anything until your
requirements are complete and approved.*

**Step 4 — Run `/define` and answer questions.** The most important phase,
and it's just a conversation. Cursor Agent first asks the project size:

- **lite** — a command-line tool or small utility
- **standard** — a small app with a screen people look at
- **full** — a real product with users, content, or personal data

Then it interviews you in plain language: what is this, who's it for, what
exactly must it do? Every capability becomes a numbered requirement (REQ-01,
REQ-02...) with a way to prove it works. For standard/full it also asks how
the product should *sound* (voice, error messages) and *look* (design
direction). Cursor Agent writes answers into the docs; you refine them in
Obsidian. It will push back on gaps — "what happens if the file is empty?" —
which is exactly what you want before code exists. Want a harder shakedown?
Say **"grill me"** and it interrogates the plan one question at a time until
every branch holds up.

**Step 5 — Approve the requirements.** When the list truly covers everything
version one needs, say so. Cursor Agent marks the requirements doc `approved` and
the build gate opens. Resist approving early — a complete list here is what
keeps the whole system in sync forever.

**Step 6 — Build one feature at a time.** Say `/new-feature` plus a
description or REQ numbers. Cursor Agent writes a short spec (a PRD) for that
feature with checkable acceptance criteria, sets up empty failing tests,
then *stops and waits*.

**Step 7 — Approve the spec.** Read the PRD in Obsidian, edit if needed,
tell Cursor Agent it's approved. (Complex feature? "grill me on this PRD" first.)

**Step 8 — Run `/tdd-cycle` until the feature is done.** Each cycle: Cursor Agent
writes a failing test for one criterion, shows it fail, writes the minimum
code to pass, shows it pass, cleans up, checks the box. Web UI features also
get a browser-level test of the full user journey, and visual work follows
the design skill (real design direction, your design tokens, your real copy
— never lorem ipsum). When every box is checked and all tests pass, the
feature is marked done and logged.

*Optional for visual features:* `/design-brief FEAT-xxx` → paste the brief
into Claude Design → play with the visuals there → export the handoff →
`/import-design` → Cursor Agent builds what you designed, still via tests.

**Step 9 — Commit; repeat steps 6–8** until every requirement is covered.
That's version one. Run `/ship` to stamp it v1.0.0 — it verifies everything
is green, runs a security review (standard/full), and tidies the changelog.

**Step 10 — End sessions cleanly.** Cursor Agent rewrites the STATUS doc before
finishing — built, not built, what's next. That file is why you can close
everything and come back cold.

---

## Workflow 2 — Iterating after the first version

**Start any session, ever:** open Cursor Agent in the folder → **`/resume`**.
Cursor reads the status doc, runs the tests, and tells you where things
stand. No memory of past chats needed — the docs *are* the memory.

Then pick the lane:

**Lane A — small tweak** (a flag, formatting, speed, polish):
`/iterate <describe it>`. Test-first, minimal fuss, one changelog line.
Guardrails keep it honest: no scope creep, no touching unrelated code, and
if the "small tweak" secretly changes what the product promises, Cursor Agent
stops and routes you to Lane B on purpose.

**Lane B — genuinely new feature:** describe it. Cursor Agent first proposes new
requirement rows for the master list — you approve those *before* any code —
then it's the same loop as the first build: `/new-feature` → approve PRD →
`/tdd-cycle` (with the optional Claude Design round-trip).

**Lane C — idea for later:** one line in `_BACKLOG.md` (type it in Obsidian
or tell Cursor Agent). It gets triaged next `/define` or `/new-feature`: promote,
defer, or drop.

**Lane D — wording change:** edit the string in the copy deck in Obsidian →
`/iterate propagate copy changes`. The doc is the source of truth; code
follows it.

**Lane E — bug:** report it. Cursor Agent writes a failing test that reproduces
the bug *first*, then fixes it — so it can never silently return.

**Housekeeping:** hand-edited docs or things feel off → `/sync-docs` (audits
everything against everything, repairs with your approval). Ready to
release → `/ship patch|minor|major` (green tests + no drift + security gate,
then version bump and tag). Added auth, payments, or personal data → ask for
a **security audit**; serious findings block shipping until fixed or
explicitly accepted by you.

**Worried about losing your place mid-session?** Say `/checkpoint` — Cursor Agent
writes everything to disk immediately so the session could die that second
with nothing lost. (It also does this continuously by rule; the command is
just belt-and-suspenders before big tasks.)

**End of session:** nothing required from you — Cursor Agent updates STATUS and
CHANGELOG so the next `/resume`, tomorrow or in six months, picks up exactly
where you left off.

---

## The one habit that makes it all work

**Changes to what the product does always land in the docs first** —
requirements before features, specs before code, copy deck before strings,
design brief before pixels. Cursor Agent enforces it; knowing the rule helps you
work with the grain.
