/**
 * SessionsSync handle the synchronization of sessions.
 * between the frontend Alpine.js stores and the backend via GraphQL.
 * They provide methods to subscribe to data changes, and to perform CRUD operations.
 * @module
 */

import type { GraphQLSession } from "@/typeDefs/graphqlTypes";
import type { Session, SessionActivity } from "@/typeDefs/storeTypes";
import { urql } from "@/libs/graphql/urql"; // importing a pre-initialised instance of urql
import { ActivitiesSync } from "./activitiesSync";

/**
 * SessionsSync handles synchronization of individual sessions.
 * It provides methods to subscribe to the sessions list, and to perform CRUD operations.
 */
export class SessionsSync {
  // GraphQL Queries and Mutations
  private static readonly SESSIONS_LIST_QUERY = /* GraphQL */ `
    query getSessions {
      sessions {
        id
        name
        date
        notes
        activities {
          id
          name
          duration
          description
          imgUrl
          lastModified
        }
        teams {
          id
          name
          description
          lastModified
        }
      }
    }
  `;
  private static readonly DELETE_MUTATION = /* GraphQL */ `
    mutation deleteSessions($id: Int!) {
      deleteFromSessions(where: { id: { eq: $id } }) {
        id
      }
    }
  `;
  private static readonly POST_MUTATION = /* GraphQL */ `
    mutation insertSessions($session: SessionsInsertInput!) {
      insertIntoSessionsSingle(values: $session) {
        id
        name
        date
        notes
      }
    }
  `;
  private static readonly POST_ACTIVITIES = /* GraphQL */ `
    mutation insertActivities($activities: [ActivitiesInsertInput!]!) {
      insertIntoActivities(values: $activities) {
        name
        description
        duration
        imgUrl
        session
      }
    }
  `;
  private static readonly PUT_MUTATION = /* GraphQL */ `
    mutation updateSessions($id: Int!, $set: SessionsUpdateInput!) {
      updateSessions(set: $set, where: { id: { eq: $id } }) {
        id
        name
        date
        notes
        team
        lastModified
      }
    }
  `;

  // Utilities
  private static convertGraphQLSessionToSession(
    sessions: GraphQLSession[],
  ): Session[] {
    return sessions.map(({ id, name, date, notes, activities, teams }) => ({
      id: id.toString(),
      name,
      date,
      notes,
      activities: ActivitiesSync.convertGraphQLActivityToActivity(
        activities || [],
      ),
      team: teams?.name,
    }));
  }

  private static convertSessionToGraphQLSession(
    session: Session,
  ): GraphQLSession {
    return {
      id: +session.id,
      name: session.name,
      date: new Date(session.date).toString(),
      notes: session.notes,
      lastModified:
        (session.lastModified && session.lastModified.toString()) ||
        new Date(0).toUTCString(),
    };
  }

  //   private static convertActivityToGraphQLActivity(
  //     activity: Activity,
  //   ): GraphQLActivity {
  //     return {
  //       id: +activity.id,
  //       name: activity.name,
  //       duration: ActivitiesSync.hhmmToMinutes(activity.duration),
  //       description: activity.description,
  //       imgUrl: activity.img_url,
  //       lastModified:
  //         (activity.lastModified && activity.lastModified.toString()) ||
  //         new Date(0).toUTCString(),
  //     };
  //   }

  /**
   * Subscribe activities store to mutations in frontend
   * @param activitiesList Array of activities from activityStore in Alpine.js
   */
  async subscribeToSessionsList(
    previousSessionsList: Session[],
    upcomingSessionsList: Session[],
  ): Promise<void> {
    (await urql.getInstance())
      .getUrqlClient()
      .query(SessionsSync.SESSIONS_LIST_QUERY, {})
      .subscribe((result) => {
        // empty the array and repopulate
        previousSessionsList.length = 0;
        upcomingSessionsList.length = 0;
        for (const session of SessionsSync.convertGraphQLSessionToSession(
          result.data?.sessions || [],
        )) {
          const sessionDate = new Date(session.date);
          const currentDate = new Date();
          if (sessionDate >= currentDate) upcomingSessionsList.push(session);
          else previousSessionsList.push(session);
        }
      });
  }

  async delete(id: number): Promise<void> {
    const result = await (await urql.getInstance())
      .getUrqlClient()
      .mutation(SessionsSync.DELETE_MUTATION, { id: id });
    console.log("delete session", result);
  }

  async post(session: Session): Promise<void> {
    // Convert to a postable activity
    const graphql_session =
      SessionsSync.convertSessionToGraphQLSession(session);
    const post = {
      name: graphql_session.name,
      date: graphql_session.date,
      notes: graphql_session.notes,
      team: (session.team && +session.team) || 1,
    };

    const result = await (await urql.getInstance())
      .getUrqlClient()
      .mutation(SessionsSync.POST_MUTATION, {
        session: post,
      });

    const activities_result = await (await urql.getInstance())
      .getUrqlClient()
      .mutation(SessionsSync.POST_ACTIVITIES, {
        activities: session.activities.map((activity) => {
          let new_activity =
            ActivitiesSync.convertActivityToGraphQLActivity(activity);
          new_activity.session = result.data.insertIntoSessionsSingle.id;
          return new_activity;
        }),
      });
    console.log("post session", result);
    console.log("post session activities", activities_result);
  }

  async notes(session: Session): Promise<void> {
    const result = await (await urql.getInstance())
      .getUrqlClient()
      .mutation(SessionsSync.PUT_MUTATION, {
        id: +session.id,
        set: {
          notes: session.notes,
        },
      });
  }
}
