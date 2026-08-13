/** Binding symptom names from [[03-data-model]] (FEAT-004). */
export const SYMPTOM_CATALOG_NAMES = [
  "Fatigue",
  "Dizzy",
  "Lightheaded",
  "Nauseous",
  "Syncope",
  "Joint Pain",
  "Joint Stiffness",
] as const;

export type SymptomCatalogName = (typeof SYMPTOM_CATALOG_NAMES)[number];

export function isSymptomCatalogName(name: string): name is SymptomCatalogName {
  return (SYMPTOM_CATALOG_NAMES as readonly string[]).includes(name);
}

/** Binding medication names from [[03-data-model]] (FEAT-004). */
export const MEDICATION_CATALOG_NAMES = [
  "Midodrine",
  "Propranolol",
  "Claritin",
  "Adderall XR",
  "Magnesium Glycinate",
  "Gabapentin",
  "Celecoxib",
  "Metoclopramide",
  "Tirzepatide",
  "Vitamin D",
] as const;

export type MedicationCatalogName = (typeof MEDICATION_CATALOG_NAMES)[number];

export function isMedicationCatalogName(
  name: string
): name is MedicationCatalogName {
  return (MEDICATION_CATALOG_NAMES as readonly string[]).includes(name);
}
