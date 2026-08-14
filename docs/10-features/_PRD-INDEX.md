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
| FEAT-006 | Calendar (manual day detail) | REQ-11, NFR-01 | done | [[FEAT-006-calendar]] | tests/feat-006-calendar.test.ts · e2e/feat-006-calendar-journey.spec.ts |
| FEAT-007 | Import (third-party CSV pair) | REQ-12, REQ-15, NFR-01, NFR-02, NFR-06 | done | [[FEAT-007-import]] | tests/feat-007-import.test.ts · e2e/feat-007-import-journey.spec.ts |

**Status values:** `draft` → `approved` → `in-progress` → `done` (or `deprecated`)

> [!note] Coverage rule
> Every REQ-ID in [[01-requirements]] must appear in some feature's
> Implements column, or be listed here as explicitly deferred:
>
> **Deferred requirements:** REQ-16–REQ-17, REQ-20 (and remaining NFRs not listed on FEAT-001–007). **Done:** REQ-01–REQ-12, REQ-15 via FEAT-001–007.
