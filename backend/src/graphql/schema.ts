/**
 * Drizzle schema to GraphQL schema
 *
 * Utilised drizzle-graphql to simplify conversion
 * @module
 */

import { buildSchema } from "drizzle-graphql";

import { db } from "../db/db";

// TODO: Customise schema to use user token in queries
/** A GraphQLSchema used to create Yoga /graphql endpoint */
export const { schema } = buildSchema(db);
