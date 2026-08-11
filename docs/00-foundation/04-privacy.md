---
project: "Chronic Yet Iconic V2"
type: privacy-safeguarding
status: requires-review
updated: 2026-08-10
---

# Privacy, Consent, and Safeguarding

[[00-overview|← Overview]]

> [!danger] Review required
> This is a product/operations requirements note, not legal advice. The
> appropriate owner (legal/privacy/program) must approve notices, consent
> language, and retention before the product collects or uses personal data.
> Delete this doc only if the product truly touches no personal data.

## Design principle
Collect only what the owner logs or imports for personal POTS tracking. **Never** gate core logging on sharing, social, or clinician features (those are out of scope forever). Health data is **account-scoped** in Turso; the test account must not read the owner account. v1 access is limited to **two seeded accounts** with **no public registration**.

## Data inventory
| Data category | Purpose | Required control |
| --- | --- | --- |
| Account username + password hash | Sign-in | Hashed passwords; secrets not in git; session required |
| Manual health logs (symptoms, BP/HR, meds, water, electrolytes, mood, events) | Personal tracking + care-team prep (export/show outside app by user) | Account isolation; delete per entry |
| Imported Apple Health / CSV / XML samples | Enrich trends | Account isolation; skip duplicates; **user can delete** imported data |
| Session cookie | Keep user signed in | HTTP-only secure cookie; no health payloads in localStorage |

## Required decisions (blockers for related features)
- [x] Audience/jurisdictions and legal basis for collection — **personal single-owner app** + one test account; not a multi-tenant public product in v1. (Owner still reviews before any broader launch.)
- [x] Exact user-facing notices — **minimal v1**: sign-in implies private personal health store; no marketing notices required for seeded-only deploy. Expand if audience grows.
- [x] Consent process where required — **n/a for v1 seeded personal use**; revisit if opened to others.
- [x] Retention schedule and deletion semantics — **retain until user deletes** logs or imported data; **no** whole-account self-delete in v1; operator can wipe DB/account offline if needed.

## Product safeguards
- No public signup route in v1.
- All health queries filter by `account_id` of the session.
- No clinician portal, sharing, or social export features.
- No AI diagnosis.
- Delete supports: each manual log; imported samples and/or import batches (REQ-15).
- Keep production URL relatively private; use strong unique passwords for Laura/Demo (NFR-05).
