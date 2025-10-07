import { ActivitiesSync, ActivitiesListsSync } from "./activitiesSync";
import TeamsSync from "./teamsSync";

import alpineInstance from "./alpineInstance";
import type { PagesStore } from "../typeDefs/storeTypes";

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
  static subscribeToStateLists(): void {
    const pagesStore: PagesStore = alpineInstance.instance.store(
      "pages",
    ) as PagesStore;

    // Subscribe to updates to activitiesList, listsLists, teamsList
    const activitiesList = pagesStore.activities?.activitiesList;
    const listsList = pagesStore.activities?.listsList;
    const teamsList = pagesStore.teams?.teamsList;

    Sync.activities.activity.subscribeToActivitiesList(activitiesList);
    Sync.activities.list.subscribeToListsList(listsList);
    Sync.teams.subscribeToTeamsList(teamsList);
  }
}

export default Sync;
