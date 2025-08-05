import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../db/db.js';
import * as schema from '../db/schema.js'

export type GraphQLContext = {
    req: FastifyRequest
    reply: FastifyReply
    db: BetterSQLite3Database<typeof schema>
};

export async function createContext(): Promise<Partial<GraphQLContext>> {
    return {db}
}