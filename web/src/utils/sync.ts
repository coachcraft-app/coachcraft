/**
 *
 */

import type {
  Activity,
  List,
  GraphQLActivity,
  GraphQLList,
  APIActivitiesResponse,
  APIListResponse,
} from "./graphql-types";

import {
  subscribeToActivities,
  deleteActivity,
  postActivity,
  putActivity,
} from "./graphql-activities";
import { subscribeToLists } from "./grapql-lists";

export class Sync {
  debug: boolean;
  activitiesList: Activity[];
  listsList: List[];

  constructor(
    activitiesList: Activity[],
    listsList: List[],
    debug: boolean = false,
  ) {
    this.activitiesList = activitiesList;
    this.listsList = listsList;
    this.debug = debug;

    // Subscribe to changes in activities and lists
    subscribeToActivities(this.activitiesList);
    subscribeToLists(this.listsList);
  }

  convertActivityToAPIActivity(activity: Activity): GraphQLActivity {
    return {
      id: +activity.id,
      name: activity.name,
      duration: activity.duration,
      description: activity.description,
      imgUrl: activity.img_url,
      lastModified:
        (activity.lastModified && activity.lastModified.toString()) ||
        new Date(0).toUTCString(),
    };
  }

  convertAPIActivityToActivity(activity: GraphQLActivity): Activity {
    return {
      id: activity.id.toString(),
      name: activity.name,
      duration: activity.duration,
      description: activity.description,
      img_url: activity.imgUrl,
      lastModified: new Date(activity.lastModified || 1),
    };
  }

  convertListToAPIList(list: List): GraphQLList {
    const activities: number[] = [];

    for (const activity of list.activities) {
      activities.push(+activity);
    }

    return {
      id: +list.id,
      name: list.name,
      accentColor: list.accent_color,
      activities: activities,
      lastModified: list.lastModified || new Date(0).toUTCString(),
    };
  }

  convertAPIListToList(list: GraphQLList): List {
    const activities: string[] = [];

    for (const activity of list.activities) {
      activities.push(activity.toString());
    }

    return {
      id: list.id.toString(),
      name: list.name,
      accent_color: list.accentColor,
      activities: activities,
      lastModified: list.lastModified || new Date(0).toUTCString(),
    };
  }

  getActivitiesModifyDateTime(): Date {
    let newestDate: Date = new Date(0);
    for (const activity of this.activitiesList) {
      if (activity.lastModified) {
        newestDate =
          activity.lastModified > newestDate
            ? activity.lastModified
            : newestDate;
      }
    }
    return newestDate;
  }

  getLatestListsModifyDateTime(): Date {
    let newestDate: Date = new Date(0);
    for (const list of this.listsList) {
      if (list.lastModified) {
        newestDate =
          new Date(list.lastModified) > newestDate
            ? new Date(list.lastModified)
            : newestDate;
      }
    }
    return newestDate;
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
    try {
      const response = await fetch(
        ((this.debug && "http://localhost:3000") || "") + "/api/list/" + id,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        await this.sync();
      } else {
        const json: APIActivitiesResponse = await response.json();
        console.error(json);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async postList(list: List): Promise<void> {
    try {
      // Strip out ids, post assigns ids automatically
      const convertList = this.convertListToAPIList(list);

      //@ts-expect-error id could be undefined
      convertList.id = undefined;

      const response = await fetch(
        ((this.debug && "http://localhost:3000") || "") + "/api/list",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(convertList),
        },
      );

      if (response.ok) {
        await this.sync();
      } else {
        const json: APIActivitiesResponse = await response.json();
        console.error(json);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async putList(list: List): Promise<void> {
    try {
      const response = await fetch(
        ((this.debug && "http://localhost:3000") || "") +
          "/api/list/" +
          list.id,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.convertListToAPIList(list)),
        },
      );

      if (response.ok) {
        await this.sync();
      } else {
        const json: APIActivitiesResponse = await response.json();
        console.error(json);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
