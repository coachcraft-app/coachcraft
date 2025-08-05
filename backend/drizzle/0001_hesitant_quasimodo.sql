DROP TABLE `note`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`user` integer NOT NULL,
	`date` integer NOT NULL,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL,
	`notes` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "name", "user", "date", "lastModified", "notes") SELECT "id", "name", "user", "date", "lastModified", "notes" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `session_name_unique` ON `session` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_date_unique` ON `session` (`date`);