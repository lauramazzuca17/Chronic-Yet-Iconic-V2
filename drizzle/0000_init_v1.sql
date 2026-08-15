CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_username_unique` ON `accounts` (`username`);--> statement-breakpoint
CREATE TABLE `blood_pressure_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`systolic` integer NOT NULL,
	`diastolic` integer NOT NULL,
	`heart_rate` integer NOT NULL,
	`recorded_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `electrolyte_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`taken` integer NOT NULL,
	`recorded_at` text NOT NULL,
	`calendar_date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `electrolyte_account_date` ON `electrolyte_logs` (`account_id`,`calendar_date`);--> statement-breakpoint
CREATE TABLE `event_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`note` text NOT NULL,
	`recorded_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `import_batches` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`pair_id` text NOT NULL,
	`source_format` text NOT NULL,
	`original_filename` text,
	`status` text NOT NULL,
	`imported_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `imported_samples` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`import_batch_id` text NOT NULL,
	`metric_key` text NOT NULL,
	`value` real NOT NULL,
	`unit` text NOT NULL,
	`recorded_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`import_batch_id`) REFERENCES `import_batches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `imported_sample_dedupe` ON `imported_samples` (`account_id`,`metric_key`,`recorded_at`,`value`);--> statement-breakpoint
CREATE TABLE `medication_catalog` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medication_catalog_account_name` ON `medication_catalog` (`account_id`,`name`);--> statement-breakpoint
CREATE TABLE `medication_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`medication_catalog_id` text NOT NULL,
	`dose` text NOT NULL,
	`recorded_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`medication_catalog_id`) REFERENCES `medication_catalog`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mood_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`mood` text NOT NULL,
	`recorded_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `symptom_catalog` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `symptom_catalog_account_name` ON `symptom_catalog` (`account_id`,`name`);--> statement-breakpoint
CREATE TABLE `symptom_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`symptom_catalog_id` text NOT NULL,
	`severity` text NOT NULL,
	`notes` text,
	`recorded_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`symptom_catalog_id`) REFERENCES `symptom_catalog`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `water_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`amount_oz` real NOT NULL,
	`recorded_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
