import type { FastifyReply, FastifyRequest } from "fastify";
import { buildSchema } from "drizzle-graphql";

import { db } from "../db/db.js";

export const { schema } = buildSchema(db);