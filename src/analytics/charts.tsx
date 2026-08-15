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
  Cell,
} from "recharts";
import { Box, Typography } from "@mui/material";
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
        bgcolor: "#f2f2f7",
        borderRadius: "10px",
        minHeight: 200,
        width: "100%",
        pt: "8px",
        pr: "8px",
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

export function MedicationImpactChart({
  series,
}: {
  series: MedicationImpactSeries | null;
}) {
  if (!series) {
    return (
      <ChartFrame testId="analytics-med-chart" label="Medication impact chart">
        <EmptyChartNote text="No medication logged for this day." />
      </ChartFrame>
    );
  }

  const data = series.slots.map((s) => ({
    key: s.key,
    value: s.value,
    tooltip: s.tooltip,
  }));

  return (
    <ChartFrame testId="analytics-med-chart" label="Medication impact chart">
      <Box sx={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d1d6" />
            <XAxis dataKey="key" tick={{ fontSize: 11, fill: MUTED }} />
            <YAxis tick={{ fontSize: 11, fill: MUTED }} width={36} />
            <Tooltip
              formatter={(_value, _name, item) => {
                const tip = (item?.payload as { tooltip?: string | null })?.tooltip;
                return [tip ?? "—", ""];
              }}
              labelFormatter={() => ""}
            />
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
      {/* Text / table fallback (a11y + empty-slot clarity) */}
      <Box
        component="ul"
        sx={{
          m: 0,
          mt: "4px",
          px: "12px",
          pb: "8px",
          pl: "28px",
          fontSize: 11,
          color: MUTED,
        }}
      >
        {series.slots.map((s) => (
          <li key={s.key} data-testid={`analytics-med-slot-${s.key}`}>
            {s.key}: {s.value == null ? "—" : s.value}
            {s.tooltip ? ` · ${s.tooltip}` : ""}
          </li>
        ))}
      </Box>
    </ChartFrame>
  );
}

export function BpHrOverlayChart({ series }: { series: BpHrOverlaySeries }) {
  const byTime = new Map<string, { t: string; bp?: number; hr?: number }>();
  for (const p of series.bp) {
    const row = byTime.get(p.recordedAt) ?? { t: p.recordedAt.slice(11, 16) };
    row.bp = p.value;
    byTime.set(p.recordedAt, row);
  }
  for (const p of series.hr) {
    const row = byTime.get(p.recordedAt) ?? { t: p.recordedAt.slice(11, 16) };
    row.hr = p.value;
    byTime.set(p.recordedAt, row);
  }
  const data = [...byTime.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, row]) => row);

  if (data.length === 0) {
    return (
      <ChartFrame testId="analytics-cardio-chart2" label="Blood pressure and heart rate chart">
        <EmptyChartNote text="No BP or HR readings in this range." />
      </ChartFrame>
    );
  }

  return (
    <ChartFrame testId="analytics-cardio-chart2" label="Blood pressure and heart rate chart">
      <Box sx={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d1d6" />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: MUTED }} />
            <YAxis domain={[50, 190]} tick={{ fontSize: 11, fill: MUTED }} width={36} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="bp"
              name="BP"
              stroke={TEAL}
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="hr"
              name="HR"
              stroke={ACCENT}
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 3 }}
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
    percent: d.percent,
  }));

  return (
    <ChartFrame testId="analytics-cardio-chart3" label="Tachycardia burden chart">
      <Box sx={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d1d6" />
            <XAxis dataKey="weekday" tick={{ fontSize: 11, fill: MUTED }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: MUTED }} width={36} unit="%" />
            <Tooltip
              formatter={(value) =>
                value == null ? ["—", "% ≥100"] : [`${value}%`, "% ≥100"]
              }
            />
            <Bar dataKey="percent" name="% ≥100" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell
                  key={d.weekday + i}
                  fill={d.percent == null ? "#d1d1d6" : TEAL}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartFrame>
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
      <Box sx={{ width: "100%", height: 200 }}>
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
