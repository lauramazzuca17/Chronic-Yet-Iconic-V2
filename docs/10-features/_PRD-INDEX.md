---
type: prd-index
updated: 2026-08-13
---
# Feature Index

<!-- Claude: keep this table in sync with every PRD. One row per feature. -->

| ID | Feature | Implements | Status | PRD | Tests |
| --- | --- | --- | --- | --- | --- |
| FEAT-001 | Seeded auth + app shell | REQ-18, REQ-19, NFR-01, NFR-05 | done | [[FEAT-001-auth-shell]] | tests/feat-001-auth-shell.test.ts |
| FEAT-002 | Sign-in UI + HTTP session cookies | REQ-18, REQ-19, NFR-05 | done | [[FEAT-002-signin-ui-cookies]] | tests/feat-002-signin-ui-cookies.test.ts; e2e/feat-002-signin-journey.spec.ts |
| FEAT-003 | App shell polish (phone-first chrome) | NFR-06 | done | [[FEAT-003-shell-polish]] | tests/feat-003-shell-polish.test.ts; e2e/feat-003-shell-nav-journey.spec.ts |
| FEAT-004 | Manual logging (single Log screen) | REQ-02–10, NFR-01 | done | [[FEAT-004-manual-logging]] | tests/feat-004-manual-logging.test.ts; e2e/feat-004-water-journey.spec.ts; e2e/feat-004-remaining-forms.spec.ts |
| FEAT-005 | Home dashboard (today's summary) | REQ-01, NFR-01 | done | [[FEAT-005-home-dashboard]] | tests/feat-005-home-dashboard.test.ts; e2e/feat-005-home-journey.spec.ts |

**Status values:** `draft` → `approved` → `in-progress` → `done` (or `deprecated`)

> [!note] Coverage rule
> Every REQ-ID in [[01-requirements]] must appear in some feature's
> Implements column, or be listed here as explicitly deferred:
>
> **Deferred requirements:** REQ-11–REQ-17, REQ-20 (and remaining NFRs not listed on FEAT-001–005). **Done:** REQ-02–REQ-10 via FEAT-004; **REQ-01** via FEAT-005.
