/**
 * SQLite to Drizzle schema
 *
 * This handles creation of typing and the internal schema the
 * drizzle instances will use. Relations are used as
 * drizzle-graphql requires them for the conversion to graphql
 * @module
 */

import { sql, relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

/** A user of the application */
export const users = sqliteTable("users", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  sub: text().notNull().unique(),
  email: text(),
  givenName: text(),
  profilePic: text(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** A sports team */
export const teams = sqliteTable("teams", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text(),
  owner: text(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Relation between teams, their sessions and players */
export const teamsRelations = relations(teams, ({ many }) => ({
  session: many(sessions),
  player: many(players),
}));

/** A scheduled sports session */
export const sessions = sqliteTable("session", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  // user: integer( {mode: 'number' })
  //     // .references(() => UsersTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
  //     .notNull(),
  date: integer({ mode: "timestamp" }).notNull(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  notes: text().notNull(),
  team: integer({ mode: "number" })
    .references(() => teams.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
});

/** Relations needed for findMany/First/etc. */
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  activities: many(activities),
  teams: one(teams, {
    fields: [sessions.team],
    references: [teams.id],
  }),
}));

/** Activities that are part of a session */
export const activities = sqliteTable("activity", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  session: integer({ mode: "number" })
    .references(() => sessions.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  name: text().notNull().unique(),
  description: text(),
  duration: integer({ mode: "number" }).notNull(),
  imgUrl: text("img_url"),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Relations between a scheduled activity and its session */
export const activitiesRelations = relations(activities, ({ one }) => ({
  session: one(sessions, {
    fields: [activities.session],
    references: [sessions.id],
  }),
}));

/** A sports player */
export const players = sqliteTable("players", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  team: integer({ mode: "number" })
    .references(() => teams.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Relation between a player and their team */
export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.team],
    references: [teams.id],
  }),
}));

// ----- ACTIVITY TEMPLATE CREATION -----
/** Activities that can be added to a session */
export const activityTemplates = sqliteTable("activity_template", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text(),
  duration: integer({ mode: "number" }).notNull(),
  imgUrl: text("img_url"),
  owner: text(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Realtion between a activity template and their category lists */
export const activityTemplateRelations = relations(
  activityTemplates,
  ({ many }) => ({
    activityTemplatesToList: many(activityTemplateList),
  })
);

/** A list (or category) of activity templates for organisation */
export const lists = sqliteTable("list", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  accentColor: text(),
  owner: text(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Relation between a list/category and its contained activities */
export const listRelations = relations(lists, ({ many }) => ({
  listToActivityTemplate: many(activityTemplateList),
}));

/** The many-to-many link between activities and lists */
export const activityTemplateList = sqliteTable("activity_template_list", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  activityTemplate: integer("activity_template", { mode: "number" })
    .references(() => activityTemplates.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  list: integer({ mode: "number" })
    .references(() => lists.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Relates the many-to-one relation of list and activity templates */
export const activityTemplateListRelations = relations(
  activityTemplateList,
  ({ one }) => ({
    activityTemplate: one(activityTemplates, {
      fields: [activityTemplateList.activityTemplate],
      references: [activityTemplates.id],
    }),
    list: one(lists, {
      fields: [activityTemplateList.list],
      references: [lists.id],
    }),
  })
);
