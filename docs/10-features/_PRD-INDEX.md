---
type: prd-index
updated: 2026-08-11
---
# Feature Index

<!-- Claude: keep this table in sync with every PRD. One row per feature. -->

| ID | Feature | Implements | Status | PRD | Tests |
| --- | --- | --- | --- | --- | --- |
| FEAT-001 | Seeded auth + app shell | REQ-18, REQ-19, NFR-01, NFR-05 | done | [[FEAT-001-auth-shell]] | tests/feat-001-auth-shell.test.ts |
| FEAT-002 | Sign-in UI + HTTP session cookies | REQ-18, REQ-19, NFR-05 | done | [[FEAT-002-signin-ui-cookies]] | tests/feat-002-signin-ui-cookies.test.ts; e2e/feat-002-signin-journey.spec.ts |
| FEAT-003 | App shell polish (phone-first chrome) | NFR-06 | done | [[FEAT-003-shell-polish]] | tests/feat-003-shell-polish.test.ts; e2e/feat-003-shell-nav-journey.spec.ts |

**Status values:** `draft` → `approved` → `in-progress` → `done` (or `deprecated`)

> [!note] Coverage rule
> Every REQ-ID in [[01-requirements]] must appear in some feature's
> Implements column, or be listed here as explicitly deferred:
>
> **Deferred requirements:** REQ-01–REQ-17, REQ-20 (and remaining NFRs not listed on FEAT-001–003) — deferred to later FEATs.
