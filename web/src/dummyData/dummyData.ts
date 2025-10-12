import alpine from "../libs/alpine";
import dummyActivities from "./activities.json";
import dummyScheduling from "./scheduling.json";
import dummyTeams from "./teams.json";

import type { PagesStore } from "../typedefs/storeTypes";

export default function loadDummyData() {
  const globalAlpine = alpine.getInstance().getGlobalAlpine();

  const pagesStoreReference: PagesStore = globalAlpine.store(
    "pages",
  ) as PagesStore;

  pagesStoreReference.activities.activitiesList =
    dummyActivities.activitiesList;
  pagesStoreReference.activities.listsList = dummyActivities.listsList;
  pagesStoreReference.teams.teamsList = dummyTeams.teamsList;

  pagesStoreReference.scheduling.previousSessions =
    dummyScheduling.previousSessions;
}
