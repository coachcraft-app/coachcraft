import type {
  List,
  GraphQLListQuery as GraphQLListQPost,
  GraphQLListPost,
} from "./graphql-types";
import urqlClient from "./urql";

// CONVERSIONS
function GraphQLListToList(lists: GraphQLListQPost[]): List[] {
  const returnLists: List[] = [];

  for (const list of lists) {
    returnLists.push({
      id: list.id.toString(),
      name: list.name,
      // TODO: Type activity to ActivityTemplate type
      activities: Array.isArray(list.listToActivityTemplate)
        ? list.listToActivityTemplate.map((activity) =>
            activity.activityTemplate.id.toString(),
          )
        : [],
      accent_color: list.accentColor || "red",
      lastModified: new Date(list.lastModified || 1),
    });
  }

  return returnLists;
}

function convertListToGraphQLList(list: List): GraphQLListPost {
  return {
    id: +list.id,
    name: list.name,
    accentColor: list.accent_color,
    listToActivityTemplate: list.activities.map((activity) => ({
      id: +activity,
    })),
    lastModified: list.lastModified
      ? list.lastModified.toUTCString()
      : new Date(0).toUTCString(),
  };
}

// SYNC LISTS
const ListsQuery = /* GraphQL */ `
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

export function subscribeToLists(listsList: List[]) {
  urqlClient.query(ListsQuery, {}).subscribe((result) => {
    // empty the array and repopulate
    listsList.length = 0;
    for (const list of GraphQLListToList(result.data?.lists || [])) {
      listsList.push(list);
    }
  });

  console.log(listsList);
}

// DELETE LIST
const ListsDelete = /* GraphQL */ `
  mutation deleteLists($id: Int!) {
    deleteFromLists(where: { id: { eq: $id } }) {
      id
    }

    deleteFromActivityTemplateList(where: { list: { eq: $id } }) {
      id
    }
  }
`;

export function deleteList(id: string) {
  urqlClient
    .mutation(ListsDelete, { id: +id })
    .toPromise()
    .then((result) => {
      console.log("delete", result);
    });
}

// POST ACTIVITY MUTATION
const ListsPost = /* GraphQL */ `
  mutation insertLists($list: ListsInsertInput!) {
    insertIntoListsSingle(values: $list) {
      id
      name
      accentColor
      lastModified
    }
  }
`;

export function postList(list: List) {
  // Convert to a postable list
  const graphqlList = convertListToGraphQLList(list);
  // Strip out id and lastModified
  const post = {
    name: graphqlList.name,
    accentColor: graphqlList.accentColor,
  };

  urqlClient
    .mutation(ListsPost, {
      list: post,
    })
    .toPromise()
    .then((result) => {
      console.log("post", result);
    });
}

// PUT ACTIVITY MUTATION
const ListsPut = /* GraphQL */ `
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

const ListsPutNoActivities = /* GraphQL */ `
  mutation updateLists($id: Int!, $list: ListsUpdateInput!) {
    updateLists(where: { id: { eq: $id } }, set: $list) {
      id
      name
      accentColor
      lastModified
    }
  }
`;

export function putList(list: List) {
  const graphqlList = convertListToGraphQLList(list);
  const base = {
    name: graphqlList.name,
    accentColor: graphqlList.accentColor,
  };

  if (list.activities.length == 0) {
    urqlClient
      .mutation(ListsPutNoActivities, {
        id: +list.id,
        list: base,
      })
      .toPromise()
      .then((result) => {
        console.log("put", result);
      });
  } else {
    urqlClient
      .mutation(ListsPut, {
        id: +list.id,
        list: base,
        activities:
          list.activities.map((activity) => ({
            activityTemplate: +activity,
            list: +list.id,
          })) || [],
      })
      .toPromise()
      .then((result) => {
        console.log("put", result);
      });
  }
}
