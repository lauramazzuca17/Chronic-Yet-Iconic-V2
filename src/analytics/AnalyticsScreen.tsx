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
  loadCardiovascularView,
  loadElectrolytesView,
  loadMedicationImpactView,
  loadRecoveryView,
  shiftMedicationImpactDateAction,
  type CardiovascularView,
  type ElectrolytesView,
  type MedicationImpactView,
  type RecoveryView,
} from "@/analytics/actions";
import type { AnalyticsTabId } from "@/analytics/tabs";
import type { MedicationImpactMetricId } from "@/analytics/medication-impact";
import type { CardioRangeId } from "@/analytics/cardiovascular";
import type { HrvRangeId, WalkingHrRangeId } from "@/analytics/recovery";
import { RangeChips } from "@/analytics/RangeChips";
import {
  BpHrOverlayChart,
  MedicationImpactChart,
  RecoveryLineChart,
  TachycardiaBurdenChart,
} from "@/analytics/charts";

/** Figma lock — keep local so client never imports medication-impact → log/store. */
const MEDICATION_UNAVAILABLE_COLOR = "#8E8E93";

const CARD_RADIUS = "10px";
const CARD_SX = {
  bgcolor: "#fff",
  borderRadius: CARD_RADIUS,
  p: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  boxShadow: "0 4px 4px rgba(12,12,13,0.05), 0 4px 4px rgba(12,12,13,0.1)",
} as const;

type AnalyticsScreenProps = {
  initial: MedicationImpactView;
};

function CardTitle({ title, helper }: { title: string; helper: string }) {
  return (
    <Box>
      <Typography
        component="h2"
        sx={{ fontWeight: 500, fontSize: 16, lineHeight: "20px" }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: "4px",
          fontSize: 12,
          lineHeight: "18px",
          color: "#5c5c60",
        }}
      >
        {helper}
      </Typography>
    </Box>
  );
}

function MetricRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        py: "6px",
        borderBottom: "1px solid #f2f2f7",
      }}
    >
      <Typography sx={{ fontSize: 14, color: "#5c5c60" }}>{label}</Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: "#0B4041" }}>
        {value}
        {unit ? (
          <Typography component="span" sx={{ fontSize: 12, ml: "4px", color: "#5c5c60" }}>
            {unit}
          </Typography>
        ) : null}
      </Typography>
    </Box>
  );
}

