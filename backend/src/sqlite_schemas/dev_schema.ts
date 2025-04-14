import { sqliteTable, int, text} from "drizzle-orm/sqlite-core";

// no type for Date/Time in SQLite, documentation advices using built-in date and time functions for storing them as TEXT, REAL or INTEGER.
export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  email: text().notNull().unique(),
  firstname: text().notNull(),
  lastname: text().notNull(),
  dateRegistered: text().notNull(),
  lastLogin: text(),
  age: int().notNull()
});