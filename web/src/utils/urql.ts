import { cacheExchange, fetchExchange, Client } from "@urql/core";

// TODO: implement real token storage
function getToken() {
  return "";
}

export const urqlClient = new Client({
  url: "http://localhost:4500/graphql",
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = getToken();
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    };
  },
});

export default urqlClient;
