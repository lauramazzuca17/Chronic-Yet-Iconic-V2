import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { TodayDashboardSummary } from "@/dashboard/summary";
import {
  DASHBOARD_COPY,
  formatLatestBp,
  formatWaterOz,
} from "@/dashboard/copy";
import { SHELL_CONTENT_GUTTER_PX } from "@/shell/chrome";
import { TakenBadge } from "@/components/TakenBadge";

const TITLE = "#448774";
const VALUE = "#f08429";
const HELPER = "#8e8e93";

/** Fluid cards: never fixed artboard widths; border-box so padding stays inside. */
const cardSx = {
  boxSizing: "border-box" as const,
  bgcolor: "#FFFFFF",
  borderRadius: "12px",
  boxShadow:
    "0 4px 4px rgba(12,12,13,0.05), 0 4px 4px rgba(12,12,13,0.1)",
  px: "16px",
  pt: "8px",
  pb: "10px",
  minWidth: 0,
  width: "100%",
};

function MetricTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="p"
      sx={{
        color: TITLE,
        fontSize: 18,
        fontWeight: 500,
        lineHeight: "22px",
        m: 0,
      }}
    >
      {children}
    </Typography>
  );
}

function MetricValue({
  children,
  testId,
}: {
  children: ReactNode;
  testId: string;
}) {
  return (
    <Typography
      component="p"
      data-testid={testId}
      sx={{
        color: VALUE,
        fontSize: 30,
        fontWeight: 900,
        lineHeight: "36px",
        m: 0,
      }}
    >
      {children}
    </Typography>
  );
}

function MetricHelper({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="p"
      sx={{
        color: HELPER,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: "20px",
        m: 0,
      }}
    >
      {children}
    </Typography>
  );
}

export type DashboardScreenProps = {
  summary: TodayDashboardSummary;
};

/** Home metric cards — Figma layout without Health records (v1). */
export function DashboardScreen({ summary }: DashboardScreenProps) {
  return (
    <Box
      component="main"
      data-testid="dashboard-main"
      sx={{
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        px: `${SHELL_CONTENT_GUTTER_PX}px`,
        pb: 3,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* 50/50 row: equal flex children, gap 16 — never fixed 170px, never overlap */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: "16px",
          py: "8px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ ...cardSx, flex: "1 1 0", width: "auto" }}>
          <MetricTitle>
            {DASHBOARD_COPY["dashboard.metric.bp_count"]}
          </MetricTitle>
          <MetricValue testId="dashboard-bp-count">
            {summary.bpCount}
          </MetricValue>
          <MetricHelper>
            {DASHBOARD_COPY["dashboard.metric.bp_count_helper"]}
          </MetricHelper>
        </Box>
        <Box sx={{ ...cardSx, flex: "1 1 0", width: "auto" }}>
          <MetricTitle>
            {DASHBOARD_COPY["dashboard.metric.bp_latest"]}
          </MetricTitle>
          <MetricValue testId="dashboard-bp-latest">
            {formatLatestBp(summary.latestBp)}
          </MetricValue>
          <MetricHelper>
            {DASHBOARD_COPY["dashboard.metric.bp_latest_helper"]}
          </MetricHelper>
        </Box>
      </Box>

      <Box sx={{ py: "8px", width: "100%", boxSizing: "border-box" }}>
        <Box sx={cardSx}>
          <MetricTitle>
            {DASHBOARD_COPY["dashboard.metric.meds_count"]}
          </MetricTitle>
          <MetricValue testId="dashboard-meds-count">
            {summary.medsCount}
          </MetricValue>
          <MetricHelper>
            {DASHBOARD_COPY["dashboard.metric.meds_helper"]}
          </MetricHelper>
        </Box>
      </Box>

      <Box sx={{ py: "8px", width: "100%", boxSizing: "border-box" }}>
        <Box
          sx={{
            ...cardSx,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <MetricTitle>
              {DASHBOARD_COPY["dashboard.metric.water_total"]}
            </MetricTitle>
            <MetricValue testId="dashboard-water-total">
              {formatWaterOz(summary.waterTotalOz)}
            </MetricValue>
            <MetricHelper>
              {DASHBOARD_COPY["dashboard.metric.water_helper"]}
            </MetricHelper>
          </Box>
          <TakenBadge
            taken={summary.electrolytesTaken}
            label={DASHBOARD_COPY["dashboard.metric.electrolytes_taken"]}
            testId="dashboard-electrolytes-badge"
            ariaLabel={
              summary.electrolytesTaken
                ? "Electrolytes taken"
                : "Electrolytes not taken"
            }
          />
        </Box>
      </Box>

      <Box sx={{ py: "8px", width: "100%", boxSizing: "border-box" }}>
        <Box sx={cardSx}>
          <MetricTitle>
            {DASHBOARD_COPY["dashboard.metric.symptoms_count"]}
          </MetricTitle>
          <MetricValue testId="dashboard-symptoms-count">
            {summary.symptomsCount}
          </MetricValue>
          <MetricHelper>
            {DASHBOARD_COPY["dashboard.metric.symptoms_helper"]}
          </MetricHelper>
        </Box>
      </Box>
    </Box>
  );
}
