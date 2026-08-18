---
type: status
updated: 2026-08-18
tier: full
---
# Project Status — session handoff

## Current phase
Visual fidelity: **v1 owner-approved** for Home, Log, Import, and Analytics (all four tabs). Calendar visual is built (day cells + 320px picker); Health records Home card stays deferred.

## Active feature
None. Next: commit local uncommitted visual + Next 16 work when ready.

## In flight / uncommitted
- _(none)_

## Built and tested
- **FEAT-001**–**FEAT-009**.
- **Login visual** — on `main` (`975afb6`).
- **Home visual (local)** — owner said looks good.
- **Import visual (local)** — owner approved (`62939:4277` + filename ellipsis).
- **Log visual (local)** — owner approved all seven form types (Symptom, BP, Medication, Water, Electrolytes, Mood, Event) plus chip strip and Today list.
- **Electrolytes visual `62967:5994` (local)** — owner approved.
- **Analytics visual (local)** — owner approved all four tabs for v1 (Medication, Cardiovascular, Recovery, Electrolytes).
- **Favicon** — owner koi yin-yang PNG at `public/favicon.png`; metadata + `/favicon.ico` rewrite.
- **Next.js 16.3.1** (local, uncommitted) — production `npm audit --omit=dev` is 0; unit suite 119 passed.
- **TakenBadge** — Home + Log electrolytes share `src/components/TakenBadge.tsx` (`#efefef` 65px pill).
- **Global border-box** — `tokens.css` `* { box-sizing: border-box }`.
- **Calendar picker 320px** — compact chevrons + Year min 92px so the year cannot become `2…`.

## Not yet built
- Health records Home card (deferred).

## Session notes / uncommitted
- **Next.js 16.3.1** — React 19.2.8; `src/proxy.ts` replaces middleware; MUI `v16-appRouter`. Owner restarted `npm run dev` and confirmed 16.3.1.
- **Electrolytes visual `62967:5994`** — 28/36 black title + 56×54 drink hero; With/Without cards as 2×2 metric grid with Figma pastel tiles. Owner approved.

- Home + Log visual + favicon PNG + Log nav — local, uncommitted.
- **Analytics visual** — chips `62923:4123` (brand8 selected / brand2 idle / brand5 strip); Medication card `62819:29845`; Cardiovascular / Recovery / Electrolytes. Owner approved all four tabs for v1.
- **Favicon** — `public/favicon.png` copied from owner attachment (koi yin-yang on black).
- **Log layout:** shell viewport lock (no document scroll); header background `300ms` transition; symptom notes single-line (Figma); compact spacing when Today empty; sticky chip strip opaque brand3 so scrolled entries are clipped behind it.
- **Log Water form** (`62906:2164`) — `#efefef` Today's Total pill (132px, 24/26 semibold) beside Add Ounces; Reset total still hidden per v1 lock.
- **Log Electrolytes forms** — not taken (`62907:5537`) shows Taken pill + `x-square` + CTA; taken (`62907:2282`) shows `check-square`, disabled `#fafafa` Date & Time, and the black 12/18 notice **instead of** the CTA.
- **E2E isolation fix** — `playwright.config.ts` blanks `TURSO_*` + sets `CYI_LOCAL_DB_PATH=.data/e2e.db`. Suite is green (10/10) and no longer touches live Turso data or account password hashes.
- **Calendar card overflow fixed** — card shell moved to `src/calendar/layout.ts` with `boxSizing: border-box`; month card + day list were `width:100%` on a content-box with 16px padding, so both ran 16px past the right edge. Verified 0 overflowing elements at 320 / 390 / 430px.
- **Calendar day cells** (`62888:11530` / `62888:11531`) — `CALENDAR_DAY` tokens: 40×40 visual radius 8 inside a 44px tap target; selected `#f08429` + `#f5f5f5`; in-month `#1e1e1e`, out-of-month `#b3b3b3`, weekday `#757575` 12/20. **Today is now the underlined number** (plus `aria-current="date"`), replacing the teal `borderBottom` that had drifted from the brief. Grid is 7×40 + 6×1px = 286px centered, capped so 320px shrinks cells instead of overflowing. Verified live at 390 and 320px.
- **Calendar month card top pad** — `pt` 24px (was 16) so floating Month/Year labels sit 17px off the card edge instead of 9px.
- **Calendar entry cards** now reuse Log's `LogEntryCard` (`62811:25282`); eyebrow `SYMPTOM  8:12 AM`, 8px radius, 12/8 pad, same Delete / Confirm Delete. `data-testid="calendar-entry"` preserved for E2E.

## Known local hazards
- No ESLint CLI yet. `next lint` was removed in Next 16; `npm run lint` currently runs `tsc --noEmit`.
- Playwright's dev server shares `.next` with `npm run dev`; running E2E or `next build` while dev is up can 500 the running server. Stop dev first (or give E2E its own `distDir`).
- Remaining `npm audit` findings are **dev-only** (drizzle-kit / vite → esbuild). Do not `audit fix --force` (it wants to *downgrade* drizzle-kit).

## Next actions
1. Commit local uncommitted visual + Next 16 work when ready.

## Test status (2026-08-18)
- Unit: **123 passed** (1 todo) on Next 16.3.1.
- Production `npm audit --omit=dev`: **0**.
- E2E / full `next build` not re-run this pass (`.next` collision with `npm run dev`).

## Resolved 2026-08-18
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
