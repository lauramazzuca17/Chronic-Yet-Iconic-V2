import { requireSession } from "@/auth/current-session";
import { LogScreen } from "@/log/LogScreen";
import { listTodayEntries, waterTotalOzForDate } from "@/log/store";
import { calendarDateInNewYork } from "@/log/timezone";

export default async function LogPage() {
  const session = await requireSession();
  const day = calendarDateInNewYork();
  const entries = listTodayEntries(session.accountId, day);
  const waterTotalOz = waterTotalOzForDate(session.accountId, day);
  const electrolyteBlocked = entries.some((e) => e.type === "electrolyte");

  return (
    <LogScreen
      entries={entries}
      waterTotalOz={waterTotalOz}
      electrolyteBlocked={electrolyteBlocked}
    />
  );
}
