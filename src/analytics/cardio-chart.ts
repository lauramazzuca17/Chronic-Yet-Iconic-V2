/**
 * Client-safe Chart 2 (BP & HR overlay) + Chart 3 (HR-band stack) helpers.
 * Keep this file free of log/import stores — those pull Node builtins into the
 * Analytics client chunk and break `next build`.
 */

export type HrBurdenBandId = "low" | "mid" | "high" | "tachy";

/** Bottom → top of the stacked bar. Colors match `--cyi-hr-band-*` tokens. */
export const HR_BURDEN_BANDS = [
  { id: "low", label: "0–69", color: "#367057" },
  { id: "mid", label: "70–84", color: "#e3b23c" },
  { id: "high", label: "85–95", color: "#f08429" },
  { id: "tachy", label: "96+", color: "#d91c1c" },
] as const satisfies ReadonlyArray<{
  id: HrBurdenBandId;
  label: string;
  color: string;
}>;

export type HrBurdenBandPercents = Record<HrBurdenBandId, number>;

export function hrBurdenBandId(bpm: number): HrBurdenBandId {
  if (bpm <= 69) return "low";
  if (bpm <= 84) return "mid";
  if (bpm <= 95) return "high";
  return "tachy";
}

/** Share of readings in each band (0–100). Null when there are no readings. */
export function hrBurdenBandPercents(
  readings: readonly number[]
): HrBurdenBandPercents | null {
  if (readings.length === 0) return null;
  const counts: HrBurdenBandPercents = { low: 0, mid: 0, high: 0, tachy: 0 };
  for (const bpm of readings) {
    counts[hrBurdenBandId(bpm)] += 1;
  }
  const n = readings.length;
  return {
    low: (counts.low / n) * 100,
    mid: (counts.mid / n) * 100,
    high: (counts.high / n) * 100,
    tachy: (counts.tachy / n) * 100,
  };
}

/** Y-axis tick — one string so Recharts `unit="%"` cannot reverse `100%` to `001%`. */
export function formatHrBurdenAxisTick(value: number): string {
  return `${Math.round(value)}%`;
}

/** Hide labels on slivers that cannot fit a readable `n%`. */
export const HR_BURDEN_BAR_LABEL_MIN_PERCENT = 8;

export function formatHrBurdenBarLabel(value: unknown): string {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n < HR_BURDEN_BAR_LABEL_MIN_PERCENT) return "";
  return `${n}%`;
}

export function hrBurdenBarLabelFill(bandId: HrBurdenBandId): string {
  return bandId === "mid" ? "#1d1b20" : "#ffffff";
}

export type HrBurdenPieSlice = {
  id: HrBurdenBandId;
  label: string;
  value: number;
  color: string;
};

/** Pie slices for a day’s band shares. Omits 0% so empty wedges are not drawn. */
export function hrBurdenPieSlices(
  bands: HrBurdenBandPercents | null
): HrBurdenPieSlice[] {
  if (!bands) return [];
  return HR_BURDEN_BANDS.filter((band) => bands[band.id] > 0).map((band) => ({
    id: band.id,
    label: band.label,
    value: bands[band.id],
    color: band.color,
  }));
}

export type CardioOverlayRangeId = "today" | "last_7" | "last_30";

export type BpHrOverlayChartInput = {
  range: CardioOverlayRangeId;
  startDate: string;
  endDate: string;
  bp: ReadonlyArray<{ recordedAt: string; value: number }>;
  hr: ReadonlyArray<{ recordedAt: string; value: number }>;
};

export type BpHrOverlayChartRow = {
  x: number;
  bp?: number;
  hr?: number;
};

export type BpHrOverlayChartTick = {
  x: number;
  label: string;
};

export type BpHrOverlayChartView = {
  xMin: number;
  xMax: number;
  ticks: BpHrOverlayChartTick[];
  rows: BpHrOverlayChartRow[];
};

/** Dense imported HR makes point markers unreadable; lines only. */
export const BP_HR_OVERLAY_SHOW_DOTS = false;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Parse wall-clock `YYYY-MM-DDTHH:mm:ss` as UTC components (NY wall). */
export function overlayWallClockToUtcMs(recordedAt: string): number {
  const [datePart, timePart = "00:00:00"] = recordedAt.split("T");
  const [ys, ms, ds] = datePart.split("-");
  const [hs, mins, secs] = timePart.split(":");
  return Date.UTC(
    Number(ys),
    Number(ms) - 1,
    Number(ds),
    Number(hs),
    Number(mins ?? 0),
    Number(secs ?? 0)
  );
}

