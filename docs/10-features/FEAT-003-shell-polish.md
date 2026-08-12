---
id: FEAT-003
type: prd
status: done
implements: [NFR-06]
depends_on: [FEAT-001, FEAT-002]
tests: [tests/feat-003-shell-polish.test.ts, e2e/feat-003-shell-nav-journey.spec.ts]
created: 2026-08-11
updated: 2026-08-11
---
# FEAT-003 — App shell polish (phone-first chrome)

[[_PRD-INDEX|← Feature index]] · Implements: [[01-requirements|NFR-06]] · Depends: [[FEAT-001-auth-shell]], [[FEAT-002-signin-ui-cookies]]

## Problem / user story
As a signed-in user on my phone, I want the app chrome (header, titles, bottom nav) to match the reviewed Figma shell so I can move between Home, Log, Calendar, Analytics, and Import with clear hierarchy and the designed scroll/active states.

## Acceptance criteria
- [x] AC-1: Authenticated shell shows a **bottom nav** with five items labeled Home, Log, Calendar, Analytics, Import (`nav.*` keys); bar fill `#0B4041` @ 80% opacity.
- [x] AC-2: The **active** route’s nav icon sits in a pill `#082E33` @ 80% opacity (~16px radius); label remains below the pill; inactive items have no pill.
- [x] AC-3: Header on every shell page shows eyebrow `shell.eyebrow` (uppercase), page **title** (`shell.title.*`), page **subtitle** (`shell.subtitle.*`), and orange **Sign out** icon control (`auth.logout` accessible name).
- [x] AC-4: When main content scrolls under the header (esp. long placeholder/content), header becomes sticky with fill `#0B4041` @ 80% opacity.
- [x] AC-5: Each bottom-nav target navigates to `/`, `/log`, `/calendar`, `/analytics`, `/import` respectively (Home → `/` with title Dashboard).
- [x] AC-6: Shell layout remains **phone-first** (no dedicated desktop/wide shell layout in this FEAT).
- [x] AC-7: Playwright: signed-in user sees bottom nav, can open Log via nav, sees Log title; Sign out still works.

## Out of scope
- Dashboard summary data (REQ-01) — still placeholder body.
- Full pixel audit of every Figma spacing token beyond the locked chrome rules above.
- Desktop / wide-layout shell.
- Replacing CSS pond with a lilypad raster (optional later asset).
- Changing auth/cookie behavior (FEAT-002).

## Assumptions (say if wrong before approve)
1. **Design source:** existing FEAT-001 shell Figma frames / `docs/50-design/briefs/FEAT-001-brief.md` — no new `/design-brief` unless you want a refresh.
2. **Subtitles:** use current draft `shell.subtitle.*` strings (refine later via copy deck without blocking).
3. **NFR-06** added to master requirements with this FEAT — approving FEAT-003 approves that NFR row.
4. Icons: simple, accessible SVG/MUI icons sufficient if they match structure (pill + label); exact Figma icon glyphs can refine later.

## UX copy
| Key | New or reused |
| --- | --- |
| shell.eyebrow | reused |
| shell.title.* | reused |
| shell.subtitle.* | reused (drafts) |
| nav.home / log / calendar / analytics / import | reused |
| auth.logout | reused |
| shell.placeholder.body | reused |

## Technical notes
- Extend `src/app/(shell)/layout.tsx` (and related components); reuse `getAppShellNav` / `getShellPageTitle` from FEAT-001.
- Client component(s) for scroll detection (header glass) and active pathname (nav pill).
- Tokens from design brief — prefer CSS variables / shared theme constants, not scattered magic if expanding.
- Tests: Vitest for nav config/active-state helpers + scroll-header state helper; Playwright for AC-7.
- Keep phone-first: max content width / viewport assumptions per brief; no new desktop breakpoints required.

## Change history
| Date | Change | Why |
| --- | --- | --- |
| 2026-08-11 | Draft PRD for shell polish; NFR-06 proposed | /new-feature |
| 2026-08-11 | PRD + NFR-06 approved | Owner |
| 2026-08-11 | AC-1 green: `getBottomNavChrome` five labels + bar `rgba(11,64,65,0.8)` | /tdd-cycle |
| 2026-08-11 | AC-2 green: `getActiveNavItemChrome` pill `rgba(8,46,51,0.8)` / 16px | /tdd-cycle |
| 2026-08-11 | AC-3 green: `getShellHeaderChrome` eyebrow/title/subtitle/Sign out | /tdd-cycle |
| 2026-08-11 | AC-4 green: `getScrolledHeaderChrome` transparent → bar fill when scrolled | /tdd-cycle |
| 2026-08-11 | AC-5 green: `getShellNavRoutes` Home→`/` title Dashboard + siblings | /tdd-cycle |
| 2026-08-11 | AC-6 green: `getPhoneFirstShellLayout` max 430px; no desktop/wide shell | /tdd-cycle |
| 2026-08-11 | AC-7 green: ShellChrome UI + Playwright nav/Log/sign-out; FEAT-003 done | /tdd-cycle |
