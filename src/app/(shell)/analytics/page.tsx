import { loadMedicationImpactView } from "@/analytics/actions";
import { AnalyticsScreen } from "@/analytics/AnalyticsScreen";

export default async function AnalyticsPage() {
  const initial = await loadMedicationImpactView();
  return <AnalyticsScreen initial={initial} />;
}
