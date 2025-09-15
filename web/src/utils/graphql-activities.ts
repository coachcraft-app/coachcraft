import type { Activity, GraphQLActivity } from "./graphql-types";
import urqlClient from "./urql";

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
const ActivitiesQuery = `
  query {
    activities {
      id
      name
      duration
      description
      imgUrl
      lastModified
    }
  }
`;

export function subscribeToActivities(activitiesList: Activity[]) {
  urqlClient.query(ActivitiesQuery, {}).subscribe((result) => {
    // empty the array and repopulate
    activitiesList.length = 0;
    for (const act of GraphQLActivityToActivity(
      result.data?.activities || [],
    )) {
      activitiesList.push(act);
    }
  });

  console.log(activitiesList);
}

// DELETE ACTIVITY MUTATION
const ActivitiesDelete = `
  mutation deleteActivities($id: Int!) {
  deleteFromActivities(where: {id: {eq: $id}}) {
    id
  }
}
`;

export function deleteActivity(id: number) {
  urqlClient
    .mutation(ActivitiesDelete, { id: id })
    .toPromise()
    .then((result) => {
      console.log("delete", result);
    });
}

// POST ACTIVITY MUTATION
const ActivitiesPost = `
  mutation insertActivities($activity: ActivitiesInsertInput!) {
    insertIntoActivities(
      values: $activity
      ) {
      id
      name
      duration
      description
      imgUrl
      lastModified      
    }
  }
`;

export function postActivity(activity: Activity) {
  urqlClient
    .mutation(ActivitiesPost, {
      activity: convertActivityToGraphQLActivity(activity),
    })
    .toPromise()
    .then((result) => {
      console.log("post", result);
    });
}

// PUT ACTIVITY MUTATION
const ActivitiesPut = `
  mutation updateActivities($id: Int!, $activity: ActivitiesUpdateInput!) {
  updateActivities(where: {id: {eq: $id}}, set: $activity) {
    id
    name
    duration
    description
    imgUrl
    lastModified
  }
}
`;

export function putActivity(activity: Activity) {
  urqlClient
    .mutation(ActivitiesPut, {
      id: +activity.id,
      activity: convertActivityToGraphQLActivity(activity),
    })
    .toPromise()
    .then((result) => {
      console.log("put", result);
    });
}
