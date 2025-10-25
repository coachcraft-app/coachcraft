/**
 * Drizzle schema to GraphQL schema
 *
 * Utilised drizzle-graphql to simplify conversion
 * @module
 */

import { buildSchema } from "drizzle-graphql";

import { database } from "../database/database";

// TODO: Customise schema to use user token in queries
/** A GraphQLSchema used to create Yoga /graphql endpoint */
export const { schema } = buildSchema(database);
