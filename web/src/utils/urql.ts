import { fetchExchange, Client } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import schema from "./schema.json";
import Alpine from "alpinejs";

import type { AuthStore } from "../typeDefs/storeTypes";
import type { User } from "oidc-client-ts";

class urql {
  public urqlClient: Client | undefined;

  private async getToken(): Promise<string | undefined> {
    const authStore: AuthStore = Alpine.store("auth") as AuthStore;
    const userManager = authStore.userManager;
    const User: User | null = await userManager.getUser();

    return User?.access_token;
  }

  public async init(): Promise<void> {
    const accessToken: string | undefined = await this.getToken();

    this.urqlClient = new Client({
      url: "http://localhost:4500/graphql",
      exchanges: [cacheExchange({ schema }), fetchExchange],
      fetchOptions: () => {
        const token = accessToken;
        return {
          headers: { authorization: token ? `Bearer ${token}` : "" },
        };
      },
    });
  }
}

export default new urql();
