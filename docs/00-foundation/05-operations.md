---
project: "Chronic Yet Iconic V2"
type: operations
status: working-draft
updated: 2026-08-15
---

# Content and Release Operations

[[00-overview|← Overview]]

> [!note] Scope for this product
> v1 is a personal seeded app, not a content CMS. "Managed content" here means
> **seeded catalogs** (symptom/medication names) and **deployed releases** of the
> web app — not editorial articles.

## Content promise
Catalog labels (symptoms, medications) stay consistent so analytics remain comparable. Changes to seeded lists go through a documented seed/migration update, not ad-hoc production edits in v1.

## Every managed record needs
- Stable ID (catalog row id)
- Owner: product owner
- Status: active in v1 seed set
- Change via migration/seed bump + release

## Release standards
| Content class | Release standard |
| --- | --- |
| App code | GitHub → Vercel; suite green before promote |
| Catalog seed changes | Update [[03-data-model]] seed lists first, then migration |
| Account seeds | Credentials only via env/secrets; never commit passwords |

## Release workflow
1. **Research / change:** update docs (requirements/data model) when behavior or catalogs change.
2. **Review:** owner confirms.
3. **Publish:** merge to GitHub; Vercel production deploy; Turso schema applied on first `getDb()` (Drizzle migrator reads `drizzle/` at runtime — no separate migrate job in v1).
4. **Re-check cadence:** personal app — review seed lists when meds/symptoms change in real life.

## Vercel + Turso env (v0.1.1+)

Set these on the Vercel project (**Production**; optionally **Preview** with a separate Turso DB):

| Variable | Notes |
| --- | --- |
| `TURSO_DATABASE_URL` | `libsql://…` from Turso dashboard |
| `TURSO_AUTH_TOKEN` | DB token from Turso (password manager) |
| `SESSION_SECRET` | ≥32 random chars (iron-session) |
| `SEED_PASSWORD_LAURA` | Strong unique password; password manager |
| `SEED_PASSWORD_DEMO` | Strong unique password; password manager |

Do **not** set `ALLOW_TEST_RESET` in Production. Do **not** set `CYI_DB_MODE=memory` on Vercel.

**First boot:** migrate + upsert Laura/Demo + catalogs run inside `getDb()` when seed env is present.

**Local:** leave `TURSO_*` empty to use `.data/local.db`; or copy Production Turso URL/token into `.env.local` to hit the same DB (careful).
