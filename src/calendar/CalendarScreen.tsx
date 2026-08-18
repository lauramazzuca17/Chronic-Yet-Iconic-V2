"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { deleteManualLogAction } from "@/log/actions";
import { formatEntriesCount } from "@/log/copy";
import {
  formatEntryEyebrow,
  formatEntrySummary,
  MANUAL_TYPE_LABEL,
} from "@/log/entry-display";
import { LogEntryCard } from "@/log/LogEntryCard";
import { LOG_CARD } from "@/log/layout";
import type { ManualLogEntry } from "@/log/store";
import {
  buildMonthGrid,
  formatCalendarDayHeading,
  MONTH_SHORT_LABELS,
  shiftMonth,
  WEEKDAY_LABELS,
  yearMonthFromCalendarDate,
} from "@/calendar/selection";
import {
  CALENDAR_CARD_SX,
  CALENDAR_DAY,
  CALENDAR_DAY_GRID_MAX_WIDTH_PX,
  CALENDAR_LAYOUT,
  CALENDAR_PICKER,
} from "@/calendar/layout";

const ACCENT = "#f08429";

const cardSx = CALENDAR_CARD_SX;

function pickerChevronSx() {
  const visual = CALENDAR_PICKER.chevronVisualPx;
  const hit = CALENDAR_PICKER.chevronHitPx;
  return {
    position: "relative" as const,
    width: visual,
    height: visual,
    minWidth: visual,
    p: 0,
    flexShrink: 0,
    fontSize: 20,
    lineHeight: 1,
    "&::after": {
      content: '""',
      position: "absolute",
      inset: `${(visual - hit) / 2}px`,
    },
  };
}

/** Figma weekday row and day grid share one 7-column track. */
const dayGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: `${CALENDAR_DAY.gapPx}px`,
  width: "100%",
  maxWidth: `${CALENDAR_DAY_GRID_MAX_WIDTH_PX}px`,
  mx: "auto",
};

export type CalendarScreenProps = {
  selectedDate: string;
  today: string;
  entries: ManualLogEntry[];
};

