/**
 *
 */

import type { Activity, List, Team } from "./graphql-types";

import {
  subscribeToActivities,
  deleteActivity,
  postActivity,
  putActivity,
} from "./graphql-activities";

import {
  subscribeToLists,
  deleteList,
  postList,
  putList,
} from "./graphql-lists";

import {
  subscribeToTeams,
  deleteTeam,
  postTeam,
  // putTeam,
} from "./graphql-teams";

export class Sync {
  debug: boolean;
  activitiesList: Activity[];
  listsList: List[];
  teamsList: Team[];

  constructor(
    activitiesList: Activity[],
    listsList: List[],
    teamsList: Team[],
    debug: boolean = false,
  ) {
    this.activitiesList = activitiesList;
    this.listsList = listsList;
    this.teamsList = teamsList;
    this.debug = debug;

    // Subscribe to changes in activities and lists
    subscribeToActivities(this.activitiesList);
    subscribeToLists(this.listsList);
    subscribeToTeams(this.teamsList);
  }

  async sync(): Promise<void> {
    // try {
    // Activities
    // let response; // = await fetch(
    //   ((this.debug && "http://localhost:3000") || "") + "/api/activity",
    //   {
    //     method: "GET",
    //     headers: {
    //       "If-Modified-Since":
    //         this.getActivitiesModifyDateTime().toUTCString(),
    //     },
    //   },
    // );
    // if (response.ok) {
    //   const json: APIActivitiesResponse = await response.json();
    //   // clear array
    //   this.activitiesList.length = 0;
    //   for (const activity of json.activities) {
    //     this.activitiesList.push(this.convertAPIActivityToActivity(activity));
    //   }
    //   // Current is up to date
    // } else if (response.status === 304) {
    //   return;
    // } else {
    //   const json: APIActivitiesResponse = await response.json();
    //   console.error(json);
    //   return;
    // }
    // Lists
    //   response = await fetch(
    //     ((this.debug && "http://localhost:3000") || "") + "/api/list",
    //     {
    //       method: "GET",
    //       headers: {
    //         "If-Modified-Since":
    //           this.getLatestListsModifyDateTime().toUTCString(),
    //       },
    //     },
    //   );
    //   if (response.ok) {
    //     const json: APIListResponse = await response.json();
    //     // clear array
    //     this.listsList.length = 0;
    //     for (const list of json.lists) {
    //       this.listsList.push(this.convertAPIListToList(list));
    //     }
    //     // Current is up to date
    //   } else if (response.status === 304) {
    //     return;
    //   } else {
    //     const json: APIActivitiesResponse = await response.json();
    //     console.error(json);
    //     return;
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
  }

  async deleteActivity(id: string): Promise<void> {
    deleteActivity(+id);
  }

  async postActivity(activity: Activity): Promise<void> {
    postActivity(activity);
  }

  async putActivity(activity: Activity): Promise<void> {
    putActivity(activity);
  }

  async deleteList(id: string): Promise<void> {
    deleteList(id);
  }

  async postList(list: List): Promise<void> {
    postList(list);
  }

  async putList(list: List): Promise<void> {
    putList(list);
  }

  async deleteTeam(id: string): Promise<void> {
    deleteTeam(id);
  }

  async postTeam(team: Team): Promise<void> {
    postTeam(team);
  }

  // async putTeam(team: Team): Promise<void> {
  //   //putTeam(id, name);
  // }
}
