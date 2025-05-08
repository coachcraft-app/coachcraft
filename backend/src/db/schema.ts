import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, check } from "drizzle-orm/sqlite-core";

// A user of the application
export const UsersTable = sqliteTable("user", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    username: text(),
    email: text(),
    firstname: text(),
    lastname: text(),
    lastLogin: text("last_login"),
    role: text({ enum: ["coach", "parent", "anonymous"]}).default("anonymous"),
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
})

// Activities that are part of a session
export const ActivitiesTable = sqliteTable("activity", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    session: integer({ mode: 'number' })
        .references(() => SessionsTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
        .notNull(),
    title: text().notNull().unique(),
    description: text(),
    duration: integer({ mode: 'number' }).notNull(),
});

// Activities that can be added to a session
export const ActivityTemplatesTable = sqliteTable("activity_template", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text().notNull().unique(),
    description: text(),
    duration: integer({ mode: 'number' }).notNull(),
});
