import type { Team, GraphQLTeam } from "./graphql-types";
import urqlClient from "./urql";

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
  urqlClient.query(TeamsQuery, {}).subscribe((result) => {
    console.log("Teams subscription graphql result", result);

    // empty the array and repopulate
    teamsList.length = 0;
    for (const team of GraphQLTeamToTeam(result.data?.teams || [])) {
      teamsList.push(team);
    }
  });

  console.log("Updated teams list", teamsList);
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
  urqlClient
    .mutation(TeamDelete, { id: +id })
    .toPromise()
    .then((result) => {
      console.log("delete team", result);
    });
}
