import alpine from "./libs/alpine.js";
import oidc from "./libs/oidc.js";
import urql from "./libs/graphql/urql";
import sync from "./libs/graphql/sync/sync";
import loadDummyData from "./dummyData/dummyData.ts";

import type { Alpine } from "alpinejs";

export default async (Alpine: Alpine) => {
  console.log("Prod mode", import.meta.env.PROD);

  // SPA initialisation sequence

  // init Alpine plugins, stores and the global Alpine object
  alpine.getInstance(Alpine);

  if (import.meta.env.PROD) {
    // configure OIDC client, prompt user for logging in
    await oidc.getInstance().initAuthFlow();

    // GraphQL client (backend API)
    await urql.getInstance();

    // sync state lists with backend
    await sync.subscribeToStateLists();
  } else {
    loadDummyData();
    console.log(
      "Development mode: Skipping Cognito and Urql initialization for testing",
    );
  }
};
