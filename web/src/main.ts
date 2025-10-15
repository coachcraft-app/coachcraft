import alpine from "@/libs/alpine";
import oidc from "@/libs/oidc";
import urql from "@/libs/graphql/urql";
import sync from "@/libs/graphql/sync";
import loadDummyData from "@/dummyData";

import type { Alpine } from "alpinejs";
import type activities from "./stores/views/activities";
import type teams from "./stores/views/teams";

export default async (alpineObj: Alpine) => {
  console.log("Mode:", import.meta.env.MODE);

  // SPA initialisation sequence

  // init Alpine plugins, register stores, init global Alpine object
  alpine.getInstance(alpineObj);

  const globalAlpine = alpine.getInstance().getGlobalAlpine();
  const activitiesStore: activities = globalAlpine.store(
    "activities",
  ) as activities;
  const teamsStore: teams = globalAlpine.store("teams") as teams;

  if (import.meta.env.MODE === "production") {
    // configure OIDC client, prompt for login / retrieve credentials
    await oidc.getInstance().initOidcFlow();

    // init GraphQL client (backend API)
    await urql.getInstance();

    // sync state lists with backend
    await sync.subscribeToStateLists(
      activitiesStore.activitiesList,
      activitiesStore.activitiesListsList,
      teamsStore.teamsList,
    );
  } else {
    // inject dummy data into state if disconnected from backend
    loadDummyData();

    console.log(
      "Development mode: Skipping Cognito and Urql initialization for testing",
    );
  }
};
