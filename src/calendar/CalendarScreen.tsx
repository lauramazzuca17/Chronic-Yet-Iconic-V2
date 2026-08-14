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
import {
  formatEntriesCount,
  LOG_COPY,
} from "@/log/copy";
import type { ManualLogEntry, MoodValue, SymptomSeverity } from "@/log/store";
import {
  buildMonthGrid,
  formatCalendarDayHeading,
  MONTH_SHORT_LABELS,
  shiftMonth,
  WEEKDAY_LABELS,
  yearMonthFromCalendarDate,
} from "@/calendar/selection";

const ACCENT = "#f08429";
const TEAL = "#0B4041";
const CONFIRM_DELETE_COLOR = "#d95c1c";
const CARD_RADIUS = "20px";

const TYPE_LABEL: Record<ManualLogEntry["type"], string> = {
  symptom: LOG_COPY["log.type.symptom"],
  blood_pressure: LOG_COPY["log.type.blood_pressure"],
  medication: LOG_COPY["log.type.medication"],
  water: LOG_COPY["log.type.water"],
  electrolyte: LOG_COPY["log.type.electrolyte"],
  mood: LOG_COPY["log.type.mood"],
  event: LOG_COPY["log.type.event"],
};

const SEVERITY_LABEL: Record<SymptomSeverity, string> = {
  usual: LOG_COPY["log.severity.usual"],
  worse_than_usual: LOG_COPY["log.severity.worse_than_usual"],
  better_than_usual: LOG_COPY["log.severity.better_than_usual"],
};

const MOOD_LABEL: Record<MoodValue, string> = {
  awful: LOG_COPY["log.mood.awful"],
  not_great: LOG_COPY["log.mood.not_great"],
  okay: LOG_COPY["log.mood.okay"],
  good: LOG_COPY["log.mood.good"],
  great: LOG_COPY["log.mood.great"],
};

function entrySummary(entry: ManualLogEntry): string {
  switch (entry.type) {
    case "water":
      return `${entry.amountOz} oz`;
    case "blood_pressure":
      return `${entry.systolic}/${entry.diastolic} - ${entry.heartRate} bpm`;
    case "symptom":
      return `${entry.symptomName} - ${SEVERITY_LABEL[entry.severity]}`;
    case "medication":
      return `${entry.medicationName} · ${entry.dose}`;
    case "electrolyte":
      return LOG_COPY["log.field.taken"];
    case "mood":
      return MOOD_LABEL[entry.mood];
    case "event":
      return entry.note;
  }
}

function entryTimeLabel(recordedAt: string): string {
  const [y, m, d] = recordedAt.slice(0, 10).split("-").map(Number);
  const [hh, mm] = recordedAt.slice(11, 16).split(":").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const cardSx = {
  bgcolor: "#FFFFFF",
  borderRadius: CARD_RADIUS,
  boxShadow:
    "0 4px 4px rgba(12,12,13,0.05), 0 4px 4px rgba(12,12,13,0.1)",
  width: "100%",
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
      sx={{ px: 2, pb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}
    >
      <Box sx={{ ...cardSx, p: 2 }} data-testid="calendar-month-card">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1.5,
          }}
        >
          <IconButton
            aria-label="Previous month"
            onClick={() => onShift(-1)}
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            ‹
          </IconButton>
          <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
            <TextField
              select
              size="small"
              label="Month"
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              fullWidth
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
              fullWidth
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
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            ›
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.5,
            mb: 0.5,
          }}
        >
          {WEEKDAY_LABELS.map((label) => (
            <Typography
              key={label}
              component="span"
              sx={{
                textAlign: "center",
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.5,
          }}
          role="grid"
          aria-label="Calendar days"
        >
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
                onClick={() => selectDate(cell.calendarDate)}
                sx={{
                  minWidth: 0,
                  minHeight: 44,
                  borderRadius: "10px",
                  p: 0,
                  color: selected
                    ? "#fff"
                    : cell.inMonth
                      ? "text.primary"
                      : "text.disabled",
                  bgcolor: selected ? ACCENT : "transparent",
                  borderBottom:
                    isToday && !selected
                      ? `2px solid ${TEAL}`
                      : "2px solid transparent",
                  "&:hover": {
                    bgcolor: selected ? ACCENT : "rgba(240,132,41,0.12)",
                  },
                }}
              >
                {cell.dayOfMonth}
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {entries.map((entry) => {
            const armed = armedDeleteId === entry.id;
            return (
              <Box
                key={entry.id}
                data-testid="calendar-entry"
                sx={{
                  border: "1px solid rgba(142,142,147,0.45)",
                  borderRadius: "12px",
                  px: 1.5,
                  py: 1.25,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", letterSpacing: 0.6 }}
                  >
                    {TYPE_LABEL[entry.type].toUpperCase()} ·{" "}
                    {entryTimeLabel(entry.recordedAt)}
                  </Typography>
                  <Typography sx={{ color: "text.primary" }}>
                    {entrySummary(entry)}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => onDelete(entry.id)}
                  sx={{
                    minHeight: 44,
                    color: armed ? CONFIRM_DELETE_COLOR : "text.secondary",
                    fontWeight: armed ? 700 : 500,
                    flexShrink: 0,
                  }}
                >
                  {armed
                    ? LOG_COPY["log.entry.confirm_delete"]
                    : LOG_COPY["log.entry.delete"]}
                </Button>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
