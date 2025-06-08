ALTER TABLE `activity_template` RENAME COLUMN "title" TO "name";--> statement-breakpoint
DROP INDEX `activity_template_title_unique`;--> statement-breakpoint
ALTER TABLE `activity_template` ADD `img_url` text;--> statement-breakpoint
CREATE UNIQUE INDEX `activity_template_name_unique` ON `activity_template` (`name`);