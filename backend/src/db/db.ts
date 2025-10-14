/**
 * Drizzle database instance module
 *
 * Creates the drizzle database using schema. The path is either set
 * in .env or left in memory.
 * @module
 */

import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import logger from "../logger";
import * as dbSchema from "../db/schema";

/** SQLite db is either stored at path set in .env or in RAM */
const db_file: string = process.env["DEV_DB_URL"] || ":memory:";

if (db_file === ":memory:") {
  logger.warn(
    ".env property DEV_DB_URL not set! Using impermanent memory as database storage."
  );
}

/**
 * A Drizzle instance using betterSQLite3
 */
export const db: BetterSQLite3Database<typeof dbSchema> = drizzle(db_file, {
  schema: dbSchema,
});
