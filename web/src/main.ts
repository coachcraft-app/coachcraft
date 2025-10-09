import alpine from "./utils/alpine.js";
import oidc from "./utils/oidc.ts";
import urql from "./utils/urql.ts";
import sync from "./utils/sync.js";

import type { Alpine } from "alpinejs";

export default async (Alpine: Alpine) => {
  console.log("Prod mode", import.meta.env.PROD);

  // SPA initialisation sequence

  // init Alpine plugins, stores and the global Alpine object
  alpine.getInstance(Alpine);

  // configure OIDC client, prompt user for logging in
  await oidc.getInstance().initAuthFlow();

  // GraphQL client (backend API)
  await urql.getInstance();

  // sync state lists with backend, if in prod mode
  if (import.meta.env.PROD) await sync.subscribeToStateLists();
};
