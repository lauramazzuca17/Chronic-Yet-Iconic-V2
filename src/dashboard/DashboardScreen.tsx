import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { TodayDashboardSummary } from "@/dashboard/summary";
import {
  DASHBOARD_COPY,
  formatLatestBp,
  formatWaterOz,
} from "@/dashboard/copy";

const TITLE = "#448774";
const VALUE = "#f08429";
const HELPER = "#8e8e93";
const BADGE_BG = "#efefef";
const BADGE_TEXT = "#5c5c60";

const cardSx = {
  bgcolor: "#FFFFFF",
  borderRadius: "12px",
  boxShadow:
    "0 4px 4px rgba(12,12,13,0.05), 0 4px 4px rgba(12,12,13,0.1)",
  px: 2,
  pt: 1,
  pb: "10px",
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

function TakenBadge({ taken }: { taken: boolean }) {
  return (
    <Box
      data-testid="dashboard-electrolytes-badge"
      data-taken={taken ? "true" : "false"}
      aria-label={
        taken
          ? "Electrolytes taken"
          : "Electrolytes not taken"
      }
      sx={{
        bgcolor: BADGE_BG,
        borderRadius: "4px",
        px: "10px",
        py: "6px",
        width: 65,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        flexShrink: 0,
      }}
    >
      <Typography
        component="span"
        sx={{
          color: BADGE_TEXT,
          fontSize: 14,
          lineHeight: "18px",
          textAlign: "center",
        }}
      >
        {DASHBOARD_COPY["dashboard.metric.electrolytes_taken"]}
      </Typography>
      {taken ? (
        <Box
          component="svg"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          aria-hidden
        >
          <rect
            x="1.5"
            y="1.5"
            width="13"
            height="13"
            rx="1"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
          <path
            d="M4 8.2 L6.8 11 L12 5"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Box>
      ) : (
        <Box
          component="svg"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          aria-hidden
        >
          <rect
            x="1.5"
            y="1.5"
            width="13"
            height="13"
            rx="1"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
          <path
            d="M5 5 L11 11 M11 5 L5 11"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </Box>
      )}
    </Box>
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
      sx={{
        px: 2,
        pb: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
        }}
      >
        <Box sx={cardSx}>
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
        <Box sx={cardSx}>
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
        <TakenBadge taken={summary.electrolytesTaken} />
      </Box>

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
  );
}
