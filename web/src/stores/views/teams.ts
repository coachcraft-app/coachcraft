import type { Team } from "../../typedefs/storeTypes";
import sync from "../../libs/graphql/sync/sync";

export default class teams {
  // state
  public teamsList: Team[] = [];
  public selectedTeam: string | null = null;
  public rightPanelState: "placeholder" | "edit_team" = "placeholder";

  /**
   * empty constructor for instantiation
   */
  public constructor() {
    this.teamsList = [
      {
        id: "t1",
        name: "Team A",
        description: "First team",
        players: ["Player 1", "Player 2"],
      },
      {
        id: "t2",
        name: "Team B",
        description: "Second team",
        players: ["Player 3", "Player 4"],
      },
    ];

    // id of selected team
    this.selectedTeam = null;
    this.rightPanelState = "placeholder";
  }

  // getters
  public get selectedTeamObj() {
    return this.teamsList.find((t) => t.id === this.selectedTeam);
  }
  public get teamsNames() {
    return ["---", ...this.teamsList.map((t) => t.name)];
  }

  // methods
  public createTeam() {
    const newTeam: Team = {
      id: `t${this.teamsList.length + 1}`, // TODO: backend ID
      name: "New Team",
      description: "",
      players: [],
    };
    this.teamsList.push(newTeam);
    this.selectedTeam = newTeam.id;
    this.rightPanelState = "edit_team";

    sync.teams.post(newTeam);
  }

  public onTeamSelection(id: string) {
    this.selectedTeam = id;
    this.rightPanelState = "edit_team";
  }

  public addPlayer() {
    if (!this.selectedTeamObj) return;
    this.selectedTeamObj.players.push("");
  }

  public updatePlayer(index: number, value: string) {
    if (!this.selectedTeamObj) return;
    this.selectedTeamObj.players[index] = value;
  }

  public removePlayer(index: number) {
    if (!this.selectedTeamObj) return;
    this.selectedTeamObj.players.splice(index, 1);
  }

  public onSaveChanges(event: Event) {
    event.preventDefault();
    const formData = Object.fromEntries(
      new FormData(event.target as HTMLFormElement),
    );

    if (!formData.teamName) return;

    const team = this.selectedTeamObj;
    if (team) {
      team.name = formData.teamName as string;
      team.description = (formData.description as string) || "";
    }

    if (team) {
      sync.teams.put(team);
    }
  }

  public onDeleteTeam() {
    if (!this.selectedTeam) return;

    sync.teams.delete(this.selectedTeam);

    const index = this.teamsList.findIndex((t) => t.id === this.selectedTeam);
    if (index > -1) {
      this.teamsList.splice(index, 1);
      this.selectedTeam = null;
      this.rightPanelState = "placeholder";
    }
  }

  public onTeamSelectForSession(teamName: string) {
    if (teamName === "---") return null;
    const team = this.teamsList.find((t) => t.name === teamName);
    return team ? team.id : null;
  }
}
