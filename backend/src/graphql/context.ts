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

/** The state given to graphql resolvers */
export type GraphQLContext = {
  req: FastifyRequest;
  reply: FastifyReply;
  db: BetterSQLite3Database<typeof schema>;
};

/** Function passed to Yoga that gives database access to resolvers */
export async function createContext(): Promise<Partial<GraphQLContext>> {
  return { db };
}
