import { fetchExchange, Client } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import schema from "./schema.json";
import Alpine from "alpinejs";

import type { AuthStore } from "../typeDefs/storeTypes";
import type { User } from "oidc-client-ts";

/**
 * `urql` is a singleton class
 * for accessing/initialising, use `getInstance(): Promise<urql>`
 */
class urql {
  private static instance: urql;
  private urqlClient: Client | undefined;

  private constructor(accessToken: string) {
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

  public static async getInstance(): Promise<urql> {
    // if this is the first call to getInstance()
    if (!urql.instance) {
      const authStore: AuthStore = Alpine.store("auth") as AuthStore;
      const userManager = authStore.userManager;
      const User: User | null = await userManager.getUser();
      const accessToken: string | undefined = User?.access_token;

      // app fails to load without accessToken
      if (accessToken) urql.instance = new urql(accessToken);
      else throw new Error("Cannot retrieve OIDC access token.");
    }

    // return the single global instance
    return urql.instance;
  }

  public getUrqlClient(): Client {
    if (!this.urqlClient)
      throw new Error(
        "The urql singleton class has not been initialised yet. Use urql.getInstance() first.",
      );

    return this.urqlClient;
  }
}

export default urql;
