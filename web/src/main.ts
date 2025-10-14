import alpine from "@/libs/alpine";
import oidc from "@/libs/oidc";
import urql from "@/libs/graphql/urql";
import sync from "@/libs/graphql/sync";
import loadDummyData from "@/dummyData";

import type { Alpine } from "alpinejs";

export default async (Alpine: Alpine) => {
  console.log("Prod mode", import.meta.env.PROD);

  // SPA initialisation sequence

  // init Alpine plugins, register stores, init global Alpine object
  alpine.getInstance(Alpine);

  if (import.meta.env.PROD) {
    // configure OIDC client, prompt for login / retrieve credentials
    await oidc.getInstance().initAuthFlow();

    // init GraphQL client (backend API)
    await urql.getInstance();

    // sync state lists with backend
    await sync.subscribeToStateLists();
  } else {
    // inject dummy data into state if disconnected from backend
    loadDummyData();

    console.log(
      "Development mode: Skipping Cognito and Urql initialization for testing",
    );
  }
};
