---
type: test-map
updated: 2026-08-18
---
# Test Map — acceptance criteria ↔ tests

<!-- Claude: update whenever tests are added, renamed, or removed. -->

| Feature | Criterion | Test file | Test name | Status |
| --- | --- | --- | --- | --- |
| Login visual | Layout tokens | tests/login-visual-fidelity.test.ts | layout: fluid card uses 38px side margins (not fixed 314px width) | ✅ passing |
| Login visual | Pond asset | tests/login-visual-fidelity.test.ts | layout: pond background asset path exists under public/ | ✅ passing |
| Login visual | Card/CTA/wordmark | tests/login-visual-fidelity.test.ts | layout: card radius, padding, stack, koi, and CTA match brief | ✅ passing |
| Home visual | 16px gutters | tests/home-visual-layout.test.ts | shell content gutter is 16px (Figma Home, not login 38px) | ✅ passing |
| Home visual | Nav/logout icons | tests/home-visual-layout.test.ts | nav and sign-out Figma icons exist under public/icons | ✅ passing |
| Shared UI | TakenBadge | tests/taken-badge.test.ts | Home + Log electrolytes import one `#efefef` 65px Taken pill (`TAKEN_BADGE`) | ✅ passing |
| Log visual | Chips | tests/log-visual-layout.test.ts | chip strip: orange selected, white unselected, horizontal scroll tokens | ✅ passing |
| Log visual | Cards | tests/log-visual-layout.test.ts | form/today cards: py 18; fields use outlined filled-state type tokens | ✅ passing |
| Log visual | Entry card | tests/log-entry-display.test.ts | eyebrow time AM/PM, summary lines match Figma `62811:25282` | ✅ passing |
| Log visual | Chip strip fill | tests/log-visual-layout.test.ts | chip strip is opaque brand3 so scrolled entries are clipped behind it | ✅ passing |
| Log visual | Stat pill | tests/log-visual-layout.test.ts | `#efefef` pill tokens shared by Water total (132px, 24/26 semibold) and Electrolytes Taken (65px) | ✅ passing |
| Log visual | Electrolytes taken | tests/log-visual-layout.test.ts | disabled field `#fafafa` / `#79747e` + black 12/18 notice tokens (`62907:2282`) | ✅ passing |
| Log visual | Taken icons | tests/log-visual-layout.test.ts | `x-square.svg` / `check-square.svg` Figma assets exist for the Taken pill | ✅ passing |
| Calendar visual | Card gutters | tests/calendar-visual-layout.test.ts | month card + day list are border-box so `width:100%` keeps the 16px side gutters (overflow regression) | ✅ passing |
| Global layout | box-sizing | tests/calendar-visual-layout.test.ts | `tokens.css` sets `box-sizing: border-box` on `*`, `*::before`, `*::after` | ✅ passing |
| Calendar visual | Card shell | tests/calendar-visual-layout.test.ts | radius 20, white fill, Figma two-layer shadow | ✅ passing |
| Calendar visual | Day states | tests/calendar-visual-layout.test.ts | selected = brand6 40px square radius 8 / `#f5f5f5`; today = underlined number (`62888:11530`, `62888:11531`) | ✅ passing |
| Calendar visual | Day hit target | tests/calendar-visual-layout.test.ts | 40px Figma visual keeps a 44px tap target around it | ✅ passing |
| Calendar visual | Out-of-month cells | tests/calendar-visual-layout.test.ts | leading **and** trailing neighbour-month days render greyed `#b3b3b3` numbers, never blanks (owner-confirmed) | ✅ passing |
| Calendar visual | Month card top pad | tests/calendar-visual-layout.test.ts | month card `pt` 24px (vs 16px sides) so floating Month/Year labels aren't cramped against the card edge | ✅ passing |
| Calendar visual | Picker at 320px | tests/calendar-visual-layout.test.ts | Compact chevrons + Year min 92px so the year cannot truncate to `2…` | ✅ passing |
| Calendar visual | Shared entry card | tests/calendar-visual-layout.test.ts | Calendar day list imports `LogEntryCard` (same Figma `62811:25282` card as Log's Today list) | ✅ passing |
| Calendar visual | Weekday header | tests/calendar-visual-layout.test.ts | weekday labels use `#757575` at 12px | ✅ passing |
| Analytics visual | Chip strip | tests/analytics-visual-layout.test.ts | brand8 selected `#839755` / brand2 idle `#0b4041` / brand5 strip `#082e33` (`62923:4123`) | ✅ passing |
| Analytics visual | Main fill | tests/analytics-visual-layout.test.ts | Analytics Main is brand5 `#082e33` (ShellChrome + tokens) | ✅ passing |
| Analytics visual | Medication card | tests/analytics-visual-layout.test.ts | card 10/16/26; date control `62948:2214` white 31.5px caps + white center, glyphs at intrinsic size; pill selects max 122×32 with 10×5 caret; chart frame 180 dashed | ✅ passing |
| Analytics visual | Control icons | tests/analytics-visual-layout.test.ts | Figma chevron/calendar/select assets exist under public/icons | ✅ passing |
| Analytics visual | Screen wiring | tests/analytics-visual-layout.test.ts | AnalyticsScreen uses ANALYTICS_CHIP / CARD / DATE_CONTROL / PILL_SELECT / CARDIO / DISCLAIMER / ELECTROLYTES | ✅ passing |
| Analytics visual | Cardio range switch | tests/analytics-visual-layout.test.ts | Switch Group `62953:4603`: brand2 selected, white idle, 4px pad, `#d1d1d6` stroke | ✅ passing |
| Analytics visual | Tachycardia disclaimer | tests/analytics-visual-layout.test.ts | Disclaimer `62953:4604`: `#f2f5ed`, brand4 title, 16px circle-exclamation | ✅ passing |
| Analytics visual | Recovery cards | tests/analytics-visual-layout.test.ts | HRV `62957:4735` + Walking `62959:4803`: 16px card rhythm; HRV info reuses sage SageCallout | ✅ passing |
| Analytics visual | Electrolytes tab | tests/analytics-visual-layout.test.ts | Electrolytes `62967:5994`: 28/36 black title, drink hero 56×54, With/Without 2×2 metric grid + Figma icons | ✅ passing |
| Import visual | Cards + summary | tests/import-visual-layout.test.ts | Upload radius 8 / History radius 12; sage Database Summary + 18×24 file-waveform (`62946:4425`) | ✅ passing |
| Import visual | Screen wiring | tests/import-visual-layout.test.ts | ImportScreen uses IMPORT tokens; compact Choose File / Start import (not 44px visual) | ✅ passing |
| Import visual | Filename overflow | tests/import-visual-layout.test.ts | Chosen Summary/Detailed names ellipsis-truncate (`IMPORT.filename`); full name on `title` | ✅ passing |
| Shell visual | Favicon | tests/log-visual-layout.test.ts | `public/favicon.png` (owner lotus on lily pad, black background) exists | ✅ passing |
| FEAT-003 | Header layout | tests/feat-003-shell-polish.test.ts | header layout: Figma type sizes, 16px gutter, logout icon asset | ✅ passing |
| FEAT-003 | Nav layout | tests/feat-003-shell-polish.test.ts | nav layout: 64px bar and label medium tokens | ✅ passing |
| FEAT-003 | Nav fixed | tests/feat-003-shell-polish.test.ts | nav layout: fixed bar so Log (and siblings) stay tappable | ✅ passing |
| FEAT-001 | AC-1 | tests/feat-001-auth-shell.test.ts | AC-1: unauthenticated access to protected routes is blocked | ✅ passing |
| FEAT-001 | AC-2 | tests/feat-001-auth-shell.test.ts | AC-2: Laura can sign in with valid credentials | ✅ passing |
| FEAT-001 | AC-3 | tests/feat-001-auth-shell.test.ts | AC-3: Demo can sign in with valid credentials | ✅ passing |
| FEAT-001 | AC-4 | tests/feat-001-auth-shell.test.ts | AC-4: invalid credentials show auth.login.error_invalid and create no session | ✅ passing |
| FEAT-001 | AC-5 | tests/feat-001-auth-shell.test.ts | AC-5: Demo cannot read Laura health data | ✅ passing |
| FEAT-001 | AC-6 | tests/feat-001-auth-shell.test.ts | AC-6: app shell nav exposes Home, Log, Calendar, Analytics, Import; Home title is Dashboard | ✅ passing |
| FEAT-001 | AC-7 | tests/feat-001-auth-shell.test.ts | AC-7: each nav target is reachable when signed in | ✅ passing |
| FEAT-001 | AC-8 | tests/feat-001-auth-shell.test.ts | AC-8: sign out clears session | ✅ passing |
| FEAT-001 | AC-9 | tests/feat-001-auth-shell.test.ts | AC-9: exactly two seeded accounts; no public signup route | ✅ passing |
| FEAT-001 | AC-10 | tests/feat-001-auth-shell.test.ts | AC-10: Demo starts with no health logs/imports | ✅ passing |
| FEAT-002 | AC-1 | tests/feat-002-signin-ui-cookies.test.ts | AC-1: /login exposes Sign In form fields and submit copy keys | ✅ passing |
| FEAT-002 | AC-2 | tests/feat-002-signin-ui-cookies.test.ts | AC-2: valid credentials set HTTP-only session cookie and redirect to / | ✅ passing |
| FEAT-002 | AC-3 | tests/feat-002-signin-ui-cookies.test.ts | AC-3: invalid credentials show error and create no session cookie | ✅ passing |
| FEAT-002 | AC-4 | tests/feat-002-signin-ui-cookies.test.ts | AC-4: submitting CTA is disabled at 65% opacity while in flight | ✅ passing |
| FEAT-002 | AC-5 | tests/feat-002-signin-ui-cookies.test.ts | AC-5: unauthenticated access to shell routes redirects to /login | ✅ passing |
| FEAT-002 | AC-6 | tests/feat-002-signin-ui-cookies.test.ts | AC-6: authenticated /login redirects to / | ✅ passing |
| FEAT-002 | AC-7 | tests/feat-002-signin-ui-cookies.test.ts | AC-7: sign out clears session cookie | ✅ passing |
| FEAT-002 | AC-8 | e2e/feat-002-signin-journey.spec.ts | Laura signs in, lands on Dashboard, signs out, then shell requires login | ✅ passing |
| FEAT-003 | AC-1 | tests/feat-003-shell-polish.test.ts | AC-1: bottom nav exposes five labeled destinations with bar token | ✅ passing |
| FEAT-003 | AC-2 | tests/feat-003-shell-polish.test.ts | AC-2: active nav icon uses pill #082E33 @ 80% | ✅ passing |
| FEAT-003 | AC-3 | tests/feat-003-shell-polish.test.ts | AC-3: header exposes eyebrow, title, subtitle, Sign out | ✅ passing |
| FEAT-003 | AC-4 | tests/feat-003-shell-polish.test.ts | AC-4: scrolled header uses #0B4041 @ 80% | ✅ passing |
| FEAT-003 | AC-5 | tests/feat-003-shell-polish.test.ts | AC-5: nav hrefs map Home→/ title Dashboard and sibling routes | ✅ passing |
| FEAT-003 | AC-6 | tests/feat-003-shell-polish.test.ts | AC-6: shell is phone-first (no desktop shell layout) | ✅ passing |
| FEAT-003 | AC-7 | e2e/feat-003-shell-nav-journey.spec.ts | AC-7: Playwright nav + Sign out journey | ✅ passing |
| FEAT-004 | AC-1 | tests/feat-004-manual-logging.test.ts | AC-1: /log is a single surface for all seven manual log types | ✅ passing |
| FEAT-004 | AC-2 | tests/feat-004-manual-logging.test.ts | AC-2: create BP with systolic, diastolic, HR, date/time; no posture | ✅ passing |
| FEAT-004 | AC-3 | tests/feat-004-manual-logging.test.ts | AC-3: create symptom from catalog + severity + optional notes | ✅ passing |
| FEAT-004 | AC-4 | tests/feat-004-manual-logging.test.ts | AC-4: create medication from catalog + dose + date/time | ✅ passing |
| FEAT-004 | AC-5 | tests/feat-004-manual-logging.test.ts | AC-5: water oz sums to daily total for calendar date | ✅ passing |
| FEAT-004 | AC-6 | tests/feat-004-manual-logging.test.ts | AC-6: electrolytes once per day; second create blocked until delete | ✅ passing |
| FEAT-004 | AC-7 | tests/feat-004-manual-logging.test.ts | AC-7: create mood from fixed enum + date/time | ✅ passing |
| FEAT-004 | AC-8 | tests/feat-004-manual-logging.test.ts | AC-8: create event note + date/time | ✅ passing |
| FEAT-004 | AC-9 | tests/feat-004-manual-logging.test.ts | AC-9: delete any manual log type; no edit UI | ✅ passing |
| FEAT-004 | AC-10 | tests/feat-004-manual-logging.test.ts | AC-10: Demo cannot read or delete Laura logs | ✅ passing |
| FEAT-004 | AC-11 | tests/feat-004-manual-logging.test.ts | AC-11: catalogs match seeded lists; unknown names rejected | ✅ passing |
| FEAT-004 | AC-12 | e2e/feat-004-water-journey.spec.ts | Laura opens Log, creates water, sees total, deletes it | ✅ passing |
| FEAT-004 | UI remaining forms | e2e/feat-004-remaining-forms.spec.ts | Laura can create symptom, BP, med, electrolytes, mood, and event | ✅ passing |
| FEAT-004 | UI CTAs | tests/feat-004-manual-logging.test.ts | UI: each log type has a create CTA from the copy deck | ✅ passing |
| FEAT-004 | Log hydration | tests/feat-004-manual-logging.test.ts | UI: Log datetime default is server-provided (avoids nav hydration toast) | ✅ passing |
| FEAT-005 | AC-1 | tests/feat-005-home-dashboard.test.ts | AC-1: today BP reading count for account calendar date | ✅ passing |
| FEAT-005 | AC-2 | tests/feat-005-home-dashboard.test.ts | AC-2: most recent BP today as systolic/diastolic; empty when none | ✅ passing |
| FEAT-005 | AC-3 | tests/feat-005-home-dashboard.test.ts | AC-3: medication count today | ✅ passing |
| FEAT-005 | AC-4 | tests/feat-005-home-dashboard.test.ts | AC-4: total water oz today | ✅ passing |
| FEAT-005 | AC-5 | tests/feat-005-home-dashboard.test.ts | AC-5: symptom count today | ✅ passing |
| FEAT-005 | AC-6 | tests/feat-005-home-dashboard.test.ts | AC-6: electrolytes yes vs not logged | ✅ passing |
| FEAT-005 | AC-7 | tests/feat-005-home-dashboard.test.ts | AC-7: empty day shows zeros / empty / not-logged — not another day | ✅ passing |
| FEAT-005 | AC-8 | tests/feat-005-home-dashboard.test.ts | AC-8: Demo cannot see Laura today stats | ✅ passing |
| FEAT-005 | AC-9 | e2e/feat-005-home-journey.spec.ts | AC-9: Playwright Home summary journey | ✅ passing |
| FEAT-006 | AC-1 | tests/feat-006-calendar.test.ts | AC-1: calendar lists manual entries for selected date | ✅ passing |
| FEAT-006 | AC-2 | tests/feat-006-calendar.test.ts | AC-2: selecting another date swaps the list — never mixes days | ✅ passing |
| FEAT-006 | AC-3 | tests/feat-006-calendar.test.ts | AC-3: empty selected day returns no entries | ✅ passing |
| FEAT-006 | AC-4 | tests/feat-006-calendar.test.ts | AC-4: calendar listing uses manual-log store only | ✅ passing |
| FEAT-006 | AC-5 | tests/feat-006-calendar.test.ts | AC-5: Demo cannot see Laura day entries | ✅ passing |
| FEAT-006 | AC-6 | tests/feat-006-calendar.test.ts | AC-6: delete from selected day removes entry | ✅ passing |
| FEAT-006 | AC-7 | tests/feat-006-calendar.test.ts | AC-7: /calendar shell + default today + day picker | ✅ passing |
| FEAT-006 | AC-8 | e2e/feat-006-calendar-journey.spec.ts | AC-8: Playwright Calendar past-day review + delete | ✅ passing |
| FEAT-007 | AC-1 | tests/feat-007-import.test.ts | AC-1: both CSVs required — no partial commit | ✅ passing |
| FEAT-007 | AC-2 | tests/feat-007-import.test.ts | AC-2: detailed Metric → metric_key + NY recorded_at | ✅ passing |
| FEAT-007 | AC-3 | tests/feat-007-import.test.ts | AC-3: summary rows stored; BP never imported | ✅ passing |
| FEAT-007 | AC-4 | tests/feat-007-import.test.ts | AC-4: skip duplicates; new + skipped counts | ✅ passing |
| FEAT-007 | bug | tests/feat-007-import.test.ts | Production hang: chunked sample inserts (≤100/row) + import.failed if the request dies; server action body 4mb | ✅ passing |
| FEAT-007 | AC-5 | tests/feat-007-import.test.ts | AC-5: Demo cannot access Laura imports | ✅ passing |
| FEAT-007 | AC-6 | tests/feat-007-import.test.ts | AC-6: batch-delete removes ImportBatch samples | ✅ passing |
| FEAT-007 | AC-7 | tests/feat-007-import.test.ts | AC-7: /import shell + upload + batch list | ✅ passing |
| FEAT-007 | AC-8 | e2e/feat-007-import-journey.spec.ts | AC-8: Playwright upload pair then per-file delete (2 cards) | ✅ passing |
| FEAT-008 | AC-1 | tests/feat-008-analytics.test.ts | AC-1: /analytics shell + four tabs; default Medication | ✅ passing |
| FEAT-008 | AC-2 | tests/feat-008-analytics.test.ts | AC-2: Medication Impact card + date/Compare controls (Figma) | ✅ passing |
| FEAT-008 | iterate | tests/feat-008-analytics.test.ts | Empty window copy HR/BP; y-axis min−30/max+30; tooltip without name colon | ✅ passing |
| FEAT-008 | bug | tests/feat-008-analytics.test.ts | Client chart helpers live in medication-chart.ts (no log/import stores / node:fs) | ✅ passing |
| FEAT-008 | iterate | tests/analytics-visual-layout.test.ts | Date field overlays native `type="date"` picker (`analytics-med-date-picker`) | ✅ passing |
| FEAT-008 | AC-3 | tests/feat-008-analytics.test.ts | AC-3: Medication impact series slots -2h…+2h | ✅ passing |
| FEAT-008 | AC-4 | tests/feat-008-analytics.test.ts | AC-4: ±15 min closest; no interpolation | ✅ passing |
| FEAT-008 | AC-5 | tests/feat-008-analytics.test.ts | AC-5: BP manual; HR manual + detailed heart_rate | ✅ passing |
| FEAT-008 | AC-6 | tests/feat-008-analytics.test.ts | AC-6: untaken meds gray `#8E8E93` disabled; multi-dose → most recent | ✅ passing |
| FEAT-008 | AC-7 | tests/feat-008-analytics.test.ts | AC-7: tooltips BP / HR | ✅ passing |
| FEAT-008 | AC-8 | tests/feat-008-analytics.test.ts | AC-8: Demo cannot read Laura analytics | ✅ passing |
| FEAT-008 | AC-9 | tests/feat-008-analytics.test.ts | AC-9: Cardiovascular Chart 2 + Chart 3 | ✅ passing |
| FEAT-008 | AC-10 | tests/feat-008-analytics.test.ts | AC-10: Recovery Chart 4 + Chart 5 | ✅ passing |
| FEAT-008 | AC-11 | tests/feat-008-analytics.test.ts | AC-11: Electrolytes Lifestyle cards | ✅ passing |
| FEAT-008 | AC-12 | e2e/feat-008-analytics-journey.spec.ts | Laura opens Analytics Medication, date/metric, chart area; visits Cardio/Recovery/Electrolytes tabs; electrolytes With/Without cards | ✅ passing |
| FEAT-009 | AC-1 | tests/feat-009-turso-persistence.test.ts | AC-1: Drizzle schema exposes Account + health tables | ✅ passing |
| FEAT-009 | AC-2 | tests/feat-009-turso-persistence.test.ts | AC-2: seed Laura/Demo hashes + catalogs; Demo health empty | ✅ passing |
| FEAT-009 | AC-3 | tests/feat-009-turso-persistence.test.ts | AC-3: sign-in verifies Account.password_hash | ✅ passing |
| FEAT-009 | AC-4 | tests/feat-009-turso-persistence.test.ts | AC-4: stores use DB (no durable globalThis) | ✅ passing |
| FEAT-009 | AC-5 | tests/feat-009-turso-persistence.test.ts | AC-5: data survives new DB client | ✅ passing |
| FEAT-009 | AC-6 | tests/feat-009-turso-persistence.test.ts | AC-6: pair import → two ImportBatch + pair_id | ✅ passing |
| FEAT-009 | AC-7 | tests/feat-009-turso-persistence.test.ts | AC-7: per-file delete leaves sibling | ✅ passing |
| FEAT-009 | AC-8 | tests/feat-009-turso-persistence.test.ts | AC-8: Import History one card per file | ✅ passing |
| FEAT-009 | AC-9 | tests/feat-009-turso-persistence.test.ts | AC-9: Demo cannot read/delete Laura DB rows | ✅ passing |
| FEAT-009 | AC-10 | tests/feat-009-turso-persistence.test.ts | AC-10: connection policy (test/file/Turso) | ✅ passing |
| FEAT-009 | AC-11 | e2e/feat-009-persistence-journey.spec.ts | AC-11: Playwright persistence + per-file delete | ✅ passing |

## Exemptions (targeted-coverage rule 8)
| Area | Why exempt | Approved by |
| --- | --- | --- |
| Login pixel match vs Figma | Side-by-side visual check (pond crop, font raster, shadow); layout tokens covered by unit tests | Owner — visual pass after login rebuild |
| _(none)_ | FEAT-001 login/shell E2E exemption cleared by FEAT-002 AC-8 | — |
