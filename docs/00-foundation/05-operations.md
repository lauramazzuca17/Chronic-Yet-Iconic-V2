---
project: "Chronic Yet Iconic V2"
type: operations
status: working-draft
updated: 2026-08-10
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
3. **Publish:** merge to GitHub; Vercel production deploy; Turso migrations applied as documented in AGENTS.md (when filled).
4. **Re-check cadence:** personal app — review seed lists when meds/symptoms change in real life.
