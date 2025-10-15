import type {
  ActivitiesList,
  Activity,
  PagesStore,
  Team,
} from "@/typedefs/storeTypes";
import { ActivitiesSync, ActivitiesListsSync } from "./activitiesSync";
import TeamsSync from "./teamsSync";

import alpine from "@/libs/alpine";

/**
 * Sync statically exposes modular sync libs (activitiesSync, teamsSync, etc.)
 *
 * - No instantiation is necessary, Sync is stateless
 * - The global urql instance is imported by all the modular sync libs
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
  static async subscribeToStateLists(): Promise<void> {
    const globalAlpine = alpine.getInstance().getGlobalAlpine();

    const pagesStore: PagesStore = globalAlpine.store("pages") as PagesStore;

    // Subscribe to updates to activitiesList, activitiesListsList, teamsList
    const activitiesList: Activity[] = pagesStore.activities.activitiesList;
    const activitiesListsList: ActivitiesList[] =
      pagesStore.activities.activitiesListsList;
    const teamsList: Team[] = pagesStore.teams.teamsList;

    await Sync.activities.activity.subscribeToActivitiesList(activitiesList);
    await Sync.activities.list.subscribeToActivitiesListsList(
      activitiesListsList,
    );
    await Sync.teams.subscribeToTeamsList(teamsList);
  }
}

export default Sync;