/** Calendar month grid + day entry list — Figma FEAT-006. */
export function CalendarScreen({
  selectedDate,
  today,
  entries,
}: CalendarScreenProps) {
  const router = useRouter();
  const initial = yearMonthFromCalendarDate(selectedDate);
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);

  const grid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  function selectDate(calendarDate: string) {
    setArmedDeleteId(null);
    const ym = yearMonthFromCalendarDate(calendarDate);
    setViewYear(ym.year);
    setViewMonth(ym.month);
    router.push(`/calendar?date=${calendarDate}`);
  }

  function onShift(delta: number) {
    const next = shiftMonth(viewYear, viewMonth, delta);
    setViewYear(next.year);
    setViewMonth(next.month);
  }

  async function onDelete(id: string) {
    if (armedDeleteId !== id) {
      setArmedDeleteId(id);
      return;
    }
    setArmedDeleteId(null);
    await deleteManualLogAction(id);
    router.refresh();
  }

  const years = Array.from({ length: 11 }, (_, i) => viewYear - 5 + i);

  return (
    <Box
      component="main"
      sx={{
        px: `${CALENDAR_LAYOUT.gutterPx}px`,
        pb: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          ...cardSx,
          p: `${CALENDAR_LAYOUT.cardPadPx}px`,
          pt: `${CALENDAR_LAYOUT.monthCardPadTopPx}px`,
        }}
        data-testid="calendar-month-card"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: `${CALENDAR_PICKER.rowGapPx}px`,
            mb: 1.5,
            minWidth: 0,
          }}
        >
          <IconButton
            aria-label="Previous month"
            onClick={() => onShift(-1)}
            sx={pickerChevronSx()}
          >
            ‹
          </IconButton>
          <Box
            sx={{
              display: "flex",
              gap: `${CALENDAR_PICKER.fieldGapPx}px`,
              flex: 1,
              minWidth: 0,
            }}
          >
            <TextField
              select
              size="small"
              label="Month"
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              sx={{
                flex: "1 1 0",
                minWidth: CALENDAR_PICKER.monthMinWidthPx,
              }}
            >
              {MONTH_SHORT_LABELS.map((label, i) => (
                <MenuItem key={label} value={i + 1}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="Year"
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              sx={{
                flex: "0 0 auto",
                width: CALENDAR_PICKER.yearMinWidthPx,
                minWidth: CALENDAR_PICKER.yearMinWidthPx,
                "& .MuiSelect-select": {
                  overflow: "hidden",
                  textOverflow: "clip",
                },
              }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <IconButton
            aria-label="Next month"
            onClick={() => onShift(1)}
            sx={pickerChevronSx()}
          >
            ›
          </IconButton>
        </Box>

        <Box sx={{ ...dayGridSx, mb: 0.5 }}>
          {WEEKDAY_LABELS.map((label) => (
            <Typography
              key={label}
              component="span"
              sx={{
                textAlign: "center",
                fontSize: CALENDAR_DAY.weekdayFontSizePx,
                lineHeight: `${CALENDAR_DAY.weekdayLineHeightPx}px`,
                color: CALENDAR_DAY.weekdayColor,
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box sx={dayGridSx} role="grid" aria-label="Calendar days">
          {grid.map((cell) => {
            const selected = cell.calendarDate === selectedDate;
            const isToday = cell.calendarDate === today;
            return (
              <Button
                key={cell.calendarDate}
                role="gridcell"
                data-testid={`calendar-day-${cell.calendarDate}`}
                data-selected={selected ? "true" : "false"}
                data-today={isToday ? "true" : "false"}
                aria-current={isToday ? "date" : undefined}
                onClick={() => selectDate(cell.calendarDate)}
                sx={{
                  minWidth: 0,
                  p: 0,
                  // Hit target holds the 44px floor; the Figma visual is 40px.
                  minHeight: CALENDAR_DAY.hitTargetPx,
                  borderRadius: `${CALENDAR_DAY.radiusPx}px`,
                  "&:hover": { bgcolor: "transparent" },
                  "&:hover > span": {
                    bgcolor: selected
                      ? CALENDAR_DAY.selectedBg
                      : "rgba(240,132,41,0.12)",
                  },
                  "&.Mui-focusVisible > span": {
                    outline: `2px solid ${ACCENT}`,
                    outlineOffset: "2px",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: "100%",
                    maxWidth: CALENDAR_DAY.visualSizePx,
                    height: CALENDAR_DAY.visualSizePx,
                    boxSizing: "border-box",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: `${CALENDAR_DAY.radiusPx}px`,
                    fontSize: CALENDAR_DAY.fontSizePx,
                    fontWeight: 400,
                    bgcolor: selected
                      ? CALENDAR_DAY.selectedBg
                      : "transparent",
                    color: selected
                      ? CALENDAR_DAY.selectedColor
                      : cell.inMonth
                        ? CALENDAR_DAY.inMonthColor
                        : CALENDAR_DAY.outOfMonthColor,
                    textDecoration: isToday
                      ? CALENDAR_DAY.todayDecoration
                      : "none",
                    textUnderlineOffset: `${CALENDAR_DAY.todayUnderlineOffsetPx}px`,
                  }}
                >
                  {cell.dayOfMonth}
                </Box>
              </Button>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ ...cardSx, px: 2, pt: 1.5, pb: 2 }} data-testid="calendar-day-list">
        <Typography
          component="h2"
          data-testid="calendar-day-heading"
          sx={{
            fontWeight: 700,
            fontSize: 18,
            color: "text.primary",
            m: 0,
          }}
        >
          {formatCalendarDayHeading(selectedDate, today)}
        </Typography>
        <Typography
          data-testid="calendar-entries-count"
          sx={{ color: "text.secondary", fontSize: 14, mb: 1.5 }}
        >
          {formatEntriesCount(entries.length)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: `${LOG_CARD.listGapPx}px`,
          }}
        >
          {entries.map((entry) => (
            <LogEntryCard
              key={entry.id}
              testId="calendar-entry"
              summary={formatEntrySummary(entry)}
              eyebrow={formatEntryEyebrow(
                MANUAL_TYPE_LABEL[entry.type],
                entry.recordedAt
              )}
              armed={armedDeleteId === entry.id}
              onDelete={() => onDelete(entry.id)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
