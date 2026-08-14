import { calendarDateInNewYork } from "../log/timezone";

export type MonthGridCell = {
  calendarDate: string;
  dayOfMonth: number;
  inMonth: boolean;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function toCalendarDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/** Default selected day when opening Calendar = today America/New_York. */
export function getDefaultSelectedCalendarDate(now: Date = new Date()): string {
  return calendarDateInNewYork(now);
}

/** Figma: "Today" when selected is today; else "Thursday · August 6, 2026". */
export function formatCalendarDayHeading(
  selectedDate: string,
  todayDate: string
): string {
  if (selectedDate === todayDate) return "Today";
  const [y, m, d] = selectedDate.split("-").map(Number);
  const noon = new Date(Date.UTC(y, m - 1, d, 12));
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
  }).format(noon);
  const month = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
  }).format(noon);
  return `${weekday} · ${month} ${d}, ${y}`;
}

/** Sunday-first month grid for year + 1-based month. */
export function buildMonthGrid(year: number, month: number): MonthGridCell[] {
  const firstDow = new Date(Date.UTC(year, month - 1, 1, 12)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0, 12)).getUTCDate();
  const prevMonthLast = new Date(Date.UTC(year, month - 1, 0, 12)).getUTCDate();
  const cells: MonthGridCell[] = [];

  const prevYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  for (let i = firstDow - 1; i >= 0; i -= 1) {
    const day = prevMonthLast - i;
    cells.push({
      calendarDate: toCalendarDate(prevYear, prevMonth, day),
      dayOfMonth: day,
      inMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      calendarDate: toCalendarDate(year, month, day),
      dayOfMonth: day,
      inMonth: true,
    });
  }

  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({
      calendarDate: toCalendarDate(nextYear, nextMonth, nextDay),
      dayOfMonth: nextDay,
      inMonth: false,
    });
    nextDay += 1;
  }

  return cells;
}

export function shiftMonth(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta;
  return {
    year: Math.floor(index / 12),
    month: (index % 12) + 1,
  };
}

export function yearMonthFromCalendarDate(date: string): {
  year: number;
  month: number;
} {
  const [y, m] = date.split("-").map(Number);
  return { year: y, month: m };
}

export const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export const MONTH_SHORT_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
