---
project: "Chronic Yet Iconic V2"
type: copy-deck
status: design-contract
updated: 2026-08-10
---
# Copy Deck — canonical user-facing strings

[[40-voice-and-tone|← Voice and tone]]

> [!important] This document is a design contract
> Every user-facing string in the product traces to a key here. Code
> references strings by key (constants file, i18n table, or equivalent named
> in Platform doc). To change copy: edit the value here in Obsidian, then
> tell Claude (or run /iterate) to propagate. /sync-docs audits drift both
> directions. Claude adds rows when features introduce new strings.

**Key convention:** `area.surface.slug` (e.g. `auth.login.error_generic`,
`cli.help.description`, `export.empty_state.body`).

| Key | String | Context / constraints |
| --- | --- | --- |
| app.name | Chronic Yet Iconic | User-facing product name (UI, login wordmark) |
| app.name.internal | Chronic Yet Iconic V2 | Repo / docs / internal only — not shown in UI |
| app.tagline | Make sense of your health trends | ≤ 8 words |
| common.error_generic | Couldn’t finish that. Try again. | Blunt; never blames user |
| common.empty_state | Nothing here yet. Log a reading or import Health data. | Why empty + first action |
| auth.login.title | Sign In | Optional page title if used; login frame uses wordmark |
| auth.login.submit | Sign In | Matches Figma CTA |
| auth.login.error_invalid | Username or password is wrong. | Blunt; below Sign In button (Figma error frame) |
| auth.field.username | Username | Outlined field label |
| auth.field.password | Password | Outlined field label |
| auth.logout | Sign out | |
| nav.home | Home | Bottom nav label for the Dashboard route (short) |
| nav.log | Log | |
| nav.calendar | Calendar | |
| nav.analytics | Analytics | |
| nav.import | Import | |
| shell.eyebrow | Chronic Yet Iconic | Header eyebrow on all signed-in pages (uppercase in UI) |
| shell.title.dashboard | Dashboard | Page title for Home/Dashboard route |
| shell.title.log | Log | |
| shell.title.calendar | Calendar | |
| shell.title.analytics | Analytics | |
| shell.title.import | Import | |
| shell.placeholder.body | This section is next. | Placeholder routes until their FEATs |
| shell.subtitle.dashboard | Your day at a glance. | Draft — refine with owner |
| shell.subtitle.log | Capture readings and notes. | Draft — refine with owner |
| shell.subtitle.calendar | Review what you logged. | Draft — refine with owner |
| shell.subtitle.analytics | See trends and relationships. | Draft — refine with owner |
| shell.subtitle.import | Bring in Health export files. | Draft — refine with owner |
| dashboard.empty | No stats for today yet. Add a log or import data. | |
| log.save_success | Saved. | Quiet confirmation |
| log.delete_confirm | Delete this entry? It can’t be undone. | Destructive |
| log.electrolytes.blocked | Electrolytes already logged for today. Delete that entry to change it. | |
| import.success | Import finished — {count} new samples. | `{count}` = integer |
| import.duplicate_skipped | Skipped {count} duplicates. | |
| import.pair_required | Upload both the summary and detailed CSV files. | |
| import.error_missing_pair | Need both summary and detailed CSV files. | Blunt |
| import.delete_confirm | Delete this import? All samples from that upload will be removed. It can’t be undone. | Batch delete |

## Placeholders & formatting rules
- Variables use `{name}` (e.g. `{count}`).
- Buttons: title/sentence case per key (“Sign In”, “Delete entry”).
- No emoji in product strings unless explicitly added later.
- Severity UI labels (not keys yet until log FEAT): Usual amount / Worse than usual / Better than usual.
- Mood UI labels: Awful / Not great / Okay / Good / Great.
