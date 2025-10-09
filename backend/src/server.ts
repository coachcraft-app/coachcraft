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
// Server instance
export const app = fastify();

// Yoga instance
export const yoga = createYoga<{
  req: FastifyRequest;
  reply: FastifyReply;
}>({
  schema,
  // Give database and other variables to resolvers
  context: createContext,
  // enable Fastify logging
  logging: {
    debug: (...args) => {
      for (const arg of args) app.log.debug(arg);
    },
    info: (...args) => {
      for (const arg of args) app.log.info(arg);
    },
    warn: (...args) => {
      for (const arg of args) app.log.warn(arg);
    },
    error: (...args) => {
      for (const arg of args) app.log.error(arg);
    },
  },
});

// Yoga needs this to avoid errors with multipart data
app.addContentTypeParser("multipart/form-data", {}, (_req, _payload, done) =>
  done(null)
);

// add /graphql endpoint
app.route({
  url: yoga.graphqlEndpoint,
  method: ["GET", "POST", "OPTIONS"],
  handler: (req, reply) =>
    yoga.handleNodeRequestAndResponse(req, reply, {
      req,
      reply,
    }),
});
