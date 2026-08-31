"use client";

import type { ReactNode } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { ANALYTICS_CARD, ANALYTICS_CHART_FRAME } from "@/analytics/layout";
import {
  formatMedicationImpactEmptyWindow,
  medicationImpactPlottedValues,
  medicationImpactYDomain,
} from "@/analytics/medication-chart";
import {
  BP_HR_OVERLAY_SHOW_DOTS,
  HR_BURDEN_BANDS,
  buildBpHrOverlayChartView,
  formatBpHrOverlayTooltipLabel,
  formatHrBurdenAxisTick,
  formatHrBurdenBarLabel,
  hrBurdenBarLabelFill,
  hrBurdenPieSlices,
} from "@/analytics/cardio-chart";
import type { HrBurdenBandId, HrBurdenBandPercents } from "@/analytics/cardio-chart";
import type { MedicationImpactSeries } from "@/analytics/medication-series";
import type { BpHrOverlaySeries, TachycardiaBurdenSeries } from "@/analytics/cardiovascular";
import type { RecoverySeries } from "@/analytics/recovery";

const TEAL = "#0B4041";
const ACCENT = "#8B7E66";
const MUTED = "#5c5c60";

function ChartFrame({
  testId,
  label,
  children,
}: {
  testId: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Box
      data-testid={testId}
      aria-label={label}
      sx={{
        position: "relative",
        boxSizing: "border-box",
        bgcolor: ANALYTICS_CHART_FRAME.bg,
        border: `1px ${ANALYTICS_CHART_FRAME.borderStyle} ${ANALYTICS_CHART_FRAME.border}`,
        borderRadius: `${ANALYTICS_CHART_FRAME.radiusPx}px`,
        minHeight: ANALYTICS_CHART_FRAME.heightPx,
        width: "100%",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}

function EmptyChartNote({ text }: { text: string }) {
  return (
    <Typography sx={{ fontSize: 12, color: MUTED, p: "12px" }}>{text}</Typography>
  );
}

function MedicationImpactEmptyNote({ text }: { text: string }) {
  return (
    <Box
      sx={{
        minHeight: ANALYTICS_CHART_FRAME.heightPx,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        px: `${ANALYTICS_CARD.padPx}px`,
      }}
    >
      <Typography
        sx={{
          m: 0,
          fontSize: ANALYTICS_CARD.helperSizePx,
          lineHeight: `${ANALYTICS_CARD.helperLineHeightPx}px`,
          color: ANALYTICS_CARD.helperColor,
          textAlign: "center",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

function MedicationImpactTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: { tooltip?: string | null } }>;
}) {
  if (!active || !payload?.length) return null;
  const tip = payload[0]?.payload?.tooltip;
  if (!tip) return null;
  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        border: `1px solid ${ANALYTICS_CHART_FRAME.border}`,
        borderRadius: `${ANALYTICS_CHART_FRAME.radiusPx}px`,
        px: `${ANALYTICS_CARD.helperGapPx}px`,
        py: `${ANALYTICS_CARD.helperGapPx}px`,
        fontSize: ANALYTICS_CARD.helperSizePx,
        lineHeight: `${ANALYTICS_CARD.helperLineHeightPx}px`,
        color: ANALYTICS_CARD.titleColor,
      }}
    >
      {tip}
    </Box>
  );
}

export function MedicationImpactChart({
  series,
}: {
  series: MedicationImpactSeries | null;
}) {
  if (!series) {
    return (
      <ChartFrame testId="analytics-med-chart" label="Medication impact chart">
        <MedicationImpactEmptyNote text="No medication logged for this day." />
      </ChartFrame>
    );
  }

  const plotted = medicationImpactPlottedValues(series);
  if (plotted.length === 0) {
    return (
      <ChartFrame testId="analytics-med-chart" label="Medication impact chart">
        <MedicationImpactEmptyNote text={formatMedicationImpactEmptyWindow(series.metric)} />
        <MedicationImpactSlotFallback series={series} />
      </ChartFrame>
    );
  }

  const [yMin, yMax] = medicationImpactYDomain(plotted);
  const data = series.slots.map((s) => ({
    key: s.key,
    value: s.value,
    tooltip: s.tooltip,
  }));

  return (
    <ChartFrame testId="analytics-med-chart" label="Medication impact chart">
      <Box sx={{ width: "100%", height: ANALYTICS_CHART_FRAME.heightPx }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d1d6" />
            <XAxis dataKey="key" tick={{ fontSize: 11, fill: MUTED }} />
            <YAxis
              domain={[yMin, yMax]}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: MUTED }}
              width={40}
            />
            <Tooltip content={<MedicationImpactTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={TEAL}
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 4, fill: TEAL }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <MedicationImpactSlotFallback series={series} />
    </ChartFrame>
  );
}

