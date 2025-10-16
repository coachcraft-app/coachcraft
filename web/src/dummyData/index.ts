/**
 * Loads dummy data into Alpine.js stores for development and testing purposes.
 * Used in main.ts when not in production mode.
 * @module
 */

import { alpine } from "@/libs/alpine";
import dummyAuth from "./auth.json";
import dummyActivities from "./activities.json";
import dummyScheduling from "./scheduling.json";
import dummyTeams from "./teams.json";

import type { Auth } from "@/typeDefs/storeTypes";
import type { ActivitiesView } from "@/stores/views/activities";
import type { TeamsView } from "@/stores/views/teams";
import type { SchedulingView } from "@/stores/views/scheduling";

/**
 * Loads dummy data into Alpine.js stores for development and testing purposes.
 * Used in main.ts when not in production mode.
 */
export function loadDummyData() {
  const globalAlpine = alpine.getInstance().getGlobalAlpine();

  const auth: Auth = globalAlpine.store("auth") as Auth;
  auth.user = {
    profile: {
      profile: dummyAuth.profile_picture_url,
      given_name: dummyAuth.given_name,
      email: dummyAuth.email,
      // Add dummy values for the missing properties
      sub: "dummy-sub",
      iss: "dummy-iss",
      aud: "dummy-aud",
      exp: 0,
      iat: 0,
    },
    session_state: "dummy-session-state",
    access_token: "dummy-access-token",
    token_type: "Bearer",
    scope: "openid profile email",
    scopes: ["openid", "profile", "email"],
    expires_at: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    expires_in: 3600,
    expired: false,
    id_token: "dummy-id-token",
    state: "dummy-state",
    toStorageString: () => "", // Mock function
  };

  console.log("auth store", globalAlpine.store("auth"));

  // auth.user.profile.profile = dummyAuth.profile_picture_url;
  // auth.user.profile.given_name = dummyAuth.given_name;
  // auth.user.profile.email = dummyAuth.email;

  const activities: ActivitiesView = globalAlpine.store(
    "activities",
  ) as ActivitiesView;

  activities.activitiesList.length = 0;
  for (const activity of dummyActivities.activitiesList) {
    activities.activitiesList.unshift(activity);
  }

  activities.activitiesListsList.length = 0;
  for (const list of dummyActivities.activitiesListsList) {
    activities.activitiesListsList.unshift(list);
  }

  const teams: TeamsView = globalAlpine.store("teams") as TeamsView;
  teams.teamsList.length = 0;
  for (const team of dummyTeams.teamsList) {
    teams.teamsList.unshift(team);
  }

  const scheduling: SchedulingView = globalAlpine.store(
    "scheduling",
  ) as SchedulingView;
  scheduling.previousSessions.length = 0;
  for (const session of dummyScheduling.previousSessions) {
    scheduling.previousSessions.unshift(session);
  }
}
