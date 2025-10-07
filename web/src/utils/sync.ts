import { ActivitiesSync, ActivitiesListsSync } from "./activitiesSync";
import TeamsSync from "./teamsSync";

import alpineInstance from "./alpineInstance";
import type { PagesStore } from "../typeDefs/storeTypes";

class Sync {
  bypassSync: boolean;
  activities: {
    activity: ActivitiesSync;
    list: ActivitiesListsSync;
  };
  teams: TeamsSync;

  constructor(bypassSync: boolean = false) {
    this.bypassSync = bypassSync;
    const activity = new ActivitiesSync();
    const list = new ActivitiesListsSync();
    this.activities = {
      activity,
      list,
    };
    this.teams = new TeamsSync();

    const pagesStore: PagesStore = alpineInstance.instance.store(
      "pages",
    ) as PagesStore;

    // Subscribe to updates to activitiesList, listsLists, teamsList
    if (!this.bypassSync) {
      const activitiesList = pagesStore.activities?.activitiesList;
      const listsList = pagesStore.activities?.listsList;
      const teamsList = pagesStore.teams?.teamsList;

      this.activities.activity.subscribeToActivitiesList(activitiesList);
      this.activities.list.subscribeToListsList(listsList);
      this.teams.subscribeToTeamsList(teamsList);
    }
  }
}

export default Sync;
