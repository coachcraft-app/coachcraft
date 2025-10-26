/**
 * Sync syncronises data between the frontend Alpine.js stores and the backend via GraphQL.
 * It exposes modular sync libs for different data types (activities, teams, etc.)
 * @module
 */

import type {
  ActivitiesList,
  Activity,
  Team,
  Session,
} from "@/typeDefs/storeTypes";

import { ActivitiesSync, ActivitiesListsSync } from "./activitiesSync";
import { TeamsSync } from "./teamsSync";
import { SessionsSync } from "./sessionsSync";

/**
 * Sync statically exposes modular sync libs (activitiesSync, teamsSync, etc.)
 *
 * - Accessing sync libs:
 *  - import Sync from "sync.ts";
 *
 *    Sync.activities.list.put(<args>);
 *    Sync.activities.activity.post(<args>);
 *    Sync.teams.delete(<args>);
 *    ..
 *    ..
 */
export class Sync {
  static activities = {
    activity: new ActivitiesSync(),
    list: new ActivitiesListsSync(),
  };
  static teams = new TeamsSync();
  static sessions = new SessionsSync();

  /**
   * Sync activitiesList, listsList, teamsList to the server
   */
  static async subscribeToStateLists(
    activitiesList: Activity[],
    activitiesListsList: ActivitiesList[],
    teamsList: Team[],
    previousSessionsList: Session[],
    upcomingSessionsList: Session[],
  ): Promise<void> {
    await Sync.activities.activity.subscribeToActivitiesList(activitiesList);
    await Sync.activities.list.subscribeToActivitiesListsList(
      activitiesListsList,
    );
    await Sync.teams.subscribeToTeamsList(teamsList);
    await Sync.sessions.subscribeToSessionsList(
      previousSessionsList,
      upcomingSessionsList,
    );
  }
}
