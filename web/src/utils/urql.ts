import { fetchExchange, Client } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import schema from "./schema.json";

// TODO: implement real token storage
function getToken() {
  return "";
}

export const urqlClient = new Client({
  url: "http://localhost:4500/graphql",
  exchanges: [cacheExchange({ schema }), fetchExchange],
  fetchOptions: () => {
    const token = getToken();
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    };
  },
});

export default urqlClient;
