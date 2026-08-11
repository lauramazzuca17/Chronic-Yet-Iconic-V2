---
project: "Chronic Yet Iconic V2"
type: operations
status: living-document
updated: 2026-08-10
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
| Source control | GitHub | _owner to fill_ | repo URL TBD |
| Domain and DNS | _TBD with Vercel_ | | |
| Frontend hosting | Vercel | | project name TBD |
| Backend hosting | Vercel (Next.js) | | same project |
| Database | Turso | | DB name TBD; auth token in password manager |
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
- [ ] Production access restricted to named people; removed on role change.
- [ ] MFA enabled everywhere it's supported (GitHub, Vercel, Turso).
- [ ] Dev, staging, and production credentials kept separate.
- [ ] Seed usernames chosen; password hashes generated at seed time from secrets — never committed.
