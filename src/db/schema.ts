/**
 * Drizzle schema — binding [[03-data-model]] (FEAT-009 / NFR-07).
 */
import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull(),
});

export const symptomCatalog = sqliteTable(
  "symptom_catalog",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id),
    name: text("name").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [uniqueIndex("symptom_catalog_account_name").on(t.accountId, t.name)]
);

export const medicationCatalog = sqliteTable(
  "medication_catalog",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id),
    name: text("name").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [
    uniqueIndex("medication_catalog_account_name").on(t.accountId, t.name),
  ]
);

export const symptomLogs = sqliteTable("symptom_logs", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  symptomCatalogId: text("symptom_catalog_id")
    .notNull()
    .references(() => symptomCatalog.id),
  severity: text("severity").notNull(),
  notes: text("notes"),
  recordedAt: text("recorded_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const bloodPressureLogs = sqliteTable("blood_pressure_logs", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  systolic: integer("systolic").notNull(),
  diastolic: integer("diastolic").notNull(),
  heartRate: integer("heart_rate").notNull(),
  recordedAt: text("recorded_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const medicationLogs = sqliteTable("medication_logs", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  medicationCatalogId: text("medication_catalog_id")
    .notNull()
    .references(() => medicationCatalog.id),
  dose: text("dose").notNull(),
  recordedAt: text("recorded_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const waterLogs = sqliteTable("water_logs", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  amountOz: real("amount_oz").notNull(),
  recordedAt: text("recorded_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const electrolyteLogs = sqliteTable(
  "electrolyte_logs",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id),
    taken: integer("taken", { mode: "boolean" }).notNull(),
    recordedAt: text("recorded_at").notNull(),
    calendarDate: text("calendar_date").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [
    uniqueIndex("electrolyte_account_date").on(t.accountId, t.calendarDate),
  ]
);

export const moodLogs = sqliteTable("mood_logs", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  mood: text("mood").notNull(),
  recordedAt: text("recorded_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const eventLogs = sqliteTable("event_logs", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  note: text("note").notNull(),
  recordedAt: text("recorded_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const importBatches = sqliteTable("import_batches", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  pairId: text("pair_id").notNull(),
  sourceFormat: text("source_format").notNull(),
  originalFilename: text("original_filename"),
  status: text("status").notNull(),
  importedAt: text("imported_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const importedSamples = sqliteTable(
  "imported_samples",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id),
    importBatchId: text("import_batch_id")
      .notNull()
      .references(() => importBatches.id),
    metricKey: text("metric_key").notNull(),
    value: real("value").notNull(),
    unit: text("unit").notNull(),
    recordedAt: text("recorded_at").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [
    uniqueIndex("imported_sample_dedupe").on(
      t.accountId,
      t.metricKey,
      t.recordedAt,
      t.value
    ),
  ]
);
