import { sql, relations } from "drizzle-orm";
import { sqliteTable, integer, text, check } from "drizzle-orm/sqlite-core";

// ----- SESSION CREATION -----
// A user of the application
// export const UsersTable = sqliteTable("user", {
//     id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
//     username: text(),
//     email: text(),
//     firstname: text(),
//     lastname: text(),
//     lastLogin: text("last_login"),
//     role: text({ enum: ["coach", "parent", "anonymous"]}).default("anonymous"),
//     lastModified: integer({ mode: 'timestamp' })
//         .notNull()
//         .default(sql`(unixepoch())`),
// }, (table) => [
//     check("role_check", sql`${table.role} in ('coach', 'parent', 'anonymous')`)
// ]);

// A sports team
export const teams = sqliteTable("teams", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  session: many(sessions),
  player: many(players),
}));

// A scheduled sports session
export const sessions = sqliteTable("session", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  // user: integer( {mode: 'number' })
  //     // .references(() => UsersTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
  //     .notNull(),
  date: integer({ mode: "timestamp" }).unique().notNull(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  notes: text().notNull(),
  team: integer({ mode: "number" })
    .references(() => teams.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
});

// Relations needed for findMany/First/etc.
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  activities: many(activities),
  teams: one(teams, {
    fields: [sessions.team],
    references: [teams.id],
  }),
}));

// Activities that are part of a session
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

export const activitiesRelations = relations(activities, ({ one }) => ({
  session: one(sessions, {
    fields: [activities.session],
    references: [sessions.id],
  }),
}));

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

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, {
    fields: [players.team],
    references: [teams.id],
  }),
}));

// ----- ACTIVITY TEMPLATE CREATION -----
// Activities that can be added to a session
export const activityTemplates = sqliteTable("activity_template", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text(),
  duration: integer({ mode: "number" }).notNull(),
  imgUrl: text("img_url"),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const activityTemplateRelations = relations(
  activityTemplates,
  ({ many }) => ({
    activityTemplatesToList: many(activityTemplateList),
  })
);

// A list (or category) of activity templates for organisation
export const lists = sqliteTable("list", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  accentColor: text(),
  lastModified: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const listRelations = relations(lists, ({ many }) => ({
  listToActivityTemplate: many(activityTemplateList),
}));

// The many-to-many link between activities and lists
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
