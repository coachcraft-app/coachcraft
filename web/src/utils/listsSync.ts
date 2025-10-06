import type {
  GraphQLListQuery as GraphQLListQPost,
  GraphQLListPost,
} from "../typeDefs/graphqlTypes";
import type { List } from "../typeDefs/storeTypes";
import urql from "./urql"; // importing a pre-initialised instance of urql

class ListsSync {
  // GraphQL Queries and Mutations
  private static readonly LISTS_QUERY = /* GraphQL */ `
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
  private static readonly LISTS_DELETE = /* GraphQL */ `
    mutation deleteLists($id: Int!) {
      deleteFromLists(where: { id: { eq: $id } }) {
        id
      }

      deleteFromActivityTemplateList(where: { list: { eq: $id } }) {
        id
      }
    }
  `;
  private static readonly LISTS_POST = /* GraphQL */ `
    mutation insertLists($list: ListsInsertInput!) {
      insertIntoListsSingle(values: $list) {
        id
        name
        accentColor
        lastModified
      }
    }
  `;
  private static readonly LISTS_PUT = /* GraphQL */ `
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
  private static readonly LISTS_PUT_NO_ACTIVITIES = /* GraphQL */ `
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
  private static convertGraphQLListToList(lists: GraphQLListQPost[]): List[] {
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
  private static convertListToGraphQLList(list: List): GraphQLListPost {
    return {
      id: +list.id,
      name: list.name,
      accentColor: list.accent_color,
      listToActivityTemplate: list.activities.map((activity) => ({
        id: +activity,
      })),
      lastModified:
        list.lastModified?.toUTCString() || new Date(0).toUTCString(),
    };
  }

  // Public API methods
  subscribeToLists(listsList: List[]): void {
    urql.urqlClient?.query(ListsSync.LISTS_QUERY, {}).subscribe((result) => {
      // empty the array and repopulate
      listsList.length = 0;
      for (const list of ListsSync.convertGraphQLListToList(
        result.data?.lists || [],
      )) {
        listsList.push(list);
      }
    });
  }
  async deleteList(id: string): Promise<void> {
    const result = await urql.urqlClient?.mutation(ListsSync.LISTS_DELETE, {
      id: +id,
    });
    console.log("delete", result);
  }
  async postList(list: List): Promise<void> {
    // Convert to a postable list
    const graphqlList = ListsSync.convertListToGraphQLList(list);
    // Strip out id and lastModified
    const post = {
      name: graphqlList.name,
      accentColor: graphqlList.accentColor,
    };

    const result = await urql.urqlClient?.mutation(ListsSync.LISTS_POST, {
      list: post,
    });
    console.log("post list", result);
  }
  async putList(list: List): Promise<void> {
    const graphqlList = ListsSync.convertListToGraphQLList(list);
    const base = {
      name: graphqlList.name,
      accentColor: graphqlList.accentColor,
    };

    if (list.activities.length == 0) {
      const result = await urql.urqlClient?.mutation(
        ListsSync.LISTS_PUT_NO_ACTIVITIES,
        {
          id: +list.id,
          list: base,
        },
      );
      console.log("put list", result);
    } else {
      const result = await urql.urqlClient?.mutation(ListsSync.LISTS_PUT, {
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

export default ListsSync;
