import type { GraphQLActivity } from "../typeDefs/graphqlTypes";
import type { Activity } from "../typeDefs/storeTypes";
import urql from "./urql"; // importing a pre-initialised instance of urql

class ActivitiesSync {
  // GraphQL Queries and Mutations
  private static readonly ACTIVITIES_QUERY = /* GraphQL */ `
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
  private static readonly ACTIVITIES_DELETE = /* GraphQL */ `
    mutation deleteActivities($id: Int!) {
      deleteFromActivityTemplates(where: { id: { eq: $id } }) {
        id
      }
    }
  `;
  private static readonly ACTIVITIES_POST = /* GraphQL */ `
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
  private static readonly ACTIVITIES_PUT = /* GraphQL */ `
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

  // Public API methods
  subscribeToActivities(activitiesList: Activity[]): void {
    urql.urqlClient
      ?.query(ActivitiesSync.ACTIVITIES_QUERY, {})
      .subscribe((result) => {
        // empty the array and repopulate
        activitiesList.length = 0;
        for (const act of ActivitiesSync.convertGraphQLActivityToActivity(
          result.data?.activityTemplates || [],
        )) {
          activitiesList.push(act);
        }
      });
  }
  async deleteActivity(id: number): Promise<void> {
    const result = await urql.urqlClient?.mutation(
      ActivitiesSync.ACTIVITIES_DELETE,
      { id: id },
    );
    console.log("delete activity", result);
  }
  async postActivity(activity: Activity): Promise<void> {
    // Convert to a postable activity
    const graphqlActivity =
      ActivitiesSync.convertActivityToGraphQLActivity(activity);
    const post = {
      name: graphqlActivity.name,
      duration: graphqlActivity.duration,
      description: graphqlActivity.description,
      imgUrl: graphqlActivity.imgUrl,
    };

    const result = await urql.urqlClient?.mutation(
      ActivitiesSync.ACTIVITIES_POST,
      {
        activity: post,
      },
    );
    console.log("post activity", result);
  }
  async putActivity(activity: Activity): Promise<void> {
    const result = await urql.urqlClient?.mutation(
      ActivitiesSync.ACTIVITIES_PUT,
      {
        id: +activity.id,
        activity: ActivitiesSync.convertActivityToGraphQLActivity(activity),
      },
    );
    console.log("put activity", result);
  }
}

export default ActivitiesSync;
