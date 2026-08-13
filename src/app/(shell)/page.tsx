import { requireSession } from "@/auth/current-session";
import { DashboardScreen } from "@/dashboard/DashboardScreen";
import { getTodayDashboardSummary } from "@/dashboard/summary";
import { calendarDateInNewYork } from "@/log/timezone";

export default async function DashboardPage() {
  const session = await requireSession();
  const day = calendarDateInNewYork();
  const summary = getTodayDashboardSummary(session.accountId, day);

  return <DashboardScreen summary={summary} />;
}