function toCalendarDate(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, "0")}-${pad2(m)}-${pad2(d)}`;
}

export function shiftCalendarDate(calendarDate: string, deltaDays: number): string {
  const [ys, ms, ds] = calendarDate.split("-").map(Number);
  const noon = new Date(Date.UTC(ys, ms - 1, ds, 12));
  noon.setUTCDate(noon.getUTCDate() + deltaDays);
  return toCalendarDate(
    noon.getUTCFullYear(),
    noon.getUTCMonth() + 1,
    noon.getUTCDate()
  );
}

export const TACHYCARDIA_BURDEN_DAYS = 7;

export function defaultTachycardiaBurdenEndDate(today: string): string {
  return shiftCalendarDate(today, -1);
}

export function tachycardiaBurdenWindow(endDate: string): {
  startDate: string;
  endDate: string;
} {
  return {
    startDate: shiftCalendarDate(endDate, -(TACHYCARDIA_BURDEN_DAYS - 1)),
    endDate,
  };
}

export function shiftTachycardiaBurdenEndDate(
  endDate: string,
  direction: "prev" | "next"
): string {
  return shiftCalendarDate(endDate, direction === "next" ? 1 : -1);
}

export function clampTachycardiaBurdenEndDate(
  endDate: string,
  today: string
): string {
  const latest = defaultTachycardiaBurdenEndDate(today);
  return endDate > latest ? latest : endDate;
}

export function formatTachycardiaBurdenWindow(
  startDate: string,
  endDate: string
): string {
  const fmt = (calendarDate: string) => {
    const [, month, day] = calendarDate.split("-");
    return `${month}/${day}`;
  };
  return `${fmt(startDate)} – ${fmt(endDate)}`;
}

function listCalendarDays(startDate: string, endDate: string): string[] {
  const days: string[] = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    days.push(cursor);
    cursor = shiftCalendarDate(cursor, 1);
  }
  return days;
}

function dayStartMs(calendarDate: string): number {
  return overlayWallClockToUtcMs(`${calendarDate}T00:00:00`);
}

function formatDayTick(calendarDate: string): string {
  const [, month, day] = calendarDate.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function formatHourTick(ms: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(ms));
}

function ticksForRange(
  range: CardioOverlayRangeId,
  startDate: string,
  endDate: string
): BpHrOverlayChartTick[] {
  if (range === "today") {
    return [0, 6, 12, 18].map((hour) => {
      const x = overlayWallClockToUtcMs(
        `${startDate}T${pad2(hour)}:00:00`
      );
      return { x, label: formatHourTick(x) };
    });
  }

  const days = listCalendarDays(startDate, endDate);
  const step = range === "last_30" ? 5 : 1;
  const picked: string[] = [];
  for (let i = 0; i < days.length; i += step) {
    picked.push(days[i]!);
  }
  if (picked[picked.length - 1] !== endDate) {
    picked.push(endDate);
  }
  return picked.map((day) => ({
    x: dayStartMs(day),
    label: formatDayTick(day),
  }));
}

export function buildBpHrOverlayChartView(
  series: BpHrOverlayChartInput
): BpHrOverlayChartView {
  const xMin = dayStartMs(series.startDate);
  const xMax = dayStartMs(shiftCalendarDate(series.endDate, 1));
  const ticks = ticksForRange(series.range, series.startDate, series.endDate);

  const byX = new Map<number, BpHrOverlayChartRow>();
  for (const point of series.bp) {
    const x = overlayWallClockToUtcMs(point.recordedAt);
    const row = byX.get(x) ?? { x };
    row.bp = point.value;
    byX.set(x, row);
  }
  for (const point of series.hr) {
    const x = overlayWallClockToUtcMs(point.recordedAt);
    const row = byX.get(x) ?? { x };
    row.hr = point.value;
    byX.set(x, row);
  }
  const rows = [...byX.values()].sort((a, b) => a.x - b.x);

  return { xMin, xMax, ticks, rows };
}

/** Tooltip label: clock on Today; date + clock on multi-day ranges. */
export function formatBpHrOverlayTooltipLabel(
  x: number,
  range: CardioOverlayRangeId
): string {
  const clock = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(x));
  if (range === "today") return clock;
  const m = new Date(x).getUTCMonth() + 1;
  const d = new Date(x).getUTCDate();
  return `${m}/${d} ${clock}`;
}
