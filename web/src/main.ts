import alpine from "./utils/alpine.js";
import auth from "./utils/auth.ts";
import urql from "./utils/urql.ts";
import sync from "./utils/sync.js";

import type { Alpine } from "alpinejs";

export default async (Alpine: Alpine) => {
  console.log("Prod mode", import.meta.env.PROD);

  // SPA initialisation sequence

  // init Alpine plugins, stores and the global Alpine object
  alpine.getInstance(Alpine);

  // Only configure Cognito OIDC and backend connections in production mode
  if (import.meta.env.PROD) {
    // configure Cognito OIDC, prompt user for logging in
    await auth.getInstance().initAuthFlow();

    // GraphQL client (backend API)
    await urql.getInstance();

    // sync state lists with backend
    await sync.subscribeToStateLists();
  } else {
    console.log(
      "Development mode: Skipping Cognito and Urql initialization for testing",
    );
  }
};
