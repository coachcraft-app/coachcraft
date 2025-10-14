import type { GraphQLTeam } from "@/typedefs/graphqlTypes";
import urql from "@/libs/graphql/urql"; // importing a pre-initialised instance of urql

class TeamsSync {
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
  private static convertGraphQLTeamToTeam(teams: GraphQLTeam[]): object[] {
    return teams.map(({ id, name, description, player }) => ({
      id: id.toString(),
      name,
      description,
      players: player.map((p) => p.name),
    }));
  }

  // Public API methods
  async subscribeToTeamsList(teamsList: any[]): Promise<void> {
    (await urql.getInstance())
      .getUrqlClient()
      .query(TeamsSync.TEAMS_LIST_QUERY, {})
      .subscribe((result) => {
        // empty the array and repopulate
        teamsList.length = 0;
        for (const team of TeamsSync.convertGraphQLTeamToTeam(
          result.data?.teams || [],
        )) {
          teamsList.push(team);
        }
      });
  }
  async delete(id: string): Promise<void> {
    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(TeamsSync.DELETE_MUTATION, {
        id: +id,
      });
    console.log("delete team", result);
  }
  async post(team: any): Promise<void> {
    const result = (await urql.getInstance())
      .getUrqlClient()
      .mutation(TeamsSync.POST_MUTATION, {
        team: {
          name: team.name,
          description: team.description,
        },
      });
    console.log("post team", result);
  }
  async put(team: any): Promise<void> {
    if (team.players.length > 0) {
      const result = (await urql.getInstance())
        .getUrqlClient()
        .mutation(TeamsSync.PUT_MUTATION, {
          id: +team.id,
          team: {
            name: team.name,
            description: team.description,
          },
          players: team.players.map((player: object) => ({
            name: player,
            team: +team.id,
          })),
        });
      console.log("put team", result);
    } else {
      // No players
      const result = (await urql.getInstance())
        .getUrqlClient()
        .mutation(TeamsSync.PUT_NO_PLAYERS_MUTATION, {
          id: +team.id,
          team: {
            name: team.name,
            description: team.description,
          },
        });
      console.log("put team", result);
    }
  }
}

export default TeamsSync;
