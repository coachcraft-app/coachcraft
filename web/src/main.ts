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
  console.log("Current pathname:", window.location.pathname);

  // Only redirect if we're on the root page
  if (window.location.pathname === "/") {
    console.log("Redirecting to flash page...");
    window.location.href = "/flash";
    return;
  }

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

    // init prod version of Sync
    Sync.getInstance();

    // sync state lists with backend
    await Sync.subscribeToStateLists(
      activitiesStore.activitiesList,
      activitiesStore.activitiesListsList,
      teamsStore.teamsList,
      sessionsStore.previousSessions,
      sessionsStore.upcomingSessions,
    );

    // After authentication is handled, redirect to main app
    if (window.location.pathname === "/flash") {
      window.location.href = "/";
    }
  } else {
    // inject dummy data into state if disconnected from backend
    loadDummyData();

    // init mock version of Sync
    Sync.getMockInstance();

    console.log(
      "Development mode: Skipping Cognito and Urql initialization for testing",
    );

    // In development, redirect to main app after initialization
    if (window.location.pathname === "/flash") {
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }
}

export default main;
