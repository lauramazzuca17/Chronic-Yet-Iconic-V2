import { listTodayEntries, type ManualLogEntry } from "../log/store";
import { getManualLogTypes } from "../log/types";

/** Manual logs for an account on an America/New_York calendar date (Calendar day detail). */
export function listManualLogsForDate(
  accountId: string,
  calendarDate: string
): ManualLogEntry[] {
  const allowed = new Set(getManualLogTypes());
  return listTodayEntries(accountId, calendarDate).filter((e) =>
    allowed.has(e.type)
  );
}
