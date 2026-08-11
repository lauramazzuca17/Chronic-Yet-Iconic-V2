# Import fixtures (v1 format)

Canonical samples of the **third-party date-ranged Apple Health export** used by Chronic Yet Iconic V2.

| File | Role |
| --- | --- |
| `health_export_summary_20260810.csv` | One row per calendar day; aggregate columns |
| `health_export_detailed_20260810.csv` | Point-in-time rows: `Timestamp,Date,Time,Metric,Value,Unit` |

**Native Apple Health `.zip` / XML exports are out of scope for v1.**

See `docs/00-foundation/01-requirements.md` (import contract) and `03-data-model.md` (`metric_key` mapping).
