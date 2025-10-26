/**
 * Main entry point for SPA
 * Initializes Alpine.js, OIDC authentication, and GraphQL client
 * in that order
 * Also handles loading dummy data in development mode
 * @module
 */

import { alpine } from "@/libs/alpine";
import { oidc } from "@/libs/oidc";
import { urql } from "@/libs/graphql/urql";
import { Sync } from "@/libs/graphql/sync";
import { loadDummyData } from "@/dummyData";

import type { Alpine } from "alpinejs";
import type { ActivitiesView } from "./stores/views/activities";
import type { TeamsView } from "./stores/views/teams";
import type { SessionsView } from "./stores/views/sessions";

/**
 * This is the entry point for the SPA.
 * It sets up Alpine.js, OIDC authentication, and the GraphQL client (urql).
 * In development mode, it skips OIDC and urql initialization and loads dummy data instead.
 * @param alpineObj The Alpine instance created automatically by astro
 */
export async function main(alpineObj: Alpine) {
  console.log("Mode:", import.meta.env.MODE);

  // SPA initialisation sequence

  // init Alpine plugins, register stores, init global Alpine object
  alpine.getInstance(alpineObj);

  const globalAlpine = alpine.getInstance().getGlobalAlpine();
  const activitiesStore: ActivitiesView = globalAlpine.store(
    "activities",
  ) as ActivitiesView;
  const teamsStore: TeamsView = globalAlpine.store("teams") as TeamsView;
  const sessionsStore: SessionsView = globalAlpine.store(
    "sessions",
  ) as SessionsView;

  if (import.meta.env.MODE === "production") {
    // configure OIDC client, prompt for login / retrieve credentials
    await oidc.getInstance().initOidcFlow();

    // init GraphQL client (backend API)
    await urql.getInstance();

    // sync state lists with backend
    await Sync.subscribeToStateLists(
      activitiesStore.activitiesList,
      activitiesStore.activitiesListsList,
      teamsStore.teamsList,
      sessionsStore.previousSessions,
      sessionsStore.upcomingSessions,
    );
  } else {
    // inject dummy data into state if disconnected from backend
    loadDummyData();

    console.log(
      "Development mode: Skipping Cognito and Urql initialization for testing",
    );
  }
}

export default main;
