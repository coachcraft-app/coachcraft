/**
 * Entrypoint into the backend application.
 *
 * Starts a fastify server on port "PORT" from .env or 3000
 * @module
 */

import "dotenv/config";
import { app } from "./server";

/**
 * Entrypoint into the backend server
 */
export async function main() {
  const PORT = (process.env["PORT"] && parseInt(process.env["PORT"])) || 3000;

  app.listen({ port: PORT }, () => {
    console.log(`running server on ${PORT}.`);
  });
}

main();
