/**
 * TeamsSync class to handle synchronization of Team data between frontend and backend using GraphQL.
 * It provides methods to subscribe to team list updates, and to create, update, and delete teams.
 * @module
 */

import type { GraphQLTeam } from "@/typeDefs/graphqlTypes";
import { urql } from "@/libs/graphql/urql"; // importing a pre-initialised instance of urql
import type { Team } from "@/typeDefs/storeTypes";

/**
 * TeamsSync class to handle synchronization of Team data between frontend and backend using GraphQL.
 * It provides methods to subscribe to team list updates, and to create, update, and delete teams.
 */
export class TeamsSync {
  private static urqlInstancePromise: Promise<urql> | undefined = undefined;
  private static async getClient() {
    if (!TeamsSync.urqlInstancePromise) {
      TeamsSync.urqlInstancePromise = urql.getInstance();
    }
    const instance = await TeamsSync.urqlInstancePromise;
    return instance.getUrqlClient();
  }

  // GraphQL Queries and Mutations
  private static readonly TEAMS_LIST_QUERY = /* GraphQL */ `
    query getTeams {
      teams {
        id
        name
        description
        lastModified
        player {
          id
          name
          lastModified
        }
      }
    }
  `;
  private static readonly DELETE_MUTATION = /* GraphQL */ `
    mutation deleteTeam($id: Int!) {
      deleteFromTeams(where: { id: { eq: $id } }) {
        id
      }
    }
  `;
  private static readonly POST_MUTATION = /* GraphQL */ `
    mutation insertTeam($team: TeamsInsertInput!) {
      insertIntoTeamsSingle(values: $team) {
        id
      }
    }
  `;
  private static readonly PUT_MUTATION = /* GraphQL */ `
    mutation updateTeam(
      $id: Int!
      $team: TeamsUpdateInput!
      $players: [PlayersInsertInput!]!
    ) {
      updateTeams(set: $team, where: { id: { eq: $id } }) {
        id
        name
        description
        lastModified
      }

      deleteFromPlayers(where: { team: { eq: $id } }) {
        id
      }

      insertIntoPlayers(values: $players) {
        id
      }
    }
  `;
  private static readonly PUT_NO_PLAYERS_MUTATION = /* GraphQL */ `
    mutation updateTeam($id: Int!, $team: TeamsUpdateInput!) {
      updateTeams(set: $team, where: { id: { eq: $id } }) {
        id
        name
        description
        lastModified
      }

      deleteFromPlayers(where: { team: { eq: $id } }) {
        id
      }
    }
  `;

  // Utilities
  private static convertGraphQLTeamToTeam(teams: GraphQLTeam[]): Team[] {
    return teams.map(({ id, name, description, player }) => ({
      id: id.toString(),
      name,
      description,
      players: player.map((p) => p.name),
    }));
  }

  /**
   * Subscribe teams store to mutations in frontend
   * @param teamsList Array of teams on team store on Alpine.js
   */
  async subscribeToTeamsList(teamsList: Team[]): Promise<void> {
    const client = await TeamsSync.getClient();
    client.query(TeamsSync.TEAMS_LIST_QUERY, {}).subscribe((result) => {
      // empty the array and repopulate
      teamsList.length = 0;
      for (const team of TeamsSync.convertGraphQLTeamToTeam(
        result.data?.teams || [],
      )) {
        teamsList.push(team);
      }
    });
  }

  /**
   * Deletes a team by ID from the backend
   * @param id ID of team to delete
   */
  async delete(id: string): Promise<void> {
    const client = await TeamsSync.getClient();
    const result = await client
      .mutation(TeamsSync.DELETE_MUTATION, {
        id: +id,
      })
      .toPromise();
    console.log("delete team", result);
  }

  /**
   * Creates a new team on the backend
   * @param team Team object with new data
   */
  async post(team: Team): Promise<void> {
    const client = await TeamsSync.getClient();
    const result = await client
      .mutation(TeamsSync.POST_MUTATION, {
        team: {
          name: team.name,
          description: team.description,
        },
      })
      .toPromise();
    console.log("post team", result);
  }

  /**
   * Updates a team on the backend
   * @param team Team object with updated data
   */
  async put(team: Team): Promise<void> {
    if (team.players.length > 0) {
      const client = await TeamsSync.getClient();
      const result = await client
        .mutation(TeamsSync.PUT_MUTATION, {
          id: +team.id,
          team: {
            name: team.name,
            description: team.description,
          },
          players: team.players.map((player) => ({
            name: player,
            team: +team.id,
          })),
        })
        .toPromise();
      console.log("put team", result);
    } else {
      // No players
      const client = await TeamsSync.getClient();
      const result = await client
        .mutation(TeamsSync.PUT_NO_PLAYERS_MUTATION, {
          id: +team.id,
          team: {
            name: team.name,
            description: team.description,
          },
        })
        .toPromise();
      console.log("put team", result);
    }
  }
}
