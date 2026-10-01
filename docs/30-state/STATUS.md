---
type: status
updated: 2026-10-01
tier: full
---
# Project Status — session handoff

## Current phase
Visual fidelity: **v1 owner-approved** for Home, Log, Import, and Analytics (all four tabs). Calendar visual is built (day cells + 320px picker); Health records Home card stays deferred.

## Active feature
None.

## In flight / uncommitted
- Demo showcase generator still uncommitted from 2026-08-19.

## Built and tested
- **FEAT-001**–**FEAT-009**.
- Visual fidelity + Next.js 16.3.1 + Import hang + Medication Impact iterate + Analytics client-chunk fix (`23765f0`) — on `main`.

## Not yet built
- Health records Home card (deferred).

## Session notes / uncommitted
- Client `charts.tsx` must not value-import `medication-series` / `medication-impact` (those pull Turso stores → Node builtins). Chart 2/3 helpers live in client-safe `cardio-chart.ts`.
- Showcase is **not** part of `seedDatabase`; re-apply with `npm run seed:demo-showcase` if Demo is wiped (script still uncommitted).

## Known local hazards
- No ESLint CLI yet. `next lint` was removed in Next 16; `npm run lint` currently runs `tsc --noEmit`.
- Playwright's dev server shares `.next` with `npm run dev`; running E2E or `next build` while dev is up can 500 the running server. Stop dev first (or give E2E its own `distDir`).
- Remaining `npm audit` findings are **dev-only** (drizzle-kit / vite → esbuild). Do not `audit fix --force` (it wants to *downgrade* drizzle-kit).
- Local `npm run dev` is on **3001** (port 3000 may still be held by an old Node process).

## Next actions
1. Refresh Cardiovascular to check the 7-day arrows slide one day per click.
2. Deploy when ready.

## Test status (2026-10-01)
- Unit: **146 passed** (1 todo).
- Chart 3 7-day window arrows (1-day slide) — tests green; not deployed yet.

## Resolved 2026-10-01
- Chart 3 7-day stacked bars: prev/next arrows slide the window one day (owner: 09/24–09/30 → prev → 09/23–09/29); default last 7 ending yesterday; next disabled on latest window.

## Resolved 2026-08-31
- Chart 3 daily pie below Data Disclaimer: date picker, one day, same 0–69 / 70–84 / 85–95 / 96+ bands. Default day is yesterday.
- Last 7 / Last 30 end yesterday (today excluded — imports aren’t realtime). Chart 3 uses that 7-day window.
- Chart 3 Y-axis showed `001%` (Recharts `unit="%"`); now `100%`. In-bar labels on segments ≥8%.
- Chart 3: first on Cardiovascular; 100% stacked 0–69 / 70–84 / 85–95 / 96+ (owner typed 70-845 → 70–84). Replaces single ≥100 bar.
- Chart 2 Last 7 Days x-axis was per-reading HH:MM; now calendar days spanning the window. Overlay dots removed.

## Resolved 2026-08-18
- Favicon swapped to lotus on lily pad (local, not pushed).
- Vercel deploy of Medication Impact iterate failed: Analytics client bundled `node:fs`. Helpers extracted to `medication-chart.ts` (`23765f0`).
- Medication Impact: empty window copy; date-field calendar; tooltip colon; y-axis min−30/max+30.
- Production Import hung on Start import “Processing” — chunked inserts + error copy (deployed `dc71dd7`).
- Import picker filenames overflowing between Summary/Detailed columns — ellipsis-truncate; owner approved the Import page look.
- Next.js 15 postcss/sharp npm audit highs — upgraded to Next 16.3.1; production audit clean.
- Shared `TakenBadge` — Home and Log electrolytes no longer duplicate the `#efefef` 65px pill.
- Global `box-sizing: border-box` in `tokens.css`.
- Calendar Month/Year at 320px — Year no longer truncates to `2…`.
- Log visual — owner approved BP, Medication, Mood, and Event (all Log form types).
- Analytics Electrolytes tab `62967:5994` — owner approved.
- Analytics Medication / Cardiovascular / Recovery — owner approved for v1.

## Resolved 2026-08-17
- Calendar out-of-month cells: owner confirmed **both** leading and trailing neighbour-month
  days stay greyed `#b3b3b3` (no blank cells). Already the behaviour; now pinned by a test.
- Missing `SYMPTOM 9:05 AM` row: owner confirmed it was their own delete, not the E2E run.
  E2E isolation verified intact (see Test status).
