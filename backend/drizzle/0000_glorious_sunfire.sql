CREATE TABLE `activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session`) REFERENCES `session`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activity_title_unique` ON `activity` (`title`);--> statement-breakpoint
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
	`title` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activity_template_title_unique` ON `activity_template` (`title`);--> statement-breakpoint
CREATE TABLE `list` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user` integer NOT NULL,
	`date` integer NOT NULL,
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_date_unique` ON `session` (`date`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text,
	`email` text,
	`firstname` text,
	`lastname` text,
	`last_login` text,
	`role` text DEFAULT 'anonymous',
	`lastModified` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "role_check" CHECK("user"."role" in ('coach', 'parent', 'anonymous'))
);
