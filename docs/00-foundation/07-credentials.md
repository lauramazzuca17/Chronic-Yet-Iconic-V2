---
project: "Chronic Yet Iconic V2"
type: operations
status: living-document
updated: 2026-08-15
---

# Accounts and Credentials Tracker

[[00-overview|← Overview]]

> [!warning] Do not store secrets here
> This Obsidian vault may sync to more than one device and is committed to
> git. Record the **account URL, account email, password-manager item name,
> secret-manager reference, or last-four identifier** — never passwords, API
> keys, recovery codes, private keys, or connection strings.

| Layer | Choice | Login info (reference only) | Keys/URLs (reference only) |
| --- | --- | --- | --- |
| Source control | GitHub | lauramazzuca17 | https://github.com/lauramazzuca17/Chronic-Yet-Iconic-V2 |
| Domain and DNS | Vercel default `*.vercel.app` until custom domain | | |
| Frontend hosting | Vercel | minnie4 | project `chronic-yet-iconic-v2` · https://chronic-yet-iconic-v2.vercel.app |
| Backend hosting | Vercel (Next.js) | | same project |
| Database | Turso | GitHub/Google login to app.turso.tech | DB: `chronic-yet-iconic-v2` (aws-us-east-2); URL + token in password manager + Vercel / `.env.local` only |
| Email provider | n/a (v1) | | |
| File/object storage | n/a for v1 (uploads processed ephemerally) | | |
| Error monitoring | _TBD_ | | |
| Analytics | n/a or privacy-safe TBD | | |
| Bot protection | low priority (seeded-only, no public signup) | | |
| App accounts | Seeded owner + test | Usernames: **Laura** (owner), **Demo** (test). Passwords only in password manager / seed secrets — never here. | |

## Setup checklist
- [ ] Dedicated organization/admin email where appropriate.
- [ ] Every credential lives in the approved password/secrets manager.
- [ ] Each row above has URL, responsible owner, and secret reference.
- [x] Production access restricted to named people; removed on role change.
- [ ] MFA enabled everywhere it's supported (GitHub, Vercel, Turso).
- [ ] Dev, staging, and production credentials kept separate.
- [x] Seed usernames chosen; password hashes generated at seed time from secrets — never committed.
- [x] Turso production DB created (`chronic-yet-iconic-v2`).
- [x] `TURSO_*` + `SESSION_SECRET` + `SEED_PASSWORD_*` in Vercel Production (+ Preview) env.
- [ ] Vercel Deployment Protection considered (NFR-05 private URL).
- [x] Local `.env.local` wired (gitignored); rotate Turso token after chat exposure.
- [x] First production deploy (`https://chronic-yet-iconic-v2.vercel.app`).
