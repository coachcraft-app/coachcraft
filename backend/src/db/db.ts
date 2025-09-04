import "dotenv/config";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import logger from "../logger.js";
import * as dbSchema from "../db/schema.js";

const db_file: string = process.env.DEV_DB_URL || ":memory:";

if (db_file === ":memory:") {
  logger.warn(
    ".env property DEV_DB_URL not set! Using impermanent memory as database storage.",
  );
}

export const db: BetterSQLite3Database<typeof dbSchema> = drizzle(db_file, {
  schema: dbSchema,
});
