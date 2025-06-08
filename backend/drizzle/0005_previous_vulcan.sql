PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_list` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`accentColor` text,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_list`("id", "name", "accentColor", "lastModified") SELECT "id", "name", "accentColor", "lastModified" FROM `list`;--> statement-breakpoint
DROP TABLE `list`;--> statement-breakpoint
ALTER TABLE `__new_list` RENAME TO `list`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `list_name_unique` ON `list` (`name`);