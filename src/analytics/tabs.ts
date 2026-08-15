/**
 * Analytics tab chips (Figma order). Labels from copy deck keys analytics.tab.*.
 */

export type AnalyticsTabId =
  | "medication"
  | "cardiovascular"
  | "recovery"
  | "electrolytes";

export type AnalyticsTab = {
  id: AnalyticsTabId;
  label: string;
  labelKey: `analytics.tab.${AnalyticsTabId}`;
};

const TABS: readonly AnalyticsTab[] = [
  {
    id: "medication",
    label: "Medication",
    labelKey: "analytics.tab.medication",
  },
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    labelKey: "analytics.tab.cardiovascular",
  },
  {
    id: "recovery",
    label: "Recovery",
    labelKey: "analytics.tab.recovery",
  },
  {
    id: "electrolytes",
    label: "Electrolytes",
    labelKey: "analytics.tab.electrolytes",
  },
] as const;

export function getAnalyticsTabs(): AnalyticsTab[] {
  return [...TABS];
}

export function getDefaultAnalyticsTab(): AnalyticsTabId {
  return "medication";
}
