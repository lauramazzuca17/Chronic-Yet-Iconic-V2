---
project: "Chronic Yet Iconic V2"
type: planning
status: living-document
updated: 2026-08-13
---

# Decisions, Risks, and Roadmap

[[00-overview|← Overview]]

## Recommended next move
`/tdd-cycle` FEAT-006 AC-1 (`listManualLogsForDate`).

## Decisions needing an owner
| Decision | Why it matters | Proposed owner | Status |
| --- | --- | --- | --- |
| Privacy doc formal sign-off | `04-privacy` is `requires-review` | Product owner | open |
| Seed usernames (not passwords in vault) | Laura (owner), Demo (test) recorded in 07-credentials | Product owner | settled |

## Decision log (settled)
<!-- Newest first. Claude appends non-obvious technical/product choices here
unless a contract doc carries its own binding log. -->

| Date | Decision | Choice | Rationale |
| --- | --- | --- | --- |
| 2026-08-13 | Design tooling | **No Claude Design** — Figma + `/design-brief` + `/tdd-cycle` | Owner |
| 2026-08-13 | Import UI | Figma `62939:4277`: Upload Files + Import History (Database Summary + Completed/Processing/Failed); Delete → Delete this import?; scroll-behind header like Calendar | Owner |
| 2026-08-13 | Import summary ingest | Persist **all non-BP** summary columns (not chart-subset only) | Owner |
| 2026-08-13 | Import Processing status | In-flight only during request; then Completed/Failed | Owner |
| 2026-08-13 | Import history filename | Display **detailed** CSV filename on batch row | Owner |
| 2026-08-14 | Analytics scope | FEAT-008 covers REQ-16+17+20 (all tabs); Medication Figma first | Owner |
| 2026-08-14 | Analytics charts | **Recharts** | Owner |
| 2026-08-14 | Analytics subtitle | Compare how different factors impact your health over time. (Figma) | Owner |
| 2026-08-14 | Analytics tab labels | Medication / Cardiovascular / Recovery / Electrolytes (Figma) | Owner |
| 2026-08-14 | Medication Chart 1 window | Single America/New_York day via date picker + prev/next (not 7/30 range) | Owner + Figma 62816:27152 |
| 2026-08-14 | Medication multi-dose | Use **most recent** take that day as Dose t=0 (not empty/error) | Owner |
| 2026-08-14 | Chart 2 range UI labels | Today / Last 7 Days / Last 30 Days (Figma) | Owner Figma 62953:4603 |
| 2026-08-14 | Chart 3 Figma + disclaimer | Tachycardia Burden card + Data Disclaimer; threshold ≥ vs > open | Owner Figma 62953:4604 |
| 2026-08-14 | Chart 3 threshold | **≥ 100** bpm (math + UI copy; Figma had `>`) | Owner |
| 2026-08-14 | Chart 4 HRV Figma | Title/helper/range + “What your HRV shows” callout | Owner Figma 62957:4735 |
| 2026-08-14 | Chart 5 walking HR range | **Last 7 Days \| Last 30 Days** only — no Today | Owner Figma 62959:4803 |
| 2026-08-15 | Electrolytes Figma | Full page With/Without cards + metric labels | Owner Figma 62967:5991 |
| 2026-08-14 | Summary metric keys | Store summary columns as `summary_*` keys (not detailed `heart_rate`) so charts stay detailed-only | FEAT-007 AC-3 |
| 2026-08-10 | Active nav style | Icon pill #082E33@80% radius ~16px; label below pill | Design review |
| 2026-08-10 | Home vs Dashboard | Nav label Home; page title Dashboard | Design review |
| 2026-08-10 | App shell chrome | Sticky header + bottom nav #0B4041@80%; sign-out icon; scroll-under on Dashboard/Calendar | Design review |
| 2026-08-10 | Login koi | Lottie on sign-in only; asset public/lottie/koi-fish-color-v2.json | Design review |
| 2026-08-10 | Login submitting | #f08429 at 65% opacity + disabled | Design review |
| 2026-08-10 | UI product name | Chronic Yet Iconic (no V2 in UI); V2 internal only | Design review |
| 2026-08-10 | FEAT-001 viewport | Phone-first; desktop shell out of MVP | Design review |
| 2026-08-10 | Login CTA / error | Sign In; error under button; lilypad on all pages; Main padding for koi | Design review |
| 2026-08-10 | Grill-me Define closed | Outcomes in requirements/data model/fixtures; Figma deferred until after REQ approval + first FEAT | Session end |
| 2026-08-10 | Analytics HR import source | Charts 1–3 + Lifestyle: imported HR from detailed CSV only, never summary | Grill-me |
| 2026-08-10 | Import file pair | Both summary + detailed CSV required every import; no partial import | Grill-me |
| 2026-08-10 | Import path | Third-party summary+detailed CSV only; no native Apple zip/XML in v1 | Grill-me |
| 2026-08-10 | Calendar contents | Manual logs only; imports are for analytics | Grill-me |
| 2026-08-10 | Demo account data | Empty health data at seed (catalogs only) | Grill-me |
| 2026-08-10 | Deploy exposure v1 | Private URL + strong passwords for Laura/Demo; no allowlist required for Define | Grill-me |
| 2026-08-10 | Lifestyle metrics | avg HR = manual+heart_rate_avg; resting; BP = avg sys/avg dia; walking HR avg | Grill-me |
| 2026-08-10 | Lifestyle window/cohorts | Start at first electrolytes-yes day; With=yes; Without=not explicitly yes | Grill-me |
| 2026-08-10 | Lifestyle window | ~~All-time~~ superseded — start at first electrolytes-yes day | Grill-me (revised) |
| 2026-08-10 | Lifestyle v1 | Two comparison cards With vs Without electrolytes (avg HR, resting, BP, walking HR); not a chart | Grill-me |
| 2026-08-10 | Recovery Charts 4–5 | HRV + walking HR avg line charts; Today/7d/30d; Apple Health only | Grill-me |
| 2026-08-10 | Heart Trends Chart 3 value | % of day’s HR readings ≥100 (not raw count) | Grill-me |
| 2026-08-10 | Heart Trends Chart 3 HR sources | Manual BP-log HR + heart_rate_avg only (not resting) | Grill-me |
| 2026-08-10 | Heart Trends Chart 2 | BP+HR overlay; Today/7d/30d; Y 50–190; fade/hover; same sources as Med impact | Grill-me |
| 2026-08-10 | Medication impact HR sources | Manual BP-log HR + Apple Health resting_heart_rate; closest in time within ±15 min | Grill-me |
| 2026-08-10 | Medication impact data sources | BP chart = manual only; HR chart = manual + Apple Health | Grill-me |
| 2026-08-10 | Analytics IA | 4 tabs (Medication, Heart Trends, Recovery, Lifestyle); 6 charts total | Grill-me |
| 2026-08-10 | Medication impact chart | Date + med + HR/BP; −2h…+2h; tooltips sys/dia+time or HR+time | Grill-me |
| 2026-08-10 | Dashboard today summary | BP count; latest BP sys/dia; med count; water oz total; symptom count; electrolytes Y/N | Grill-me |
| 2026-08-10 | Import delete | Batch-delete only (entire ImportBatch); no per-sample delete in v1 | Grill-me |
| 2026-08-10 | Med chart selection | User picks date; that day’s single take of selected med is t=0 | Grill-me |
| 2026-08-10 | Med chart “Dose” label | Means medication **take-time** (t=0), not dosage amount; log still stores name + dose amount + date/time | Grill-me clarification |
| 2026-08-10 | Med chart slot values | Closest manual BP-log within ±15 min of slot; else blank; no interpolation | Grill-me |
| 2026-08-10 | Med chart aggregation | Never average per-dose slots; ≤1 dose of selected med in selected range | Grill-me |
| 2026-08-10 | Med response chart | Med + metric (HR\|BP) dropdowns; X = −2h…+2h around Dose; Y = systolic or HR | Grill-me |
| 2026-08-10 | BP posture | Never include | Grill-me |
| 2026-08-10 | BP source | Manual only; never from Apple Health/import | Grill-me |
| 2026-08-10 | Brand voice | Calm, grounded, curious, direct; address “you”; blunt errors; tagline “Make sense of your health trends” | Owner Define |
| 2026-08-10 | Seed usernames | Laura (owner), Demo (test) | Owner Define |
| 2026-08-10 | Access model | Two seeded accounts only; no public signup | Owner + test; protect real data |
| 2026-08-10 | Account deletion | No whole-account self-delete in v1; delete logs + imports | Owner Define |
| 2026-08-10 | Symptom severity | Usual / Worse than usual / Better than usual | Owner Define |
| 2026-08-12 | Symptom severity UI | **Normal amount** (was Usual amount); storage key still `usual` | Log Figma Frame 2 |
| 2026-08-13 | Water Reset total | Hide in v1 (Figma has control; not REQ-06) | Owner |
| 2026-08-13 | Electrolytes create | **Yes only**; no create-no; absence = not taken | Owner Log Figma |
| 2026-08-13 | Electrolytes blocked copy | Short Figma string (no delete hint in message) | Owner |
| 2026-08-13 | Manual log delete UX | Inline two-step: Delete → Confirm Delete (brand7 `#d95c1c`); no modal | Owner Log Figma |
| 2026-08-10 | Catalogs | Fixed seeded symptom + med lists | Owner Define |
| 2026-08-10 | Timestamps | America/New_York store + display | Owner Define |
| 2026-08-10 | Manual log edits | Delete-only in v1 | Owner Define |
| 2026-08-10 | Import duplicates | Skip | Owner Define |
| 2026-08-10 | Symptom/med names | Catalog dropdowns | Owner Define |
| 2026-08-10 | Stack UI | Next.js + MUI (Option A), Turso, Vercel | Speed for log/calendar/analytics; MD3 via theme; owner host/DB constraints |
| 2026-08-10 | Project tier | full | Personal health product with accounts and sensitive data |

## Delivery sequence
| Phase | Outcome | Exit criteria |
| --- | --- | --- |
| 1. Define | Approved requirements + platform + data decisions | 01-requirements `approved`; owners named; contracts drafted. |
| 2. Foundation | Core scaffolding + first vertical slice under TDD | Foundation FEATs `done`; suite green. |
| 3. Build | Remaining MVP features via /new-feature → /tdd-cycle | All MVP REQ-IDs covered by `done` FEATs. |
| 4. Validate | Ops/accessibility/safety checks; pilot feedback | Launch checklist complete. |
| 5. Launch & learn | Measured rollout | Ops review cadence + retrospective. |

## Risks and controls
| Risk | Control |
| --- | --- |
| Cross-account data leak | Account-scoped queries; tests for REQ-19 / NFR-01 |
| Large Apple Health zip imports | CSV/XML alternate path (NFR-02); size limits decided at import FEAT |
| Public Vercel URL + password-only auth | Strong unique passwords; don’t broadly publish URL; consider Vercel Deployment Protection later if needed |