function MedicationImpactSlotFallback({
  series,
}: {
  series: MedicationImpactSeries;
}) {
  return (
    <Box
      component="ul"
      sx={{
        position: "absolute",
        width: 1,
        height: 1,
        m: -1,
        p: 0,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {series.slots.map((s) => (
        <li key={s.key} data-testid={`analytics-med-slot-${s.key}`}>
          {s.key}: {s.value == null ? "—" : s.value}
          {s.tooltip ? ` · ${s.tooltip}` : ""}
        </li>
      ))}
    </Box>
  );
}

export function BpHrOverlayChart({ series }: { series: BpHrOverlaySeries }) {
  const view = buildBpHrOverlayChartView(series);
  const tickLabel = new Map(view.ticks.map((t) => [t.x, t.label]));

  if (view.rows.length === 0) {
    return (
      <ChartFrame testId="analytics-cardio-chart2" label="Blood pressure and heart rate chart">
        <EmptyChartNote text="No BP or HR readings in this range." />
      </ChartFrame>
    );
  }

  return (
    <ChartFrame testId="analytics-cardio-chart2" label="Blood pressure and heart rate chart">
      <Box sx={{ width: "100%", height: ANALYTICS_CHART_FRAME.heightPx }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={view.rows} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d1d6" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[view.xMin, view.xMax]}
              ticks={view.ticks.map((t) => t.x)}
              tickFormatter={(x: number) => tickLabel.get(x) ?? ""}
              interval={0}
              tick={{ fontSize: 10, fill: MUTED }}
            />
            <YAxis domain={[50, 190]} tick={{ fontSize: 11, fill: MUTED }} width={36} />
            <Tooltip
              labelFormatter={(label) =>
                formatBpHrOverlayTooltipLabel(Number(label), series.range)
              }
            />
            <Line
              type="monotone"
              dataKey="bp"
              name="BP"
              stroke={TEAL}
              strokeWidth={2}
              connectNulls
              dot={BP_HR_OVERLAY_SHOW_DOTS}
            />
            <Line
              type="monotone"
              dataKey="hr"
              name="HR"
              stroke={ACCENT}
              strokeWidth={2}
              connectNulls
              dot={BP_HR_OVERLAY_SHOW_DOTS}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </ChartFrame>
  );
}

export function TachycardiaBurdenChart({
  series,
}: {
  series: TachycardiaBurdenSeries;
}) {
  const data = series.days.map((d) => ({
    weekday: d.weekday,
    low: d.bands?.low ?? 0,
    mid: d.bands?.mid ?? 0,
    high: d.bands?.high ?? 0,
    tachy: d.bands?.tachy ?? 0,
  }));
  const lastBand = HR_BURDEN_BANDS[HR_BURDEN_BANDS.length - 1]!;

  return (
    <Box>
      <ChartFrame testId="analytics-cardio-chart3" label="Tachycardia burden chart">
        <Box sx={{ width: "100%", height: ANALYTICS_CHART_FRAME.heightPx }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d1d6" />
              <XAxis dataKey="weekday" tick={{ fontSize: 11, fill: MUTED }} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={formatHrBurdenAxisTick}
                tick={{ fontSize: 11, fill: MUTED }}
                width={48}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${Math.round(Number(value ?? 0))}%`,
                  String(name),
                ]}
              />
              {HR_BURDEN_BANDS.map((band) => (
                <Bar
                  key={band.id}
                  dataKey={band.id}
                  name={band.label}
                  stackId="hr"
                  fill={band.color}
                  radius={band.id === lastBand.id ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                >
                  <LabelList
                    dataKey={band.id}
                    position="center"
                    formatter={formatHrBurdenBarLabel}
                    fill={hrBurdenBarLabelFill(band.id)}
                    fontSize={10}
                    fontWeight={600}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </ChartFrame>
      <HrBurdenLegend testId="analytics-cardio-chart3-legend" />
    </Box>
  );
}

function HrBurdenLegend({ testId }: { testId: string }) {
  return (
    <Box
      data-testid={testId}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        mt: "8px",
      }}
    >
      {HR_BURDEN_BANDS.map((band) => (
        <Box
          key={band.id}
          sx={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "2px",
              bgcolor: band.color,
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: 11, lineHeight: "14px", color: MUTED }}>
            {band.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function HrBurdenPieLabel(props: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  payload?: { id?: HrBurdenBandId };
}) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, payload } =
    props;
  const bandId = payload?.id;
  if (
    bandId == null ||
    typeof cx !== "number" ||
    typeof cy !== "number" ||
    typeof midAngle !== "number" ||
    typeof innerRadius !== "number" ||
    typeof outerRadius !== "number"
  ) {
    return null;
  }
  const text = formatHrBurdenBarLabel((percent ?? 0) * 100);
  if (!text) return null;
  const radian = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.58;
  const x = cx + radius * Math.cos(-midAngle * radian);
  const y = cy + radius * Math.sin(-midAngle * radian);
  return (
    <text
      x={x}
      y={y}
      fill={hrBurdenBarLabelFill(bandId)}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {text}
    </text>
  );
}

export function TachycardiaDayPieChart({
  bands,
  emptyText,
}: {
  bands: HrBurdenBandPercents | null;
  emptyText: string;
}) {
  const slices = hrBurdenPieSlices(bands);

  if (slices.length === 0) {
    return (
      <Box>
        <ChartFrame
          testId="analytics-cardio-chart3-pie"
          label="Tachycardia burden pie chart"
        >
          <EmptyChartNote text={emptyText} />
        </ChartFrame>
        <HrBurdenLegend testId="analytics-cardio-chart3-pie-legend" />
      </Box>
    );
  }

  return (
    <Box>
      <ChartFrame
        testId="analytics-cardio-chart3-pie"
        label="Tachycardia burden pie chart"
      >
        <Box sx={{ width: "100%", height: ANALYTICS_CHART_FRAME.heightPx }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={86}
                label={HrBurdenPieLabel}
                labelLine={false}
              >
                {slices.map((slice) => (
                  <Cell key={slice.id} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${Math.round(Number(value ?? 0))}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box
          component="ul"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            m: -1,
            p: 0,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {slices.map((slice) => (
            <li key={slice.id}>
              {slice.label}: {Math.round(slice.value)}%
            </li>
          ))}
        </Box>
      </ChartFrame>
      <HrBurdenLegend testId="analytics-cardio-chart3-pie-legend" />
    </Box>
  );
}

export function RecoveryLineChart({
  series,
  testId,
  label,
  emptyText,
}: {
  series: RecoverySeries;
  testId: string;
  label: string;
  emptyText: string;
}) {
  const data = series.points.map((p) => ({
    t: p.recordedAt.slice(5, 16).replace("T", " "),
    value: p.value,
  }));

  if (data.length === 0) {
    return (
      <ChartFrame testId={testId} label={label}>
        <EmptyChartNote text={emptyText} />
      </ChartFrame>
    );
  }

  return (
    <ChartFrame testId={testId} label={label}>
      <Box sx={{ width: "100%", height: ANALYTICS_CHART_FRAME.heightPx }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d1d6" />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: MUTED }} />
            <YAxis tick={{ fontSize: 11, fill: MUTED }} width={36} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={TEAL}
              strokeWidth={2}
              dot={{ r: 3, fill: TEAL }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </ChartFrame>
  );
}
