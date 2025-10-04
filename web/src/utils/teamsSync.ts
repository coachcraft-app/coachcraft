import type { GraphQLTeam } from "../typeDefs/graphqlTypes";
import type { Team } from "../typeDefs/storeTypes";
import urql from "./urql";

// CONVERSIONS
function GraphQLTeamToTeam(teams: GraphQLTeam[]): Team[] {
  const returnTeams: Team[] = [];

  for (const team of teams) {
    returnTeams.push({
      id: team.id.toString(),
      name: team.name,
      description: team.description,
      players: team.player.map((player) => player.name),
    });
  }

  return returnTeams;
}

const TeamsQuery = /* GraphQL */ `
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

export function subscribeToTeams(teamsList: Team[]) {
  if (urql.urqlClient) {
    urql.urqlClient.query(TeamsQuery, {}).subscribe((result) => {
      console.log("Teams subscription graphql result", result);

      // empty the array and repopulate
      teamsList.length = 0;
      for (const team of GraphQLTeamToTeam(result.data?.teams || [])) {
        teamsList.push(team);
      }
    });
  }
}

// DELETE TEAM
const TeamDelete = /* GraphQL */ `
  mutation deleteTeam($id: Int!) {
    deleteFromTeams(where: { id: { eq: $id } }) {
      id
    }
  }
`;

export function deleteTeam(id: string): void {
  if (urql.urqlClient) {
    urql.urqlClient
      .mutation(TeamDelete, { id: +id })
      .toPromise()
      .then((result) => {
        console.log("delete team", result);
      });
  }
}

// POST TEAM
const TeamPost = /* GraphQL */ `
  mutation insertTeam($team: TeamsInsertInput!) {
    insertIntoTeamsSingle(values: $team) {
      id
    }
  }
`;

export function postTeam(team: Team) {
  if (urql.urqlClient) {
    urql.urqlClient
      .mutation(TeamPost, {
        team: {
          name: team.name,
          description: team.description,
        },
      })
      .toPromise()
      .then((result) => {
        console.log("post team", result);
      });
  }
}

// PUT TEAM
const TeamPut = /* GraphQL */ `
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

const TeamPutNoPlayers = /* GraphQL */ `
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

export function putTeam(team: Team) {
  if (team.players.length > 0) {
    if (urql.urqlClient) {
      urql.urqlClient
        .mutation(TeamPut, {
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
        .toPromise()
        .then((result) => {
          console.log("put team", result);
        });
    }

    return;
  }

  // No players
  if (urql.urqlClient) {
    urql.urqlClient
      .mutation(TeamPutNoPlayers, {
        id: +team.id,
        team: {
          name: team.name,
          description: team.description,
        },
      })
      .toPromise()
      .then((result) => {
        console.log("put team", result);
      });
  }
}
