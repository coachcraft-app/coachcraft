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

import {
  MockActivitiesSync,
  MockActivitiesListsSync,
  MockTeamsSync,
  MockSessionsSync,
} from "./mockSync";

/**
 * `Sync` is a singleton that statically exposes modular sync libs (activitiesSync, teamsSync, etc.)
 *
 * use `getInstance()` to init prod version of Sync
 * use `getMockInstance()` to init mock version of Sync
 *
 * - Accessing sync libs:
 *  - import Sync from "sync.ts";
 *
 *    Sync.getInstance();
 *    Sync.activities.list.put(<args>);
 *    Sync.activities.activity.post(<args>);
 *    Sync.teams.delete(<args>);
 *    ..
 *    ..
 */
export class Sync {
  private static instance: Sync;
  public static activities = {
    activity: new ActivitiesSync(),
    list: new ActivitiesListsSync(),
  };
  public static teams: TeamsSync = new TeamsSync();
  static sessions = new SessionsSync();

  private constructor() {}

  public static getInstance(): Sync {
    if (!Sync.instance) {
      Sync.instance = new Sync();
    }

    return Sync.instance;
  }

  public static getMockInstance(): Sync {
    if (!Sync.instance) {
      Sync.instance = new Sync();

      Sync.activities = {
        activity: new MockActivitiesSync(),
        list: new MockActivitiesListsSync(),
      };
      Sync.teams = new MockTeamsSync();
      Sync.sessions = new MockSessionsSync();

      console.log("Using mock sync layer");
    }

    return Sync.instance;
  }

  /**
   * Sync activitiesList, listsList, teamsList to the server
   */
  public static async subscribeToStateLists(
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
