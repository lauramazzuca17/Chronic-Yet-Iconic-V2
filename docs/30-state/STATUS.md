---
type: status
updated: 2026-08-18
tier: full
---
# Project Status — session handoff

## Current phase
Visual fidelity: **v1 owner-approved** for Home, Log, Import, and Analytics (all four tabs). Calendar visual is built (day cells + 320px picker); Health records Home card stays deferred.

## Active feature
None.

## In flight / uncommitted
- Vercel `2b13c28` build fix: client chart helpers in `src/analytics/medication-chart.ts` so Analytics does not bundle `node:fs`. Needs commit/push.

## Built and tested
- **FEAT-001**–**FEAT-009**.
- Visual fidelity + Next.js 16.3.1 + Import hang fix — on `main`.
- **Medication Impact iterate** — on `main` (`2b13c28`); Vercel build failed until this client-chunk fix.
- **Analytics client-safe helpers (local)** — `medication-chart.ts`; unit 131 passed.

## Not yet built
- Health records Home card (deferred).

## Session notes / uncommitted
- Client `charts.tsx` must not value-import `medication-series` / `medication-impact` (those pull Turso stores → Node builtins). Same class of bug as the earlier `node:crypto` client break.

## Known local hazards
- No ESLint CLI yet. `next lint` was removed in Next 16; `npm run lint` currently runs `tsc --noEmit`.
- Playwright's dev server shares `.next` with `npm run dev`; running E2E or `next build` while dev is up can 500 the running server. Stop dev first (or give E2E its own `distDir`).
- Remaining `npm audit` findings are **dev-only** (drizzle-kit / vite → esbuild). Do not `audit fix --force` (it wants to *downgrade* drizzle-kit).

## Next actions
1. Commit + push the Analytics `node:fs` client-chunk fix so Vercel can deploy `2b13c28`’s Medication Impact work.

## Test status (2026-08-18)
- Unit: **131 passed** (1 todo).
- Production `npm audit --omit=dev`: **0**.
- E2E / full `next build` not re-run locally this pass (`.next` collision with `npm run dev`).

## Resolved 2026-08-18
- Vercel deploy of Medication Impact iterate failed: Analytics client bundled `node:fs`. Helpers extracted to `medication-chart.ts` (local, not pushed).
- Medication Impact: empty window copy; date-field calendar; tooltip colon; y-axis min−30/max+30. New koi favicon.
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
