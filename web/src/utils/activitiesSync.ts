import type {
  GraphQLActivity,
  GraphQLListQuery as GraphQLListQPost,
  GraphQLListPost,
} from "../typeDefs/graphqlTypes";
import urql from "./urql"; // importing a pre-initialised instance of urql

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
  ): object[] {
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
    activity: any,
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

  // Public API methods
  async subscribeToActivitiesList(activitiesList: any[]): Promise<void> {
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
  async delete(id: number): Promise<void> {
    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(ActivitiesSync.DELETE_MUTATION, { id: id });
    console.log("delete activity", result);
  }
  async post(activity: any): Promise<void> {
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
  async put(activity: any): Promise<void> {
    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(ActivitiesSync.PUT_MUTATION, {
        id: +activity.id,
        activity: ActivitiesSync.convertActivityToGraphQLActivity(activity),
      });
    console.log("put activity", result);
  }
}

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
  private static convertGraphQLListToList(lists: GraphQLListQPost[]): object[] {
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
  private static convertListToGraphQLList(list: any): GraphQLListPost {
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

  // Public API methods
  async subscribeToListsList(listsList: any[]): Promise<void> {
    (await urql.getInstance())
      .getUrqlClient()
      .query(ActivitiesListsSync.LISTS_LIST_QUERY, {})
      .subscribe((result) => {
        // empty the array and repopulate
        listsList.length = 0;
        for (const list of ActivitiesListsSync.convertGraphQLListToList(
          result.data?.lists || [],
        )) {
          listsList.push(list);
        }
      });
  }
  async delete(id: string): Promise<void> {
    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(ActivitiesListsSync.DELETE_MUTATION, {
        id: +id,
      });
    console.log("delete", result);
  }
  async post(list: any): Promise<void> {
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
  async put(list: any): Promise<void> {
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
            list.activities.map((activity: object) => ({
              activityTemplate: +activity,
              list: +list.id,
            })) || [],
        });
      console.log("put list", result);
    }
  }
}
