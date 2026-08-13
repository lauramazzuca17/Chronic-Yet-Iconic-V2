const ZONE = "America/New_York";

/** America/New_York calendar date `YYYY-MM-DD`. */
export function calendarDateInNewYork(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Wall-clock `YYYY-MM-DDTHH:mm:ss` in America/New_York. */
export function wallClockNowInNewYork(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

/** Value for `<input type="datetime-local">` (minutes precision). */
export function datetimeLocalNowInNewYork(date: Date = new Date()): string {
  return wallClockNowInNewYork(date).slice(0, 16);
}

/** Normalize datetime-local (`YYYY-MM-DDTHH:mm`) to store `recorded_at`. */
export function recordedAtFromDatetimeLocal(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return `${value}:00`;
  }
  return value;
}
