---
project: "Chronic Yet Iconic V2"
type: voice-and-tone
status: working-draft
updated: 2026-08-10
---
# Voice and Tone

[[../00-foundation/00-overview|← Overview]]

> [!note] Why this exists
> Claude writes user-facing copy constantly — errors, empty states,
> onboarding, labels, CLI help text. This doc keeps all of it sounding like
> one product instead of generic filler. It applies to EVERY generated
> string, including log/error output for terminal tools.

## Personality
**Calm, grounded, curious, direct** — a clear personal health notebook, not a cheerleader and not a clinical lecture.

## Voice rules
- Reading level / sentence length: plain language; short sentences preferred.
- Person & address: **you** (second person).
- Humor: rare; never about symptoms, syncope, or medication failure.
- How errors sound: **blunt and informative** — say what failed and what to do next; never blame the user.
- How empty states sound: explain why it’s empty and the first action (e.g. log a reading or import data).

## Vocabulary
| Say | Don't say | Why |
| --- | --- | --- |
| reading / log / entry | “vitals event” jargon | Clear |
| couldn’t save / import failed | “oopsie” / vague “something went wrong” alone | Blunt + informative |
| trends / relationship | “AI insights” / “diagnosis” | No AI diagnosis; stay observational |
| you | we (except rare product-name voice) | Address rule |

## Tone by context
| Context | Tone shift |
| --- | --- |
| Onboarding / first run | Calm, direct: what the app is for in one breath |
| Errors & failures | Blunt + next step |
| Success / completion | Quiet confirmation (“Saved.” / “Import finished — N new samples.”) |
| Destructive confirmations | Direct: what will be deleted; no scare theater |
