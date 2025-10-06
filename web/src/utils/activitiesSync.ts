import type { GraphQLActivity } from "../typeDefs/graphqlTypes";
import type { Activity } from "../typeDefs/storeTypes";
import urql from "./urql";

// CONVERSIONS
function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function GraphQLActivityToActivity(activities: GraphQLActivity[]) {
  const returnActivities: Activity[] = [];

  // Convert each activity
  for (const act of activities) {
    returnActivities.push({
      id: act.id.toString(),
      name: act.name,
      duration: minutesToHHMM(Number(act.duration)),
      description: act.description,
      img_url: act.imgUrl,
      lastModified: new Date(act.lastModified || 1),
    });
  }

  return returnActivities;
}

function convertActivityToGraphQLActivity(activity: Activity): GraphQLActivity {
  return {
    id: +activity.id,
    name: activity.name,
    duration: hhmmToMinutes(activity.duration),
    description: activity.description,
    imgUrl: activity.img_url,
    lastModified:
      (activity.lastModified && activity.lastModified.toString()) ||
      new Date(0).toUTCString(),
  };
}

// SYNC ACTIVITIES
const ActivitiesQuery = /* GraphQL */ `
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
export function subscribeToActivities(activitiesList: Activity[]): void {
  urql.urqlClient?.query(ActivitiesQuery, {}).subscribe((result) => {
    // empty the array and repopulate
    activitiesList.length = 0;
    for (const act of GraphQLActivityToActivity(
      result.data?.activityTemplates || [],
    )) {
      activitiesList.push(act);
    }
  });
}

// DELETE ACTIVITY MUTATION
const ActivitiesDelete = /* GraphQL */ `
  mutation deleteActivities($id: Int!) {
    deleteFromActivityTemplates(where: { id: { eq: $id } }) {
      id
    }
  }
`;
export async function deleteActivity(id: number): Promise<void> {
  const result = await urql.urqlClient?.mutation(ActivitiesDelete, { id: id });
  console.log("delete activity", result);
}

// POST ACTIVITY MUTATION
const ActivitiesPost = /* GraphQL */ `
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
export async function postActivity(activity: Activity): Promise<void> {
  // Convert to a postable activity
  const graphqlActivity = convertActivityToGraphQLActivity(activity);
  const post = {
    name: graphqlActivity.name,
    duration: graphqlActivity.duration,
    description: graphqlActivity.description,
    imgUrl: graphqlActivity.imgUrl,
  };

  const result = await urql.urqlClient?.mutation(ActivitiesPost, {
    activity: post,
  });
  console.log("post activity", result);
}

// PUT ACTIVITY MUTATION
const ActivitiesPut = /* GraphQL */ `
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
export async function putActivity(activity: Activity): Promise<void> {
  const result = await urql.urqlClient?.mutation(ActivitiesPut, {
    id: +activity.id,
    activity: convertActivityToGraphQLActivity(activity),
  });
  console.log("put activity", result);
}
