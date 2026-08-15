import { requireSession } from "@/auth/current-session";
import { CalendarScreen } from "@/calendar/CalendarScreen";
import { listManualLogsForDate } from "@/calendar/day-entries";
import { getDefaultSelectedCalendarDate } from "@/calendar/selection";
import { calendarDateInNewYork } from "@/log/timezone";

type CalendarPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const session = await requireSession();
  const today = calendarDateInNewYork();
  const params = await searchParams;
  const requested = params.date;
  const selectedDate =
    requested && /^\d{4}-\d{2}-\d{2}$/.test(requested)
      ? requested
      : getDefaultSelectedCalendarDate();
  const entries = await listManualLogsForDate(session.accountId, selectedDate);

  return (
    <CalendarScreen
      selectedDate={selectedDate}
      today={today}
      entries={entries}
    />
  );
}
