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
- Import hang fix (local, not on Vercel yet): chunked Turso inserts (100/row), `import.failed` if the request dies, server-action body 4mb.

## Built and tested
- **FEAT-001**–**FEAT-009**.
- Visual fidelity (Home, Log, Import, Analytics) + Next.js 16.3.1 — on `main` (`ef9a060`), deployed.
- **Import hang fix (local)** — samples insert in chunks of 100; Start import recovers with `import.failed` instead of spinning; body limit 4mb. Unit suite 127 passed.

## Not yet built
- Health records Home card (deferred).

## Session notes / uncommitted
- Production Import hung on “Processing” (~4 min): one Turso round-trip per sample + no try/finally on the client action. Fix is local; needs commit/push to reach Vercel.
- Vercel request bodies cap ~4.5mb. Exports larger than **4mb** (typical long-range detailed CSVs) still will not ingest — use a shorter date range in My Health Export.

## Known local hazards
- No ESLint CLI yet. `next lint` was removed in Next 16; `npm run lint` currently runs `tsc --noEmit`.
- Playwright's dev server shares `.next` with `npm run dev`; running E2E or `next build` while dev is up can 500 the running server. Stop dev first (or give E2E its own `distDir`).
- Remaining `npm audit` findings are **dev-only** (drizzle-kit / vite → esbuild). Do not `audit fix --force` (it wants to *downgrade* drizzle-kit).

## Next actions
1. Commit + push the Import hang fix so production picks it up.
2. Retry Import with a shorter date range if the pair is larger than ~4mb.

## Test status (2026-08-18)
- Unit: **127 passed** (1 todo) on Next 16.3.1.
- Production `npm audit --omit=dev`: **0**.
- E2E / full `next build` not re-run this pass (`.next` collision with `npm run dev`).

## Resolved 2026-08-18
- Production Import hung on Start import “Processing” — chunked inserts + error copy (local; not deployed yet).
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
