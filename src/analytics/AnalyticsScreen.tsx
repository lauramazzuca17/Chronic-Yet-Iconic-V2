"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  Box,
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
  ANALYTICS_BODY_BG,
  ANALYTICS_CARD,
  ANALYTICS_CARDIO,
  ANALYTICS_CHIP,
  ANALYTICS_DATE_CONTROL,
  ANALYTICS_DISCLAIMER,
  ANALYTICS_ELECTROLYTES,
  ANALYTICS_PANEL_PAD,
  ANALYTICS_PILL_SELECT,
} from "@/analytics/layout";
import {
  BpHrOverlayChart,
  MedicationImpactChart,
  RecoveryLineChart,
  TachycardiaBurdenChart,
  TachycardiaDayPieChart,
} from "@/analytics/charts";
import { shiftCalendarDate, shiftTachycardiaBurdenEndDate } from "@/analytics/cardio-chart";

const CARD_RADIUS = `${ANALYTICS_CARD.radiusPx}px`;
const CARD_SX = {
  bgcolor: "#fff",
  borderRadius: CARD_RADIUS,
  p: `${ANALYTICS_CARD.padPx}px`,
  display: "flex",
  flexDirection: "column",
  gap: `${ANALYTICS_CARD.gapPx}px`,
  boxSizing: "border-box",
  width: "100%",
  minWidth: 0,
} as const;

const CARDIO_CARD_SX = {
  ...CARD_SX,
  gap: `${ANALYTICS_CARDIO.cardGapPx}px`,
} as const;

const pillSelectSx = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  flex: "none",
  "& .MuiOutlinedInput-root": {
    height: ANALYTICS_PILL_SELECT.heightPx,
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    borderRadius: `${ANALYTICS_PILL_SELECT.radiusPx}px`,
    bgcolor: "#ffffff",
    fontFamily: "inherit",
    fontSize: ANALYTICS_PILL_SELECT.fontSizePx,
    "& fieldset": { borderColor: ANALYTICS_PILL_SELECT.border },
    "&:hover fieldset": { borderColor: ANALYTICS_PILL_SELECT.border },
    "&.Mui-focused fieldset": {
      borderColor: ANALYTICS_PILL_SELECT.border,
      borderWidth: 1,
    },
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    py: `${ANALYTICS_PILL_SELECT.padYPx}px`,
    px: `${ANALYTICS_PILL_SELECT.padXPx}px`,
    pr: "32px !important",
    fontSize: ANALYTICS_PILL_SELECT.fontSizePx,
    lineHeight: `${ANALYTICS_PILL_SELECT.lineHeightPx}px`,
    color: ANALYTICS_PILL_SELECT.color,
  },
  "& .MuiSelect-icon": {
    width: ANALYTICS_PILL_SELECT.iconSizePx,
    height: ANALYTICS_PILL_SELECT.iconSizePx,
    right: 4,
    top: "50%",
    transform: "translateY(-50%)",
  },
} as const;

function FigmaClipIcon(props: {
  src: string;
  clipPx: number;
  drawWidthPx: number;
  drawHeightPx: number;
  className?: string;
}) {
  return (
    <Box
      className={props.className}
      aria-hidden
      sx={{
        position: "relative",
        width: props.clipPx,
        height: props.clipPx,
        overflow: "hidden",
        flexShrink: 0,
        pointerEvents: "none",
      }}
    >
      <Box
        component="img"
        src={props.src}
        alt=""
        sx={{
          position: "absolute",
          width: props.drawWidthPx,
          height: props.drawHeightPx,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "block",
        }}
      />
    </Box>
  );
}

function SelectChevron(props: { className?: string }) {
  return (
    <FigmaClipIcon
      className={props.className}
      src={ANALYTICS_PILL_SELECT.chevronSrc}
      clipPx={ANALYTICS_PILL_SELECT.iconSizePx}
      drawWidthPx={ANALYTICS_PILL_SELECT.chevronDrawWidthPx}
      drawHeightPx={ANALYTICS_PILL_SELECT.chevronDrawHeightPx}
    />
  );
}