export function AnalyticsScreen({ initial }: AnalyticsScreenProps) {
  const [tab, setTab] = useState<AnalyticsTabId>("medication");
  const [med, setMed] = useState(initial);
  const [cardio, setCardio] = useState<CardiovascularView | null>(null);
  const [recovery, setRecovery] = useState<RecoveryView | null>(null);
  const [electrolytes, setElectrolytes] = useState<ElectrolytesView | null>(
    null
  );
  const [pending, startTransition] = useTransition();

  function selectTab(next: AnalyticsTabId) {
    setTab(next);
    if (next === "cardiovascular" && !cardio) {
      startTransition(async () => {
        setCardio(await loadCardiovascularView());
      });
    }
    if (next === "recovery" && !recovery) {
      startTransition(async () => {
        setRecovery(await loadRecoveryView());
      });
    }
    if (next === "electrolytes" && !electrolytes) {
      startTransition(async () => {
        setElectrolytes(await loadElectrolytesView());
      });
    }
  }

  function onShiftDate(direction: "prev" | "next") {
    startTransition(async () => {
      setMed(
        await shiftMedicationImpactDateAction(
          med.calendarDate,
          direction,
          med.selectedMed,
          med.metric
        )
      );
    });
  }

  function onMedChange(name: string) {
    startTransition(async () => {
      setMed(
        await loadMedicationImpactView({
          calendarDate: med.calendarDate,
          medicationName: name,
          metric: med.metric,
        })
      );
    });
  }

  function onMetricChange(metric: MedicationImpactMetricId) {
    startTransition(async () => {
      setMed(
        await loadMedicationImpactView({
          calendarDate: med.calendarDate,
          medicationName: med.selectedMed,
          metric,
        })
      );
    });
  }

  function onCardioRange(range: CardioRangeId) {
    startTransition(async () => {
      setCardio(await loadCardiovascularView({ range }));
    });
  }

  function onHrvRange(hrvRange: HrvRangeId) {
    startTransition(async () => {
      setRecovery(
        await loadRecoveryView({
          hrvRange,
          walkingRange: recovery?.walkingRange ?? "last_7",
        })
      );
    });
  }

  function onWalkingRange(walkingRange: WalkingHrRangeId) {
    startTransition(async () => {
      setRecovery(
        await loadRecoveryView({
          hrvRange: recovery?.hrvRange ?? "today",
          walkingRange,
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
        {med.tabs.map((t) => {
          const active = tab === t.id;
          return (
            <Box
              key={t.id}
              component="button"
              type="button"
              role="tab"
              aria-selected={active}
              data-testid={`analytics-tab-${t.id}`}
              onClick={() => selectTab(t.id)}
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
        <Box data-testid="analytics-medication-card" sx={CARD_SX}>
          <CardTitle title={med.card.title} helper={med.card.helper} />

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
              aria-label={med.card.prevDayLabel}
              data-testid="analytics-med-prev-day"
              onClick={() => onShiftDate("prev")}
              disabled={pending}
              size="small"
            >
              ‹
            </IconButton>
            <Typography
              data-testid="analytics-med-date"
              sx={{
                fontSize: 14,
                fontWeight: 500,
                minWidth: "96px",
                textAlign: "center",
              }}
            >
              {med.dateDisplay}
            </Typography>
            <IconButton
              aria-label={med.card.nextDayLabel}
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
            <Typography sx={{ fontSize: 14 }}>{med.card.compareLabel}</Typography>
            <TextField
              select
              size="small"
              label="Medication"
              data-testid="analytics-med-select"
              value={med.selectedMed ?? ""}
              onChange={(e) => onMedChange(e.target.value)}
              disabled={pending || !med.selectedMed}
              sx={{ minWidth: 140 }}
            >
              {med.options.map((o) => (
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
            <Typography sx={{ fontSize: 14 }}>{med.card.withLabel}</Typography>
            <TextField
              select
              size="small"
              label="Metric"
              data-testid="analytics-metric-select"
              value={med.metric}
              onChange={(e) =>
                onMetricChange(e.target.value as MedicationImpactMetricId)
              }
              disabled={pending}
              sx={{ minWidth: 120 }}
            >
              {med.card.metrics.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ position: "relative" }}>
            <MedicationImpactChart series={med.series} />
          </Box>
        </Box>
      ) : null}

      {tab === "cardiovascular" ? (
        <Box
          data-testid="analytics-cardiovascular-panel"
          sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {!cardio ? (
            <Typography sx={{ color: "#fff", fontSize: 14 }}>Loading…</Typography>
          ) : (
            <>
              <Box sx={CARD_SX}>
                <CardTitle
                  title={cardio.chart2.title}
                  helper={cardio.chart2.helper}
                />
                <RangeChips
                  options={cardio.chart2.ranges}
                  value={cardio.range}
                  onChange={(id) => onCardioRange(id as CardioRangeId)}
                  disabled={pending}
                  testIdPrefix="analytics-cardio-range"
                />
                <BpHrOverlayChart series={cardio.overlay} />
              </Box>
              <Box sx={CARD_SX}>
                <CardTitle
                  title={cardio.chart3.title}
                  helper={cardio.chart3.helper}
                />
                <TachycardiaBurdenChart series={cardio.burden} />
                <Box
                  data-testid="analytics-cardio-disclaimer"
                  sx={{
                    bgcolor: "#f2f2f7",
                    borderRadius: CARD_RADIUS,
                    p: "12px",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 600, fontSize: 13, mb: "6px" }}
                  >
                    {cardio.chart3.disclaimerTitle}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      lineHeight: "18px",
                      color: "#5c5c60",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {cardio.chart3.disclaimerBody}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      ) : null}

      {tab === "recovery" ? (
        <Box
          data-testid="analytics-recovery-panel"
          sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {!recovery ? (
            <Typography sx={{ color: "#fff", fontSize: 14 }}>Loading…</Typography>
          ) : (
            <>
              <Box sx={CARD_SX}>
                <CardTitle
                  title={recovery.hrvCard.title}
                  helper={recovery.hrvCard.helper}
                />
                <RangeChips
                  options={recovery.hrvCard.ranges}
                  value={recovery.hrvRange}
                  onChange={(id) => onHrvRange(id as HrvRangeId)}
                  disabled={pending}
                  testIdPrefix="analytics-hrv-range"
                />
                <RecoveryLineChart
                  series={recovery.hrv}
                  testId="analytics-hrv-chart"
                  label="Heart rate variability chart"
                  emptyText="No HRV readings in this range."
                />
                <Box
                  data-testid="analytics-hrv-info"
                  sx={{
                    bgcolor: "#f2f2f7",
                    borderRadius: CARD_RADIUS,
                    p: "12px",
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: 13, mb: "6px" }}>
                    {recovery.hrvCard.infoTitle}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, lineHeight: "18px", color: "#5c5c60", mb: "8px" }}
                  >
                    {recovery.hrvCard.infoIntro}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, lineHeight: "18px", color: "#5c5c60", mb: "6px" }}
                  >
                    <Box component="strong" sx={{ fontWeight: 600 }}>
                      Sympathetic system:
                    </Box>{" "}
                    {recovery.hrvCard.infoSympathetic.replace(
                      /^Sympathetic system:\s*/i,
                      ""
                    )}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, lineHeight: "18px", color: "#5c5c60", mb: "8px" }}
                  >
                    <Box component="strong" sx={{ fontWeight: 600 }}>
                      Parasympathetic system:
                    </Box>{" "}
                    {recovery.hrvCard.infoParasympathetic.replace(
                      /^Parasympathetic system:\s*/i,
                      ""
                    )}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, lineHeight: "18px", color: "#5c5c60" }}
                  >
                    {recovery.hrvCard.infoFooter}
                  </Typography>
                </Box>
              </Box>
              <Box sx={CARD_SX}>
                <CardTitle
                  title={recovery.walkingCard.title}
                  helper={recovery.walkingCard.helper}
                />
                <RangeChips
                  options={recovery.walkingCard.ranges}
                  value={recovery.walkingRange}
                  onChange={(id) => onWalkingRange(id as WalkingHrRangeId)}
                  disabled={pending}
                  testIdPrefix="analytics-walking-range"
                />
                <RecoveryLineChart
                  series={recovery.walking}
                  testId="analytics-walking-chart"
                  label="Average walking heart rate chart"
                  emptyText="No walking heart rate readings in this range."
                />
              </Box>
            </>
          )}
        </Box>
      ) : null}

      {tab === "electrolytes" ? (
        <Box
          data-testid="analytics-electrolytes-panel"
          sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {!electrolytes ? (
            <Typography sx={{ color: "#fff", fontSize: 14 }}>Loading…</Typography>
          ) : (
            <>
              <Box sx={{ px: "4px" }}>
                <Typography
                  component="h2"
                  sx={{ fontWeight: 500, fontSize: 18, color: "#fff" }}
                >
                  {electrolytes.section.title}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: "rgba(255,255,255,0.85)", mt: "4px" }}
                >
                  {electrolytes.section.helper}
                </Typography>
              </Box>
              {!electrolytes.comparison ? (
                <Typography
                  data-testid="analytics-electrolytes-empty"
                  sx={{ color: "#fff", fontSize: 14, px: "4px" }}
                >
                  {electrolytes.section.empty}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {(
                    [
                      {
                        key: "with",
                        title: electrolytes.section.withTitle,
                        helper: electrolytes.section.withHelper,
                        card: electrolytes.comparison.withCard,
                      },
                      {
                        key: "without",
                        title: electrolytes.section.withoutTitle,
                        helper: electrolytes.section.withoutHelper,
                        card: electrolytes.comparison.withoutCard,
                      },
                    ] as const
                  ).map((block) => (
                    <Box
                      key={block.key}
                      data-testid={`analytics-electrolytes-${block.key}`}
                      sx={CARD_SX}
                    >
                      <CardTitle title={block.title} helper={block.helper} />
                      <MetricRow
                        label={electrolytes.section.metricAvgHr}
                        value={
                          block.card.avgHr == null
                            ? "—"
                            : String(Math.round(block.card.avgHr))
                        }
                        unit={electrolytes.section.unitBpm}
                      />
                      <MetricRow
                        label={electrolytes.section.metricAvgResting}
                        value={
                          block.card.avgResting == null
                            ? "—"
                            : String(Math.round(block.card.avgResting))
                        }
                        unit={electrolytes.section.unitBpm}
                      />
                      <MetricRow
                        label={electrolytes.section.metricAvgWalking}
                        value={
                          block.card.avgWalking == null
                            ? "—"
                            : String(Math.round(block.card.avgWalking))
                        }
                        unit={electrolytes.section.unitBpm}
                      />
                      <MetricRow
                        label={electrolytes.section.metricAvgBp}
                        value={block.card.avgBp ?? "—"}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
      ) : null}
    </Box>
  );
}
