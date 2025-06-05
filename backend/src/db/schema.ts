import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, check } from "drizzle-orm/sqlite-core";

// ----- SESSION CREATION -----
// A user of the application
export const UsersTable = sqliteTable("user", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    username: text(),
    email: text(),
    firstname: text(),
    lastname: text(),
    lastLogin: text("last_login"),
    role: text({ enum: ["coach", "parent", "anonymous"]}).default("anonymous"),
    lastModified: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
}, (table) => [
    check("role_check", sql`${table.role} in ('coach', 'parent', 'anonymous')`)
]);

// A scheduled sports session
export const SessionsTable = sqliteTable("session", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    user: integer( {mode: 'number' })
        .references(() => UsersTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
        .notNull(),
    date: integer({ mode: 'timestamp' }).unique().notNull(),
    lastModified: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
});

// Activities that are part of a session
export const ActivitiesTable = sqliteTable("activity", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    session: integer({ mode: 'number' })
        .references(() => SessionsTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
        .notNull(),
    title: text().notNull().unique(),
    description: text(),
    duration: integer({ mode: 'number' }).notNull(),
    lastModified: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
});


// ----- ACTIVITY TEMPLATE CREATION -----
// Activities that can be added to a session
export const ActivityTemplatesTable = sqliteTable("activity_template", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text().notNull().unique(),
    description: text(),
    duration: integer({ mode: 'number' }).notNull(),
    lastModified: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
});

// A list (or category) of activity templates for organisation
export const ListTable = sqliteTable("list", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text(),
    accentColor: text(),
    lastModified: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
});

// The many-to-many link between activities and lists
export const ActivityTemplateListTable = sqliteTable("activity_template_list", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    activityTemplate: integer( "activity_template", {mode: 'number' })
        .references(() => ActivityTemplatesTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
        .notNull(),
    list: integer({mode: 'number' })
        .references(() => ListTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
        .notNull(),
    lastModified: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
});