function AnalyticsDateControl({
  dateDisplay,
  calendarDate,
  prevLabel,
  nextLabel,
  pickLabel,
  testIdPrefix,
  disabled,
  maxDate,
  nextDisabled,
  enablePicker = true,
  onPrev,
  onNext,
  onPick,
}: {
  dateDisplay: string;
  calendarDate: string;
  prevLabel: string;
  nextLabel: string;
  pickLabel: string;
  testIdPrefix: string;
  disabled: boolean;
  maxDate?: string;
  nextDisabled?: boolean;
  enablePicker?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPick: (value: string) => void;
}) {
  const capSx = {
    position: "relative",
    flex: "0 0 auto",
    width: ANALYTICS_DATE_CONTROL.endCapWidthPx,
    m: 0,
    p: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: ANALYTICS_DATE_CONTROL.endCapBg,
    border: "none",
    appearance: "none",
    color: "inherit",
    "&::after": {
      content: '""',
      position: "absolute",
      inset: "-6px",
    },
  } as const;

  return (
    <Box
      data-testid={`${testIdPrefix}-date-control`}
      sx={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        height: ANALYTICS_DATE_CONTROL.heightPx,
        boxSizing: "border-box",
        border: `1px solid ${ANALYTICS_DATE_CONTROL.border}`,
        borderRadius: `${ANALYTICS_DATE_CONTROL.radiusPx}px`,
        overflow: "hidden",
        bgcolor: ANALYTICS_DATE_CONTROL.fieldBg,
      }}
    >
      <Box
        component="button"
        type="button"
        aria-label={prevLabel}
        data-testid={`${testIdPrefix}-prev-day`}
        onClick={onPrev}
        disabled={disabled}
        sx={{
          ...capSx,
          cursor: disabled ? "default" : "pointer",
        }}
      >
        <FigmaClipIcon
          src={ANALYTICS_DATE_CONTROL.chevronBackSrc}
          clipPx={ANALYTICS_DATE_CONTROL.iconClipPx}
          drawWidthPx={ANALYTICS_DATE_CONTROL.chevronDrawWidthPx}
          drawHeightPx={ANALYTICS_DATE_CONTROL.chevronDrawHeightPx}
        />
      </Box>
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          bgcolor: ANALYTICS_DATE_CONTROL.fieldBg,
          borderLeft: `1px solid ${ANALYTICS_DATE_CONTROL.border}`,
          borderRight: `1px solid ${ANALYTICS_DATE_CONTROL.border}`,
          px: `${ANALYTICS_DATE_CONTROL.fieldPadXPx}px`,
          py: `${ANALYTICS_DATE_CONTROL.fieldPadYPx}px`,
          boxSizing: "border-box",
        }}
      >
        <FigmaClipIcon
          src={ANALYTICS_DATE_CONTROL.calendarSrc}
          clipPx={ANALYTICS_DATE_CONTROL.iconClipPx}
          drawWidthPx={ANALYTICS_DATE_CONTROL.calendarDrawWidthPx}
          drawHeightPx={ANALYTICS_DATE_CONTROL.calendarDrawHeightPx}
        />
        <Typography
          data-testid={`${testIdPrefix}-date`}
          sx={{
            flex: 1,
            minWidth: 0,
            m: 0,
            textAlign: "center",
            fontSize: ANALYTICS_DATE_CONTROL.dateSizePx,
            lineHeight: `${ANALYTICS_DATE_CONTROL.dateLineHeightPx}px`,
            color: ANALYTICS_DATE_CONTROL.dateColor,
            fontWeight: 400,
          }}
        >
          {dateDisplay}
        </Typography>
        {enablePicker ? (
        <Box
          component="input"
          type="date"
          value={calendarDate}
          max={maxDate}
          onChange={(e) => onPick(e.target.value)}
          disabled={disabled}
          aria-label={pickLabel}
          data-testid={`${testIdPrefix}-date-picker`}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            width: "100%",
            height: "100%",
            m: 0,
            p: 0,
            border: "none",
            cursor: disabled ? "default" : "pointer",
            "&::-webkit-calendar-picker-indicator": {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              margin: 0,
              padding: 0,
              cursor: disabled ? "default" : "pointer",
              opacity: 0,
            },
          }}
        />
        ) : null}
      </Box>
      <Box
        component="button"
        type="button"
        aria-label={nextLabel}
        data-testid={`${testIdPrefix}-next-day`}
        onClick={onNext}
        disabled={disabled || nextDisabled}
        sx={{
          ...capSx,
          cursor: disabled || nextDisabled ? "default" : "pointer",
        }}
      >
        <FigmaClipIcon
          src={ANALYTICS_DATE_CONTROL.chevronForwardSrc}
          clipPx={ANALYTICS_DATE_CONTROL.iconClipPx}
          drawWidthPx={ANALYTICS_DATE_CONTROL.chevronDrawWidthPx}
          drawHeightPx={ANALYTICS_DATE_CONTROL.chevronDrawHeightPx}
        />
      </Box>
    </Box>
  );
}

