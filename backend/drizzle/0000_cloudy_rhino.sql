CREATE TABLE `activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	FOREIGN KEY (`session`) REFERENCES `session`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activity_title_unique` ON `activity` (`title`);--> statement-breakpoint
CREATE TABLE `activity_template` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activity_template_title_unique` ON `activity_template` (`title`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user` integer NOT NULL,
	`date` integer NOT NULL,
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
	CONSTRAINT "role_check" CHECK("user"."role" in ('coach', 'parent', 'anonymous'))
);
