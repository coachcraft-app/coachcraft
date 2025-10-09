/**
 * Pass state to graphql resolvers
 *
 * This module passes drizzle to the graphql resolvers. This can
 * be used in schemas to access the database.
 * @module
 */

import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db/db";
import * as schema from "../db/schema";

export type GraphQLContext = {
  req: FastifyRequest;
  reply: FastifyReply;
  db: BetterSQLite3Database<typeof schema>;
};

export async function createContext(): Promise<Partial<GraphQLContext>> {
  return { db };
}
