export default function teamsStore(Alpine) {
  Alpine.store("pages").teams = {
    // state
    teamsList: [
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
    ],
    selectedTeam: null, // id of selected team
    rightPanelState: "placeholder",

    // getters
    get selectedTeamObj() {
      return this.teamsList.find((t) => t.id === this.selectedTeam);
    },
    get teamsNames() {
      return ["---", ...this.teamsList.map((t) => t.name)];
    },

    // methods
    createTeam() {
      const newTeam = {
        id: `t${this.teamsList.length + 1}`,
        name: "New Team",
        description: "",
        players: [],
      };
      this.teamsList.push(newTeam);
      this.selectedTeam = newTeam.id;
      this.rightPanelState = "edit_team";
    },

    onTeamSelection(id) {
      this.selectedTeam = id;
      this.rightPanelState = "edit_team";
    },

    addPlayer() {
      if (!this.selectedTeamObj) return;
      this.selectedTeamObj.players.push("");
    },

    updatePlayer(index, value) {
      if (!this.selectedTeamObj) return;
      this.selectedTeamObj.players[index] = value;
    },

    removePlayer(index) {
      if (!this.selectedTeamObj) return;
      this.selectedTeamObj.players.splice(index, 1);
    },

    onSaveChanges(event) {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(event.target));

      if (!formData.teamName) return;

      const team = this.selectedTeamObj;
      if (team) {
        team.name = formData.teamName;
        team.description = formData.description || "";
      }
    },

    onDeleteTeam() {
      if (!this.selectedTeam) return;

      const index = this.teamsList.findIndex((t) => t.id === this.selectedTeam);
      if (index > -1) {
        this.teamsList.splice(index, 1);
        this.selectedTeam = null;
        this.rightPanelState = "placeholder";
      }
    },

    onTeamSelectForSession(teamName) {
      if (teamName === "---") return null;
      const team = this.teamsList.find((t) => t.name === teamName);
      return team ? team.id : null;
    },
  };
}
