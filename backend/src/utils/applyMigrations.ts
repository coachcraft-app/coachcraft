/**
 * Utility to apply SQL migrations from a directory to the database.
 * Useful for setting up test databases.
 * Makes sure to import AFTER setting TEST/DEV_DB_URL if using jest.setup.ts
 * @module
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { db } from "../db/db";

/**
 * Apply drizzle-kit migrations in a directory to a Drizzle instance
 * @param migrationsDir The directory that stores drizzle-kit migrations
 */
export function applyMigrationsFromDir(
  // Default to "drizzle/migrations" directory in project root
  migrationsDir = path.resolve(process.cwd(), "drizzle", "migrations"),
): void {
  // Check if directory exists
  if (!fs.existsSync(migrationsDir)) return;

  // Get all sql files, sort them, and apply in order
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    // Run each statement separately to handle multiple statements in one file
    sql.split("--> statement-breakpoint").forEach((sql) => {
      db.run(sql);
    });
    console.log(`applied migration ${file}`);
  }
}

/**
 * Apply drizzle-kit migrations to a drizzle instance by first generating them
 * @param config { drizzle.config.ts path, drizzle/migrations path }
 */
export function applyMigrationsUsingDrizzleKit({
  // Allow overriding config path and output dir
  config = path.resolve(process.cwd(), "drizzle.config.ts"),
  outDir = path.resolve(process.cwd(), "drizzle", "migrations"),
} = {}): void {
  // Use the drizzle-kit CLI to generate migration SQL then apply it.
  try {
    // Ensure output directory exists
    fs.mkdirSync(outDir, { recursive: true });

    // Run drizzle-kit generate to produce SQL migrations into outDir
    // We use execSync so this is synchronous in setup scripts; escape paths for PowerShell
    const cmd = `npx --yes drizzle-kit generate --config "${config}"`;
    console.log("running:", cmd);
    execSync(cmd, { stdio: "inherit" });
    console.log("drizzle-kit generate completed");

    // Apply SQL files from outDir
    applyMigrationsFromDir(outDir);
  } catch (err) {
    console.error("applyMigrationsUsingDrizzleKit error:", err);
    throw err;
  }
}
