---
project: "Chronic Yet Iconic V2"
type: overview
status: approved
tier: full
created: 2026-08-10
updated: 2026-08-10
---

# Chronic Yet Iconic V2

Chronic Yet Iconic V2 is a health stat tracker and data visualizer for someone who is chronically ill. It helps them track metrics for Postural Orthostatic Tachycardia Syndrome (POTS) as they start new medications, so they can show their medical care team how health trends relate to medications, lifestyle choices, life events, and other factors that impact symptoms and health.

> [!note] Naming assumption
> **User-facing name:** Chronic Yet Iconic (no “V2”). **Internal/repo name:** Chronic Yet Iconic V2. Confirm before any public launch if branding differs.

> [!important] Clinical context (product intent)
> Blood pressure and heart rate are the two most crucial stats. With POTS, lower blood pressure tends to drive higher heart rate as the body compensates. The user is starting medication to raise blood pressure; the product must support seeing whether that helps and how medications relate to heart rate and blood pressure over time. Heart rate is recorded as part of each BP measurement (HR at time of BP). **Blood pressure is manual-only — never imported from Apple Health.** **Do not capture posture** (lying/sitting/standing) on BP logs.

## What it does
- **Single log screen** for all manual logging (web app).
- Log **symptoms** (name, severity, date/time, optional notes).
- Log **blood pressure** (systolic, diastolic, heart rate at measurement, date/time).
- Log **medications** (name, dose, date/time).
- Log **water** in oz, with a running **daily total**.
- Log **electrolytes** as a once-per-day yes/no (timestamped).
- Log **mood** via dropdown (awful / not great / okay / good / great) with date/time.
- Log **events** (free-text note, e.g. stood in line 45m) with date/time.
- Import Apple Health via **third-party date-ranged CSV** (summary + detailed). **No native Apple zip/XML in v1.**
- Delete any manually logged entry; electrolytes are once-per-day (block until deleted).
- Home dashboard with a summary of today's stats.
- Calendar view of all logged information for a selected day.
- Analytics view with charts/insights (e.g. blood pressure response relative to medication).
- Password-protected personal data; support a second account so others can test without seeing the owner's data.

## How it fits the bigger picture
Stand-alone product built for a specific personal POTS goal. Not a multi-condition platform and not clinician-facing. Primary user is the owner; a second account exists for safe exploration/testing.

## Working outcomes
1. Users can reliably log the MVP log types (symptom, BP+HR, meds, water, electrolytes, mood, event) from one log screen.
2. Users can import crucial data from Apple Health and from CSV/XML exports from other programs.
3. Users can visualize their data and learn insights from health trends (especially BP ↔ HR ↔ medication).
4. Owner data is password-protected; a separate test account cannot see owner data.

## Doc map
| Doc | Purpose |
| --- | --- |
| [[01-requirements]] | Master goal, scope, journeys, functional requirements |
| [[02-platform]] | Stack, deployment shape, integration principles |
| [[03-data-model]] | Binding schema design contract (if applicable) |
| [[04-privacy]] | Data inventory, consent/privacy decisions (if applicable) |
| [[05-operations]] | Content/release operations (if applicable) |
| [[06-decisions-risks-roadmap]] | Decision log, risks, delivery phases |
| [[07-credentials]] | Accounts & credentials tracker (references only) |
