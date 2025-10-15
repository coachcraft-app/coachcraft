import type { ActivitiesList, Activity, Team } from "@/typedefs/storeTypes";

import { ActivitiesSync, ActivitiesListsSync } from "./activitiesSync";
import TeamsSync from "./teamsSync";

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
class Sync {
  static activities = {
    activity: new ActivitiesSync(),
    list: new ActivitiesListsSync(),
  };
  static teams = new TeamsSync();

  /**
   * Sync activitiesList, listsList, teamsList to the server
   */
  static async subscribeToStateLists(
    activitiesList: Activity[],
    activitiesListsList: ActivitiesList[],
    teamsList: Team[],
  ): Promise<void> {
    await Sync.activities.activity.subscribeToActivitiesList(activitiesList);
    await Sync.activities.list.subscribeToActivitiesListsList(
      activitiesListsList,
    );
    await Sync.teams.subscribeToTeamsList(teamsList);
  }
}

export default Sync;
