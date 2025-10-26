/**
 * Fastify server instance module
 *
 * This module creates a fastify server called "app" which exposes a
 * Yoga based /graphql endpoint
 * @module
 */

import fastify from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { createYoga } from "graphql-yoga";

import { schema } from "./graphql/schema";
import { createContext } from "./graphql/context";
import { verifyJwtOnRequest } from "./utils/jwt-verify";

/** Server instance */
export const app = fastify();

/** Yoga instance */
export const yoga = createYoga<{
  req: FastifyRequest;
  reply: FastifyReply;
}>({
  schema,
  // Give database and other variables to resolvers
  context: createContext,
  // enable Fastify logging
  logging: {
    debug: (...arguments_) => {
      for (const argument of arguments_) app.log.debug(argument);
    },
    info: (...arguments_) => {
      for (const argument of arguments_) app.log.info(argument);
    },
    warn: (...arguments_) => {
      for (const argument of arguments_) app.log.warn(argument);
    },
    error: (...arguments_) => {
      for (const argument of arguments_) app.log.error(argument);
    },
  },
});

// Yoga needs this to avoid errors with multipart data
app.addContentTypeParser(
  "multipart/form-data",
  {},
  (_request, _payload, done) =>
    // eslint-disable-next-line unicorn/no-null -- `done` expects `null` or `Error` as first arg
    done(null),
);

// add /graphql endpoint
app.route({
  url: yoga.graphqlEndpoint,
  method: ["GET", "POST", "OPTIONS"],
  // Verify JWT for GraphQL requests
  preHandler: verifyJwtOnRequest,
  handler: (request, reply) =>
    yoga.handleNodeRequestAndResponse(request, reply, {
      req: request,
      reply,
    }),
});
