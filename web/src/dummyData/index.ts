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

import type { auth } from "@/stores/auth";
import type { ActivitiesView } from "@/stores/views/activities";
import type { TeamsView } from "@/stores/views/teams";
import type { SchedulingView } from "@/stores/views/scheduling";

/**
 * Loads dummy data into Alpine.js stores for development and testing purposes.
 * Used in main.ts when not in production mode.
 */
export function loadDummyData() {
  const globalAlpine = alpine.getInstance().getGlobalAlpine();

  // inject auth data
  const auth: auth = globalAlpine.store("auth") as auth;
  auth.userProfilePic = dummyAuth.profile_picture_url;
  auth.givenName = dummyAuth.given_name;
  auth.userEmail = dummyAuth.email;

  // inject activities data
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

  // inject teams data
  const teams: TeamsView = globalAlpine.store("teams") as TeamsView;
  teams.teamsList.length = 0;
  for (const team of dummyTeams.teamsList) {
    teams.teamsList.unshift(team);
  }

  // inject scheduling data
  const scheduling: SchedulingView = globalAlpine.store(
    "scheduling",
  ) as SchedulingView;
  scheduling.previousSessions.length = 0;
  for (const session of dummyScheduling.previousSessions) {
    scheduling.previousSessions.unshift(session);
  }
}