function IntroWithRange({
  title,
  helper,
  children,
}: {
  title: string;
  helper: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: `${ANALYTICS_CARDIO.introToControlsGapPx}px`,
        width: "100%",
      }}
    >
      <CardTitle title={title} helper={helper} />
      {children}
    </Box>
  );
}

function SageCallout({
  testId,
  title,
  children,
}: {
  testId: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Box
      data-testid={testId}
      sx={{
        bgcolor: ANALYTICS_DISCLAIMER.bg,
        borderRadius: `${ANALYTICS_DISCLAIMER.radiusPx}px`,
        px: `${ANALYTICS_DISCLAIMER.padXPx}px`,
        py: `${ANALYTICS_DISCLAIMER.padYPx}px`,
        display: "flex",
        gap: `${ANALYTICS_DISCLAIMER.gapPx}px`,
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: ANALYTICS_DISCLAIMER.iconSizePx,
          pt: "4px",
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={ANALYTICS_DISCLAIMER.iconSrc}
          alt=""
          aria-hidden
          sx={{
            display: "block",
            width: ANALYTICS_DISCLAIMER.iconSizePx,
            height: ANALYTICS_DISCLAIMER.iconSizePx,
          }}
        />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            m: 0,
            fontWeight: ANALYTICS_DISCLAIMER.titleWeight,
            fontSize: ANALYTICS_DISCLAIMER.titleSizePx,
            lineHeight: `${ANALYTICS_DISCLAIMER.titleLineHeightPx}px`,
            color: ANALYTICS_DISCLAIMER.titleColor,
          }}
        >
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}

const SAGE_BODY_SX = {
  mt: "4px",
  fontSize: ANALYTICS_DISCLAIMER.bodySizePx,
  lineHeight: `${ANALYTICS_DISCLAIMER.bodyLineHeightPx}px`,
  color: ANALYTICS_DISCLAIMER.bodyColor,
} as const;

type AnalyticsScreenProps = {
  initial: MedicationImpactView;
};

function CardTitle({ title, helper }: { title: string; helper: string }) {
  return (
    <Box>
      <Typography
        component="h2"
        sx={{
          m: 0,
          fontWeight: ANALYTICS_CARD.titleWeight,
          fontSize: ANALYTICS_CARD.titleSizePx,
          lineHeight: `${ANALYTICS_CARD.titleLineHeightPx}px`,
          color: ANALYTICS_CARD.titleColor,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          m: 0,
          mt: `${ANALYTICS_CARD.helperGapPx}px`,
          fontSize: ANALYTICS_CARD.helperSizePx,
          lineHeight: `${ANALYTICS_CARD.helperLineHeightPx}px`,
          color: ANALYTICS_CARD.helperColor,
        }}
      >
        {helper}
      </Typography>
    </Box>
  );
}

function ElectrolyteMetric({
  iconSrc,
  iconBg,
  label,
  value,
  unit,
  divider,
}: {
  iconSrc: string;
  iconBg: string;
  label: string;
  value: string;
  unit?: string;
  divider?: boolean;
}) {
  const e = ANALYTICS_ELECTROLYTES;
  return (
    <Box
      sx={{
        display: "flex",
        flex: "1 1 0",
        gap: `${e.metricGapPx}px`,
        alignItems: "center",
        minWidth: 0,
        ...(divider ? { borderRight: `1px solid ${e.divider}` } : null),
      }}
    >
      <Box
        sx={{
          width: e.metricIconSizePx,
          height: e.metricIconSizePx,
          boxSizing: "border-box",
          p: `${e.metricIconPadPx}px`,
          borderRadius: `${e.metricIconRadiusPx}px`,
          bgcolor: iconBg,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={iconSrc}
          alt=""
          aria-hidden
          sx={{
            display: "block",
            width: e.metricDrawPx,
            height: e.metricDrawPx,
          }}
        />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            m: 0,
            fontWeight: 500,
            fontSize: e.labelSizePx,
            lineHeight: `${e.labelLinePx}px`,
            color: e.textColor,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            m: 0,
            mt: "4px",
            fontWeight: e.valueWeight,
            fontSize: e.valueSizePx,
            lineHeight: `${e.valueLinePx}px`,
            color: e.textColor,
          }}
        >
          {value}
          {unit ? (
            <Typography
              component="span"
              sx={{
                ml: "4px",
                fontWeight: 500,
                fontSize: e.unitSizePx,
                lineHeight: `${e.helperLineHeightPx}px`,
                color: e.unitColor,
              }}
            >
              {unit}
            </Typography>
          ) : null}
        </Typography>
      </Box>
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

  function onPickDate(calendarDate: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(calendarDate)) return;
    startTransition(async () => {
      setMed(
        await loadMedicationImpactView({
          calendarDate,
          medicationName: med.selectedMed,
          metric: med.metric,
        })
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
      setCardio(
        await loadCardiovascularView({
          range,
          burdenDay: cardio?.dayPie.calendarDate,
          burdenEndDate: cardio?.burden.endDate,
        })
      );
    });
  }

  function onPieDate(calendarDate: string) {
    if (!cardio || !/^\d{4}-\d{2}-\d{2}$/.test(calendarDate)) return;
    startTransition(async () => {
      setCardio(
        await loadCardiovascularView({
          range: cardio.range,
          burdenDay: calendarDate,
          burdenEndDate: cardio.burden.endDate,
        })
      );
    });
  }

  function onShiftPieDate(direction: "prev" | "next") {
    if (!cardio) return;
    const next = shiftCalendarDate(
      cardio.dayPie.calendarDate,
      direction === "next" ? 1 : -1
    );
    onPieDate(next);
  }

  function onShiftBurden(direction: "prev" | "next") {
    if (!cardio) return;
    const next = shiftTachycardiaBurdenEndDate(
      cardio.burden.endDate,
      direction
    );
    startTransition(async () => {
      setCardio(
        await loadCardiovascularView({
          range: cardio.range,
          burdenDay: cardio.dayPie.calendarDate,
          burdenEndDate: next,
        })
      );
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
        bgcolor: ANALYTICS_BODY_BG,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Box
        data-testid="analytics-tabs"
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: `${ANALYTICS_CHIP.gapPx}px`,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          pl: `${ANALYTICS_CHIP.padLeftPx}px`,
          py: `${ANALYTICS_CHIP.padYPx}px`,
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: ANALYTICS_CHIP.stripBg,
          boxShadow: ANALYTICS_CHIP.stripShadow,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
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
                position: "relative",
                flex: "0 0 auto",
                boxSizing: "border-box",
                border: "none",
                cursor: "pointer",
                borderRadius: `${ANALYTICS_CHIP.radiusPx}px`,
                px: `${ANALYTICS_CHIP.padXPx}px`,
                py: `${ANALYTICS_CHIP.padChipYPx}px`,
                minHeight: ANALYTICS_CHIP.visualMinHeightPx,
                fontFamily: "inherit",
                fontSize: ANALYTICS_CHIP.fontSizePx,
                fontWeight: 400,
                lineHeight: `${ANALYTICS_CHIP.lineHeightPx}px`,
                whiteSpace: "nowrap",
                bgcolor: active
                  ? ANALYTICS_CHIP.selectedBg
                  : ANALYTICS_CHIP.unselectedBg,
                color: active
                  ? ANALYTICS_CHIP.selectedColor
                  : ANALYTICS_CHIP.unselectedColor,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: `${(ANALYTICS_CHIP.visualMinHeightPx - ANALYTICS_CHIP.minHeightPx) / 2}px -4px`,
                },
              }}
            >
              {t.label}
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          px: `${ANALYTICS_PANEL_PAD.padXPx}px`,
          py: `${ANALYTICS_PANEL_PAD.padYPx}px`,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          pb: "24px",
        }}
      >
      {tab === "medication" ? (
        <Box data-testid="analytics-medication-card" sx={CARD_SX}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: `${ANALYTICS_CARD.introGapPx}px`,
              width: "100%",
            }}
          >
            <CardTitle title={med.card.title} helper={med.card.helper} />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: `${ANALYTICS_CARD.controlsGapPx}px`,
                width: "100%",
              }}
            >
              <AnalyticsDateControl
                dateDisplay={med.dateDisplay}
                calendarDate={med.calendarDate}
                prevLabel={med.card.prevDayLabel}
                nextLabel={med.card.nextDayLabel}
                pickLabel={med.card.pickDateLabel}
                testIdPrefix="analytics-med"
                disabled={pending}
                onPrev={() => onShiftDate("prev")}
                onNext={() => onShiftDate("next")}
                onPick={onPickDate}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `auto minmax(0, ${ANALYTICS_PILL_SELECT.maxWidthPx}px) auto minmax(0, ${ANALYTICS_PILL_SELECT.maxWidthPx}px)`,
                  alignItems: "center",
                  columnGap: `${ANALYTICS_PILL_SELECT.rowGapPx}px`,
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: ANALYTICS_PILL_SELECT.labelSizePx,
                    lineHeight: `${ANALYTICS_PILL_SELECT.labelLineHeightPx}px`,
                    color: ANALYTICS_PILL_SELECT.labelColor,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {med.card.compareLabel}
                </Typography>
                <TextField
                  select
                  data-testid="analytics-med-select"
                  value={med.selectedMed ?? ""}
                  onChange={(e) => onMedChange(e.target.value)}
                  disabled={pending}
                  sx={pillSelectSx}
                  slotProps={{
                    select: {
                      IconComponent: SelectChevron,
                      displayEmpty: true,
                      renderValue: (value) => {
                        const selected = String(value ?? "");
                        return selected || med.card.selectEmptyLabel;
                      },
                    },
                    htmlInput: { "aria-label": "Medication" },
                  }}
                >
                  {med.options.map((o) => (
                    <MenuItem
                      key={o.name}
                      value={o.name}
                      disabled={!o.selectable}
                      sx={
                        o.selectable
                          ? undefined
                          : { color: ANALYTICS_PILL_SELECT.unavailableColor }
                      }
                    >
                      {o.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography
                  sx={{
                    fontSize: ANALYTICS_PILL_SELECT.labelSizePx,
                    lineHeight: `${ANALYTICS_PILL_SELECT.labelLineHeightPx}px`,
                    color: ANALYTICS_PILL_SELECT.labelColor,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {med.card.withLabel}
                </Typography>
                <TextField
                  select
                  data-testid="analytics-metric-select"
                  value={med.metric}
                  onChange={(e) =>
                    onMetricChange(e.target.value as MedicationImpactMetricId)
                  }
                  disabled={pending}
                  sx={pillSelectSx}
                  slotProps={{
                    select: { IconComponent: SelectChevron },
                    htmlInput: { "aria-label": "Metric" },
                  }}
                >
                  {med.card.metrics.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Box>

          <MedicationImpactChart series={med.series} />
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
              <Box sx={CARDIO_CARD_SX}>
                <CardTitle
                  title={cardio.chart3.title}
                  helper={cardio.chart3.helper}
                />
                <AnalyticsDateControl
                  dateDisplay={cardio.burden.windowDisplay}
                  calendarDate={cardio.burden.endDate}
                  prevLabel={cardio.chart3.prevWeekLabel}
                  nextLabel={cardio.chart3.nextWeekLabel}
                  pickLabel={cardio.chart3.prevWeekLabel}
                  testIdPrefix="analytics-cardio-burden"
                  disabled={pending}
                  nextDisabled={
                    cardio.burden.endDate >= cardio.burden.latestEndDate
                  }
                  enablePicker={false}
                  onPrev={() => onShiftBurden("prev")}
                  onNext={() => onShiftBurden("next")}
                  onPick={() => {}}
                />
                <TachycardiaBurdenChart series={cardio.burden} />
                <SageCallout
                  testId="analytics-cardio-disclaimer"
                  title={cardio.chart3.disclaimerTitle}
                >
                  <Typography sx={{ ...SAGE_BODY_SX, whiteSpace: "pre-line" }}>
                    {cardio.chart3.disclaimerBody}
                  </Typography>
                </SageCallout>
              </Box>
              <Box sx={CARDIO_CARD_SX}>
                <CardTitle
                  title={cardio.chart3Day.title}
                  helper={cardio.chart3Day.helper}
                />
                <AnalyticsDateControl
                  dateDisplay={cardio.dayPie.dateDisplay}
                  calendarDate={cardio.dayPie.calendarDate}
                  prevLabel={cardio.chart3Day.prevDayLabel}
                  nextLabel={cardio.chart3Day.nextDayLabel}
                  pickLabel={cardio.chart3Day.pickDateLabel}
                  testIdPrefix="analytics-cardio-pie"
                  disabled={pending}
                  maxDate={cardio.overlay.today}
                  nextDisabled={
                    cardio.dayPie.calendarDate >= cardio.overlay.today
                  }
                  onPrev={() => onShiftPieDate("prev")}
                  onNext={() => onShiftPieDate("next")}
                  onPick={onPieDate}
                />
                <TachycardiaDayPieChart
                  bands={cardio.dayPie.bands}
                  emptyText={cardio.chart3Day.empty}
                />
              </Box>
              <Box sx={CARDIO_CARD_SX}>
                <IntroWithRange
                  title={cardio.chart2.title}
                  helper={cardio.chart2.helper}
                >
                  <RangeChips
                    options={cardio.chart2.ranges}
                    value={cardio.range}
                    onChange={(id) => onCardioRange(id as CardioRangeId)}
                    disabled={pending}
                    testIdPrefix="analytics-cardio-range"
                  />
                </IntroWithRange>
                <BpHrOverlayChart series={cardio.overlay} />
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
              <Box sx={CARDIO_CARD_SX}>
                <IntroWithRange
                  title={recovery.hrvCard.title}
                  helper={recovery.hrvCard.helper}
                >
                  <RangeChips
                    options={recovery.hrvCard.ranges}
                    value={recovery.hrvRange}
                    onChange={(id) => onHrvRange(id as HrvRangeId)}
                    disabled={pending}
                    testIdPrefix="analytics-hrv-range"
                  />
                </IntroWithRange>
                <RecoveryLineChart
                  series={recovery.hrv}
                  testId="analytics-hrv-chart"
                  label="Heart rate variability chart"
                  emptyText="No HRV readings in this range."
                />
                <SageCallout
                  testId="analytics-hrv-info"
                  title={recovery.hrvCard.infoTitle}
                >
                  <Typography sx={SAGE_BODY_SX}>
                    {recovery.hrvCard.infoIntro}
                  </Typography>
                  <Typography sx={SAGE_BODY_SX}>
                    <Box component="strong" sx={{ fontWeight: 600 }}>
                      Sympathetic system:
                    </Box>{" "}
                    {recovery.hrvCard.infoSympathetic.replace(
                      /^Sympathetic system:\s*/i,
                      ""
                    )}
                  </Typography>
                  <Typography sx={SAGE_BODY_SX}>
                    <Box component="strong" sx={{ fontWeight: 600 }}>
                      Parasympathetic system:
                    </Box>{" "}
                    {recovery.hrvCard.infoParasympathetic.replace(
                      /^Parasympathetic system:\s*/i,
                      ""
                    )}
                  </Typography>
                  <Typography sx={SAGE_BODY_SX}>
                    {recovery.hrvCard.infoFooter}
                  </Typography>
                </SageCallout>
              </Box>
              <Box sx={CARDIO_CARD_SX}>
                <IntroWithRange
                  title={recovery.walkingCard.title}
                  helper={recovery.walkingCard.helper}
                >
                  <RangeChips
                    options={recovery.walkingCard.ranges}
                    value={recovery.walkingRange}
                    onChange={(id) => onWalkingRange(id as WalkingHrRangeId)}
                    disabled={pending}
                    testIdPrefix="analytics-walking-range"
                  />
                </IntroWithRange>
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
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: `${ANALYTICS_ELECTROLYTES.panelGapPx}px`,
          }}
        >
          {!electrolytes ? (
            <Typography sx={{ color: "#fff", fontSize: 14 }}>Loading…</Typography>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: `${ANALYTICS_ELECTROLYTES.headerGapPx}px`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${ANALYTICS_ELECTROLYTES.introGapPx}px`,
                    maxWidth: ANALYTICS_ELECTROLYTES.helperMaxWidthPx,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    component="h2"
                    sx={{
                      m: 0,
                      fontWeight: ANALYTICS_ELECTROLYTES.titleWeight,
                      fontSize: ANALYTICS_ELECTROLYTES.titleSizePx,
                      lineHeight: `${ANALYTICS_ELECTROLYTES.titleLineHeightPx}px`,
                      color: ANALYTICS_ELECTROLYTES.titleColor,
                    }}
                  >
                    {electrolytes.section.title}
                  </Typography>
                  <Typography
                    sx={{
                      m: 0,
                      fontWeight: 400,
                      fontSize: ANALYTICS_ELECTROLYTES.helperSizePx,
                      lineHeight: `${ANALYTICS_ELECTROLYTES.helperLineHeightPx}px`,
                      color: ANALYTICS_ELECTROLYTES.helperColor,
                    }}
                  >
                    {electrolytes.section.helper}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    alignSelf: "stretch",
                    aspectRatio: "1 / 1",
                    boxSizing: "border-box",
                    bgcolor: ANALYTICS_ELECTROLYTES.heroBg,
                    borderRadius: `${ANALYTICS_ELECTROLYTES.heroRadiusPx}px`,
                    pt: `${ANALYTICS_ELECTROLYTES.heroPadTopPx}px`,
                    pl: `${ANALYTICS_ELECTROLYTES.heroPadLeftPx}px`,
                    pr: `${ANALYTICS_ELECTROLYTES.heroPadRightPx}px`,
                    pb: `${ANALYTICS_ELECTROLYTES.heroPadBottomPx}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={ANALYTICS_ELECTROLYTES.heroSrc}
                    alt=""
                    aria-hidden
                    sx={{
                      display: "block",
                      width: ANALYTICS_ELECTROLYTES.heroDrawWidthPx,
                      height: ANALYTICS_ELECTROLYTES.heroDrawHeightPx,
                    }}
                  />
                </Box>
              </Box>
              {!electrolytes.comparison ? (
                <Typography
                  data-testid="analytics-electrolytes-empty"
                  sx={{ color: "#fff", fontSize: 14 }}
                >
                  {electrolytes.section.empty}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${ANALYTICS_ELECTROLYTES.cardsGapPx}px`,
                    py: `${ANALYTICS_ELECTROLYTES.cardsPadYPx}px`,
                    width: "100%",
                  }}
                >
                  {(
                    [
                      {
                        key: "with" as const,
                        title: electrolytes.section.withTitle,
                        helper: electrolytes.section.withHelper,
                        card: electrolytes.comparison.withCard,
                        iconSrc: ANALYTICS_ELECTROLYTES.withSrc,
                        iconPad: ANALYTICS_ELECTROLYTES.withPadPx,
                        iconDraw: ANALYTICS_ELECTROLYTES.withDrawPx,
                      },
                      {
                        key: "without" as const,
                        title: electrolytes.section.withoutTitle,
                        helper: electrolytes.section.withoutHelper,
                        card: electrolytes.comparison.withoutCard,
                        iconSrc: ANALYTICS_ELECTROLYTES.withoutSrc,
                        iconPad: ANALYTICS_ELECTROLYTES.withoutPadPx,
                        iconDraw: ANALYTICS_ELECTROLYTES.withoutDrawPx,
                      },
                    ]
                  ).map((block) => (
                    <Box
                      key={block.key}
                      data-testid={`analytics-electrolytes-${block.key}`}
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: CARD_RADIUS,
                        pt: `${ANALYTICS_ELECTROLYTES.cardPadTopPx}px`,
                        px: `${ANALYTICS_ELECTROLYTES.cardPadXPx}px`,
                        pb: `${ANALYTICS_ELECTROLYTES.cardPadBottomPx}px`,
                        display: "flex",
                        flexDirection: "column",
                        gap: `${ANALYTICS_ELECTROLYTES.cardGapPx}px`,
                        boxSizing: "border-box",
                        width: "100%",
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: `${ANALYTICS_ELECTROLYTES.headerGapPx}px`,
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: ANALYTICS_ELECTROLYTES.headerIconSizePx,
                            height: ANALYTICS_ELECTROLYTES.headerIconSizePx,
                            boxSizing: "border-box",
                            p: `${block.iconPad}px`,
                            borderRadius: `${ANALYTICS_ELECTROLYTES.headerIconRadiusPx}px`,
                            bgcolor: ANALYTICS_ELECTROLYTES.headerIconBg,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={block.iconSrc}
                            alt=""
                            aria-hidden
                            sx={{
                              display: "block",
                              width: block.iconDraw,
                              height: block.iconDraw,
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: `${ANALYTICS_ELECTROLYTES.headerTitleGapPx}px`,
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <Typography
                            component="h3"
                            sx={{
                              m: 0,
                              fontWeight: ANALYTICS_CARD.titleWeight,
                              fontSize: ANALYTICS_CARD.titleSizePx,
                              lineHeight: `${ANALYTICS_CARD.titleLineHeightPx}px`,
                              color: ANALYTICS_ELECTROLYTES.textColor,
                            }}
                          >
                            {block.title}
                          </Typography>
                          <Typography
                            sx={{
                              m: 0,
                              fontWeight: 400,
                              fontSize: ANALYTICS_CARD.helperSizePx,
                              lineHeight: `${ANALYTICS_ELECTROLYTES.headerHelperLinePx}px`,
                              color: ANALYTICS_ELECTROLYTES.headerHelperColor,
                            }}
                          >
                            {block.helper}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: `${ANALYTICS_ELECTROLYTES.statsRowGapPx}px`,
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: `${ANALYTICS_ELECTROLYTES.statsColGapPx}px`,
                            width: "100%",
                          }}
                        >
                          <ElectrolyteMetric
                            divider
                            iconSrc={ANALYTICS_ELECTROLYTES.hrSrc}
                            iconBg={ANALYTICS_ELECTROLYTES.hrBg}
                            label={electrolytes.section.metricAvgHr}
                            value={
                              block.card.avgHr == null
                                ? "—"
                                : String(Math.round(block.card.avgHr))
                            }
                            unit={electrolytes.section.unitBpm}
                          />
                          <ElectrolyteMetric
                            iconSrc={ANALYTICS_ELECTROLYTES.restingSrc}
                            iconBg={ANALYTICS_ELECTROLYTES.restingBg}
                            label={electrolytes.section.metricAvgResting}
                            value={
                              block.card.avgResting == null
                                ? "—"
                                : String(Math.round(block.card.avgResting))
                            }
                            unit={electrolytes.section.unitBpm}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: `${ANALYTICS_ELECTROLYTES.statsColGapPx}px`,
                            width: "100%",
                          }}
                        >
                          <ElectrolyteMetric
                            divider
                            iconSrc={ANALYTICS_ELECTROLYTES.walkingSrc}
                            iconBg={ANALYTICS_ELECTROLYTES.walkingBg}
                            label={electrolytes.section.metricAvgWalking}
                            value={
                              block.card.avgWalking == null
                                ? "—"
                                : String(Math.round(block.card.avgWalking))
                            }
                            unit={electrolytes.section.unitBpm}
                          />
                          <ElectrolyteMetric
                            iconSrc={ANALYTICS_ELECTROLYTES.bpSrc}
                            iconBg={ANALYTICS_ELECTROLYTES.bpBg}
                            label={electrolytes.section.metricAvgBp}
                            value={block.card.avgBp ?? "—"}
                          />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
      ) : null}
      </Box>
    </Box>
  );
}
