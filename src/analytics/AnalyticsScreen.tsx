"use client";

import { useState, useTransition } from "react";
import {
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  loadMedicationImpactView,
  shiftMedicationImpactDateAction,
  type MedicationImpactView,
} from "@/analytics/actions";
import type { AnalyticsTabId } from "@/analytics/tabs";
import type { MedicationImpactMetricId } from "@/analytics/medication-impact";
import { MEDICATION_UNAVAILABLE_COLOR } from "@/analytics/medication-impact";

const TEAL = "#0B4041";
const CARD_RADIUS = "10px";

type AnalyticsScreenProps = {
  initial: MedicationImpactView;
};

export function AnalyticsScreen({ initial }: AnalyticsScreenProps) {
  const [tab, setTab] = useState<AnalyticsTabId>("medication");
  const [view, setView] = useState(initial);
  const [pending, startTransition] = useTransition();

  function refresh(next: MedicationImpactView) {
    setView(next);
  }

  function onShiftDate(direction: "prev" | "next") {
    startTransition(async () => {
      refresh(
        await shiftMedicationImpactDateAction(
          view.calendarDate,
          direction,
          view.selectedMed,
          view.metric
        )
      );
    });
  }

  function onMedChange(name: string) {
    startTransition(async () => {
      refresh(
        await loadMedicationImpactView({
          calendarDate: view.calendarDate,
          medicationName: name,
          metric: view.metric,
        })
      );
    });
  }

  function onMetricChange(metric: MedicationImpactMetricId) {
    startTransition(async () => {
      refresh(
        await loadMedicationImpactView({
          calendarDate: view.calendarDate,
          medicationName: view.selectedMed,
          metric,
        })
      );
    });
  }

  return (
    <Box
      component="main"
      sx={{
        px: "16px",
        pb: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Box
        data-testid="analytics-tabs"
        sx={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          pb: "4px",
        }}
        role="tablist"
        aria-label="Analytics sections"
      >
        {view.tabs.map((t) => {
          const active = tab === t.id;
          return (
            <Box
              key={t.id}
              component="button"
              type="button"
              role="tab"
              aria-selected={active}
              data-testid={`analytics-tab-${t.id}`}
              onClick={() => setTab(t.id)}
              sx={{
                border: "none",
                cursor: "pointer",
                borderRadius: "100px",
                px: "14px",
                py: "6px",
                typography: "body2",
                fontWeight: 500,
                whiteSpace: "nowrap",
                bgcolor: active ? "#8B7E66" : "rgba(11,64,65,0.45)",
                color: "#fff",
              }}
            >
              {t.label}
            </Box>
          );
        })}
      </Box>

      {tab === "medication" ? (
        <Box
          data-testid="analytics-medication-card"
          sx={{
            bgcolor: "#fff",
            borderRadius: CARD_RADIUS,
            p: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxShadow:
              "0 4px 4px rgba(12,12,13,0.05), 0 4px 4px rgba(12,12,13,0.1)",
          }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{ fontWeight: 500, fontSize: 16, lineHeight: "20px" }}
            >
              {view.card.title}
            </Typography>
            <Typography
              sx={{
                mt: "4px",
                fontSize: 12,
                lineHeight: "18px",
                color: "#5c5c60",
              }}
            >
              {view.card.helper}
            </Typography>
          </Box>

          <Box
            data-testid="analytics-med-date-control"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <IconButton
              aria-label={view.card.prevDayLabel}
              data-testid="analytics-med-prev-day"
              onClick={() => onShiftDate("prev")}
              disabled={pending}
              size="small"
            >
              ‹
            </IconButton>
            <Typography
              data-testid="analytics-med-date"
              sx={{ fontSize: 14, fontWeight: 500, minWidth: "96px", textAlign: "center" }}
            >
              {view.dateDisplay}
            </Typography>
            <IconButton
              aria-label={view.card.nextDayLabel}
              data-testid="analytics-med-next-day"
              onClick={() => onShiftDate("next")}
              disabled={pending}
              size="small"
            >
              ›
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Typography sx={{ fontSize: 14 }}>{view.card.compareLabel}</Typography>
            <TextField
              select
              size="small"
              label="Medication"
              data-testid="analytics-med-select"
              value={view.selectedMed ?? ""}
              onChange={(e) => onMedChange(e.target.value)}
              disabled={pending || !view.selectedMed}
              sx={{ minWidth: 140 }}
            >
              {view.options.map((o) => (
                <MenuItem
                  key={o.name}
                  value={o.name}
                  disabled={!o.selectable}
                  sx={
                    o.selectable
                      ? undefined
                      : { color: MEDICATION_UNAVAILABLE_COLOR }
                  }
                >
                  {o.name}
                </MenuItem>
              ))}
            </TextField>
            <Typography sx={{ fontSize: 14 }}>{view.card.withLabel}</Typography>
            <TextField
              select
              size="small"
              label="Metric"
              data-testid="analytics-metric-select"
              value={view.metric}
              onChange={(e) =>
                onMetricChange(e.target.value as MedicationImpactMetricId)
              }
              disabled={pending}
              sx={{ minWidth: 120 }}
            >
              {view.card.metrics.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box
            data-testid="analytics-med-chart"
            aria-label="Medication impact chart"
            sx={{
              bgcolor: "#f2f2f7",
              border: "1px dashed #d1d1d6",
              borderRadius: CARD_RADIUS,
              minHeight: 180,
              p: "12px",
              color: TEAL,
              fontSize: 12,
            }}
          >
            {view.series ? (
              <Box component="ul" sx={{ m: 0, pl: "18px" }}>
                {view.series.slots.map((s) => (
                  <li key={s.key} data-testid={`analytics-med-slot-${s.key}`}>
                    {s.key}: {s.value == null ? "—" : s.value}
                  </li>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: "#5c5c60" }}>
                No medication logged for this day.
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Typography sx={{ color: "#fff", fontSize: 14 }}>
          {view.tabs.find((t) => t.id === tab)?.label} — coming next.
        </Typography>
      )}
    </Box>
  );
}
