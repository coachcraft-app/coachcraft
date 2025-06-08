ALTER TABLE `activity` RENAME COLUMN "title" TO "name";--> statement-breakpoint
DROP INDEX `activity_title_unique`;--> statement-breakpoint
ALTER TABLE `activity` ADD `img_url` text;--> statement-breakpoint
CREATE UNIQUE INDEX `activity_name_unique` ON `activity` (`name`);