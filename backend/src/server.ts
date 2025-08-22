import fastify from "fastify";
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createYoga, useExecutionCancellation } from "graphql-yoga";
import { ruruHTML } from "ruru/server";

import { schema } from './graphql/schema.js'
import { createContext } from "./graphql/context.js";

import logger from './logger.js';


export const app = fastify();

export const yoga = createYoga<{
    req: FastifyRequest,
    reply: FastifyReply
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
app.addContentTypeParser('multipart/form-data', {}, (_req, _payload, done) => done(null));

// add /graphql endpoint
app.route({
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: (req, reply) =>
    yoga.handleNodeRequestAndResponse(req, reply, {
        req,
        reply,
    }),
});