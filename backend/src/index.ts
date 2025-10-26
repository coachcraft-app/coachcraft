/**
 * Entrypoint into the backend application.
 *
 * Starts a fastify server on port "PORT" from .env or 3000
 * @module
 */

import "dotenv/config";

// eslint-disable-next-line unicorn/prefer-node-protocol -- runtime entrypoint
import path from "path";

/**
 * Entrypoint into the backend server
 */
export async function main() {
  const PORT =
    (process.env["PORT"] && Number.parseInt(process.env["PORT"])) || 3000;

  // Reset the SQLite database by switching to a fresh file path on each run
  const databasePath = process.env["DEV_DB_URL"];
  if (databasePath) {
    const absolute = path.isAbsolute(databasePath)
      ? databasePath
      : path.resolve(process.cwd(), databasePath);
    const directory = path.dirname(absolute);

    // Use a new and uniquely named DB file per run
    const newDBFile = path.join(directory, `${Date.now()}.db`);
    process.env["DEV_DB_URL"] = newDBFile;
  }

  // Generate and apply SQL migrations at startup (works with gitignored migrations dir)
  try {
    const { applyMigrationsUsingDrizzleKit } = await import(
      "./utils/apply-migrations"
    );
    applyMigrationsUsingDrizzleKit();
  } catch (error) {
    console.error("Failed to apply migrations:", error);
  }

  // Import server AFTER db reset/migrations so connections open on a fresh DB
  const { app } = await import("./server");

  app.listen({ port: PORT }, () => {
    console.log(`running server on ${PORT}.`);
  });
}

await main();
