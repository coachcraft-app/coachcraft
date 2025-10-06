import type { GraphQLTeam } from "../typeDefs/graphqlTypes";
import type { Team } from "../typeDefs/storeTypes";
import urql from "./urql"; // importing a pre-initialised instance of urql

class TeamsSync {
  // GraphQL Queries and Mutations
  private static readonly TEAMS_QUERY = /* GraphQL */ `
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
  private static readonly TEAM_DELETE = /* GraphQL */ `
    mutation deleteTeam($id: Int!) {
      deleteFromTeams(where: { id: { eq: $id } }) {
        id
      }
    }
  `;
  private static readonly TEAM_POST = /* GraphQL */ `
    mutation insertTeam($team: TeamsInsertInput!) {
      insertIntoTeamsSingle(values: $team) {
        id
      }
    }
  `;
  private static readonly TEAM_PUT = /* GraphQL */ `
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
  private static readonly TEAM_PUT_NO_PLAYERS = /* GraphQL */ `
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

  // Public API methods
  subscribeToTeams(teamsList: Team[]): void {
    urql.urqlClient?.query(TeamsSync.TEAMS_QUERY, {}).subscribe((result) => {
      // empty the array and repopulate
      teamsList.length = 0;
      for (const team of TeamsSync.convertGraphQLTeamToTeam(
        result.data?.teams || [],
      )) {
        teamsList.push(team);
      }
    });
  }
  async deleteTeam(id: string): Promise<void> {
    const result = await urql.urqlClient?.mutation(TeamsSync.TEAM_DELETE, {
      id: +id,
    });
    console.log("delete team", result);
  }
  async postTeam(team: Team): Promise<void> {
    const result = await urql.urqlClient?.mutation(TeamsSync.TEAM_POST, {
      team: {
        name: team.name,
        description: team.description,
      },
    });
    console.log("post team", result);
  }
  async putTeam(team: Team): Promise<void> {
    if (team.players.length > 0) {
      const result = await urql.urqlClient?.mutation(TeamsSync.TEAM_PUT, {
        id: +team.id,
        team: {
          name: team.name,
          description: team.description,
        },
        players: team.players.map((player) => ({
          name: player,
          team: +team.id,
        })),
      });
      console.log("put team", result);
    } else {
      // No players
      const result = await urql.urqlClient?.mutation(
        TeamsSync.TEAM_PUT_NO_PLAYERS,
        {
          id: +team.id,
          team: {
            name: team.name,
            description: team.description,
          },
        },
      );
      console.log("put team", result);
    }
  }
}

export default TeamsSync;
