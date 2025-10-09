/**
 * Drizzle schema to GraphQL schema
 *
 * Utilised drizzle-graphql to simplify conversion
 * @module
 */

import { buildSchema } from "drizzle-graphql";

import { db } from "../db/db";

// TODO: Customise schema to use user token in queries
export const { schema } = buildSchema(db);
