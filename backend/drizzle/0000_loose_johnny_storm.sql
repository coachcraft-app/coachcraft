CREATE TABLE `activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	`img_url` text,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session`) REFERENCES `session`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activity_name_unique` ON `activity` (`name`);--> statement-breakpoint
CREATE TABLE `activity_template_list` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activity_template` integer NOT NULL,
	`list` integer NOT NULL,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`activity_template`) REFERENCES `activity_template`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`list`) REFERENCES `list`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `activity_template` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	`img_url` text,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activity_template_name_unique` ON `activity_template` (`name`);--> statement-breakpoint
CREATE TABLE `list` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`accentColor` text,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `list_name_unique` ON `list` (`name`);--> statement-breakpoint
CREATE TABLE `note` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`user` integer NOT NULL,
	`date` integer NOT NULL,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL,
	`notes` integer NOT NULL,
	FOREIGN KEY (`notes`) REFERENCES `note`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_name_unique` ON `session` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_date_unique` ON `session` (`date`);