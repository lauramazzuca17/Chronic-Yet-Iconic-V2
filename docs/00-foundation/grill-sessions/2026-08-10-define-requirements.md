---
type: grill-session
topic: define-requirements
date: 2026-08-10
status: complete
---

# Grill session — 2026-08-10 — Define / 01-requirements

Stress-test of Chronic Yet Iconic V2 master requirements before approval. Outcomes were written into `01-requirements.md`, `03-data-model.md`, `06-decisions-risks-roadmap.md`, `42-copy-deck.md`, and `fixtures/import/` during the session.

## Settled (high signal)

### Clinical / logging
- BP is **manual only** (never imported); no posture field.
- Manual logs: delete-only in v1; electrolytes once/day (block until delete).
- Symptom/med names: fixed seeded catalogs; severity: usual / worse / better than usual.

### Analytics (6 views)
1. **Medication impact** — date + med + HR|BP; X −2h…+2h around take-time; tooltips; HR = manual + detailed `heart_rate`.
2. **BP & HR over time** — Today/7d/30d overlay; Y 50–190; fade/hover; same HR source as (1).
3. **Tachycardia burden** — 7-day bars; % of readings ≥100 bpm; manual + detailed `heart_rate`.
4. **HRV** — line; Today/7d/30d; detailed `hrv_sdnn` only.
5. **Walking HR avg** — line; Today/7d/30d; detailed `walking_heart_rate_avg` only.
6. **Lifestyle cards** — With vs Without electrolytes from first yes-day; Without = not explicitly yes; avg HR/resting/BP(sys/dia)/walking; imported HR from **detailed** only.

### Import
- **No** native Apple `.zip` / XML in v1.
- Third-party date-ranged export: **both** summary + detailed CSV required every import.
- Fixtures: `fixtures/import/health_export_summary_20260810.csv`, `..._detailed_...csv`.
- Calendar = **manual logs only**; imports feed analytics.

### Auth / deploy
- Seeded **Laura** + **Demo**; Demo empty; no public signup; password auth.
- v1: private URL + strong passwords (NFR-05).

### Dashboard
- Today: BP count, latest sys/dia, med count, water oz, symptom count, electrolytes Y/N.

## Deferred (not blocking Define)
- Exact summary-column → DB mapping (import FEAT PRD).
- Max upload size / Vercel body limits (validate with real-sized pair at import FEAT).
- Figma UI — introduce after requirements approval + first FEAT PRD (`/design-brief` / `/import-design`).
- `04-privacy` formal sign-off before broader-than-personal launch.

## Open for owner
- Approve `01-requirements.md` (`working-draft` → `approved`) to open the build gate.

## Recommendation after this grill
Approve requirements → `/new-feature` for first vertical slice → optional Figma with that FEAT → `/tdd-cycle`.
