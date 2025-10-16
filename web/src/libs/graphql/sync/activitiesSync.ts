/**
 * ActivitiesSync and ActivitiesListsSync handle the synchronization of activities and activity lists
 * between the frontend Alpine.js stores and the backend via GraphQL.
 * They provide methods to subscribe to data changes, and to perform CRUD operations.
 * @module
 */

import type {
  GraphQLActivity,
  GraphQLListQuery as GraphQLListQPost,
  GraphQLListPost,
} from "@/typeDefs/graphqlTypes";
import type { ActivitiesList, Activity } from "@/typeDefs/storeTypes";
import { urql } from "@/libs/graphql/urql"; // importing a pre-initialised instance of urql

/**
 * ActivitiesSync handles synchronization of individual activities.
 * It provides methods to subscribe to the activities list, and to perform CRUD operations.
 */
export class ActivitiesSync {
  // GraphQL Queries and Mutations
  private static readonly ACTIVITIES_LIST_QUERY = /* GraphQL */ `
    query getActivities {
      activityTemplates {
        id
        name
        duration
        description
        imgUrl
        lastModified
      }
    }
  `;
  private static readonly DELETE_MUTATION = /* GraphQL */ `
    mutation deleteActivities($id: Int!) {
      deleteFromActivityTemplates(where: { id: { eq: $id } }) {
        id
      }
    }
  `;
  private static readonly POST_MUTATION = /* GraphQL */ `
    mutation insertActivities($activity: ActivityTemplatesInsertInput!) {
      insertIntoActivityTemplatesSingle(values: $activity) {
        id
        name
        duration
        description
        imgUrl
        lastModified
      }
    }
  `;
  private static readonly PUT_MUTATION = /* GraphQL */ `
    mutation updateActivities(
      $id: Int!
      $activity: ActivityTemplatesUpdateInput!
    ) {
      updateActivityTemplates(where: { id: { eq: $id } }, set: $activity) {
        id
        name
        duration
        description
        imgUrl
        lastModified
      }
    }
  `;

  // Utilities
  private static hhmmToMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }
  private static minutesToHHMM(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }
  private static convertGraphQLActivityToActivity(
    activities: GraphQLActivity[],
  ): Activity[] {
    return activities.map(
      ({ id, name, duration, description, imgUrl, lastModified }) => ({
        id: id.toString(),
        name,
        duration: ActivitiesSync.minutesToHHMM(Number(duration)),
        description,
        img_url: imgUrl,
        lastModified: new Date(lastModified || 1),
      }),
    );
  }
  private static convertActivityToGraphQLActivity(
    activity: Activity,
  ): GraphQLActivity {
    return {
      id: +activity.id,
      name: activity.name,
      duration: ActivitiesSync.hhmmToMinutes(activity.duration),
      description: activity.description,
      imgUrl: activity.img_url,
      lastModified:
        (activity.lastModified && activity.lastModified.toString()) ||
        new Date(0).toUTCString(),
    };
  }

  /**
   * Subscribe activities store to mutations in frontend
   * @param activitiesList Array of activities from activityStore in Alpine.js
   */
  async subscribeToActivitiesList(activitiesList: Activity[]): Promise<void> {
    (await urql.getInstance())
      .getUrqlClient()
      .query(ActivitiesSync.ACTIVITIES_LIST_QUERY, {})
      .subscribe((result) => {
        // empty the array and repopulate
        activitiesList.length = 0;
        for (const activity of ActivitiesSync.convertGraphQLActivityToActivity(
          result.data?.activityTemplates || [],
        )) {
          activitiesList.push(activity);
        }
      });
  }

  /**
   * Deletes an activity by ID from the backend
   * @param id ID of activity to delete
   */
  async delete(id: number): Promise<void> {
    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(ActivitiesSync.DELETE_MUTATION, { id: id });
    console.log("delete activity", result);
  }

  /**
   * Creates a new activity on the backend
   * @param activity Activity object with new data
   */
  async post(activity: Activity): Promise<void> {
    // Convert to a postable activity
    const graphqlActivity =
      ActivitiesSync.convertActivityToGraphQLActivity(activity);
    const post = {
      name: graphqlActivity.name,
      duration: graphqlActivity.duration,
      description: graphqlActivity.description,
      imgUrl: graphqlActivity.imgUrl,
    };

    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(ActivitiesSync.POST_MUTATION, {
        activity: post,
      });
    console.log("post activity", result);
  }

  /**
   * Updates an existing activity on the backend
   * @param activity Activity object with updated data
   */
  async put(activity: Activity): Promise<void> {
    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(ActivitiesSync.PUT_MUTATION, {
        id: +activity.id,
        activity: ActivitiesSync.convertActivityToGraphQLActivity(activity),
      });
    console.log("put activity", result);
  }
}

/**
 * ActivitiesListsSync handles synchronization of activity lists.
 * It provides methods to subscribe to the activity lists, and to perform CRUD operations.
 */
