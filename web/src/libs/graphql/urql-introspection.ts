/**
 * Generates the GraphQL schema.json file for urql's cacheExchange
 * by introspecting the GraphQL API server.
 * @module
 */

import { getIntrospectionQuery } from "graphql";
import * as fs from "fs";
import {
  getIntrospectedSchema,
  minifyIntrospectionQuery,
} from "@urql/introspection";

fetch(import.meta.env.API_SERVER_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: getIntrospectionQuery({ descriptions: false }),
  }),
})
  .then((result) => result.json())
  .then(({ data }) => {
    const minified = minifyIntrospectionQuery(getIntrospectedSchema(data));
    fs.writeFileSync("./schema.json", JSON.stringify(minified));
  });
