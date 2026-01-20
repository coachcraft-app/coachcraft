/**
 * Main entry point for SPA (app page)
 * Initializes Alpine.js, user authentication state, and GraphQL client
 * Also handles loading dummy data in development mode
 * Note: OIDC authentication is handled by the flash screen before this
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
import type { auth } from "./stores/auth";

/**
 * This is the entry point for the app page (after authentication).
 * It sets up Alpine.js and the GraphQL client (urql).
 * In development mode, it loads dummy data instead.
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
    // Load user info from OIDC (authentication already handled by flash screen)
    const authStore: auth = globalAlpine.store("auth") as auth;

    try {
      const user = await oidc.getInstance().getUserManager().getUser();

      if (user && !user.expired) {
        authStore.userProfilePic = user.profile.profile;
        authStore.givenName = user.profile.given_name;
        authStore.userEmail = user.profile.email;
      } else {
        // No valid user - log warning but don't redirect to avoid loops
        console.warn(
          "No valid user session found. App may not function correctly.",
        );
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    }

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
  } else {
    // inject dummy data into state if disconnected from backend
    loadDummyData();

    // init mock version of Sync
    Sync.getMockInstance();

    console.log(
      "Development mode: Skipping Cognito and Urql initialization for testing",
    );
  }
}

export default main;
