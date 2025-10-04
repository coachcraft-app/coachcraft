import { fetchExchange, Client } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import schema from "./schema.json";
import Alpine from "alpinejs";

import type { AuthStore } from "../typeDefs/storeTypes";
import type { User } from "oidc-client-ts";

class urql {
  // private access_token: string;
  public urqlClient: Client | undefined;

  private async getToken(): Promise<string | undefined> {
    const authStore: AuthStore = Alpine.store("auth") as AuthStore;
    const userManager = authStore.userManager;
    const User: User | null = await userManager.getUser();
    const access_token: string | undefined = User?.access_token;

    return access_token;
  }

  constructor() {
    this.getToken().then((access_token: string | undefined) => {
      this.urqlClient = new Client({
        url: "http://localhost:4500/graphql",
        exchanges: [cacheExchange({ schema }), fetchExchange],
        fetchOptions: () => {
          const token = access_token;
          return {
            headers: { authorization: token ? `Bearer ${token}` : "" },
          };
        },
      });
    });
  }
}

export default new urql();