export class ActivitiesListsSync {
  // GraphQL Queries and Mutations
  private static readonly LISTS_LIST_QUERY = /* GraphQL */ `
    query getLists {
      lists {
        id
        name
        listToActivityTemplate {
          id
          activityTemplate {
            id
          }
        }
        accentColor
        lastModified
      }
    }
  `;
  private static readonly DELETE_MUTATION = /* GraphQL */ `
    mutation deleteLists($id: Int!) {
      deleteFromLists(where: { id: { eq: $id } }) {
        id
      }

      deleteFromActivityTemplateList(where: { list: { eq: $id } }) {
        id
      }
    }
  `;
  private static readonly POST_MUTATION = /* GraphQL */ `
    mutation insertLists($list: ListsInsertInput!) {
      insertIntoListsSingle(values: $list) {
        id
        name
        accentColor
        lastModified
      }
    }
  `;
  private static readonly PUT_MUTATION = /* GraphQL */ `
    mutation updateLists(
      $id: Int!
      $list: ListsUpdateInput!
      $activities: [ActivityTemplateListInsertInput!]!
    ) {
      updateLists(where: { id: { eq: $id } }, set: $list) {
        id
        name
        accentColor
        lastModified
      }
      deleteFromActivityTemplateList(where: { list: { eq: $id } }) {
        id
      }
      insertIntoActivityTemplateList(values: $activities) {
        id
      }
    }
  `;
  private static readonly PUT_NO_ACTIVITIES_MUTATION = /* GraphQL */ `
    mutation updateLists($id: Int!, $list: ListsUpdateInput!) {
      updateLists(where: { id: { eq: $id } }, set: $list) {
        id
        name
        accentColor
        lastModified
      }
    }
  `;

  // Utilities
  private static convertGraphQLListToList(
    lists: GraphQLListQPost[],
  ): ActivitiesList[] {
    return lists.map(
      ({ id, name, listToActivityTemplate, accentColor, lastModified }) => ({
        id: id.toString(),
        name,
        // TODO: Type activity to ActivityTemplate type
        activities: Array.isArray(listToActivityTemplate)
          ? listToActivityTemplate.map((activity) =>
              activity.activityTemplate.id.toString(),
            )
          : [],
        accent_color: accentColor || "red",
        lastModified: new Date(lastModified || 1),
      }),
    );
  }
  private static convertListToGraphQLList(
    list: ActivitiesList,
  ): GraphQLListPost {
    return {
      id: +list.id,
      name: list.name,
      accentColor: list.accent_color,
      listToActivityTemplate: list.activities.map((activity: string) => ({
        id: +activity,
      })),
      lastModified:
        list.lastModified?.toUTCString() || new Date(0).toUTCString(),
    };
  }

  /**
   * Subscribe activities store to mutations of lists in frontend
   * @param activitiesListsList Array of activity lists from activity store in Alpine.js
   */
  async subscribeToActivitiesListsList(
    activitiesListsList: ActivitiesList[],
  ): Promise<void> {
    (await urql.getInstance())
      .getUrqlClient()
      .query(ActivitiesListsSync.LISTS_LIST_QUERY, {})
      .subscribe((result) => {
        // empty the array and repopulate
        activitiesListsList.length = 0;

        for (const list of ActivitiesListsSync.convertGraphQLListToList(
          result.data?.lists || [],
        )) {
          activitiesListsList.push(list);
        }
      });
  }

  /**
   * Deletes an activity list by ID from the backend
   * @param id ID of activity list to delete
   */
  async delete(id: string): Promise<void> {
    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(ActivitiesListsSync.DELETE_MUTATION, {
        id: +id,
      });
    console.log("delete", result);
  }

  /**
   * Creates a new activity list on the backend
   * @param list list with new data
   */
  async post(list: ActivitiesList): Promise<void> {
    // Convert to a postable list
    const graphqlList = ActivitiesListsSync.convertListToGraphQLList(list);
    // Strip out id and lastModified
    const post = {
      name: graphqlList.name,
      accentColor: graphqlList.accentColor,
    };

    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(ActivitiesListsSync.POST_MUTATION, {
        list: post,
      });
    console.log("post list", result);
  }

  /**
   * Updates an existing activity list on the backend
   * @param list list with updated data
   */
  async put(list: ActivitiesList): Promise<void> {
    const graphqlList = ActivitiesListsSync.convertListToGraphQLList(list);
    const base = {
      name: graphqlList.name,
      accentColor: graphqlList.accentColor,
    };

    if (list.activities.length == 0) {
      const result = (await urql.getInstance())
        .getUrqlClient()
        .mutation(ActivitiesListsSync.PUT_NO_ACTIVITIES_MUTATION, {
          id: +list.id,
          list: base,
        });
      console.log("put list", result);
    } else {
      const result = (await urql.getInstance())
        .getUrqlClient()
        .mutation(ActivitiesListsSync.PUT_MUTATION, {
          id: +list.id,
          list: base,
          activities:
            list.activities.map((activity) => ({
              activityTemplate: +activity,
              list: +list.id,
            })) || [],
        });
      console.log("put list", result);
    }
  }
}
