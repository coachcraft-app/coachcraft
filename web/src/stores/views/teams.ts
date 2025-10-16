/**
 * TeamsView
 * Holds state and methods for managing teams view
 * Shows list of teams and allows creating, editing, and deleting teams
 * @module
 */

import type { Team } from "@/typeDefs/storeTypes";

import sync from "@/libs/graphql/sync";

/**
 * TeamsView class
 * Holds state and methods for managing teams view
 * Holds event handlers for team selection and player management
 * Shows list of teams and allows creating, editing, and deleting teams
 * @class
 */
export class TeamsView {
  // public state
  public teamsList: Team[] = [];
  public selectedTeam: string | null = null;
  public rightPanelState: "placeholder" | "edit_team" = "placeholder";

  /**
   * empty constructor for instantiation
   */
  public constructor() {}

  /**
   * Get the selected team object or undefined if none is selected
   * @returns {Team | undefined
   */
  public get selectedTeamObj() {
    return this.teamsList.find((t) => t.id === this.selectedTeam);
  }

  /**
   * Get the list of team names with a placeholder option
   * @returns {string[]} List of team names with "---" as the first option
   */
  public get teamsNames() {
    return ["---", ...this.teamsList.map((t) => t.name)];
  }

  /**
   * Event handler to create a new team
   * Initializes with default values and selects it for editing
   * Syncs the new team to the backend
   */
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

  /**
   * Event handler for selecting a team from the list
   * Sets the selected team and updates the right panel state
   * @param id Event target value (team ID)
   */
  public onTeamSelection(id: string) {
    this.selectedTeam = id;
    this.rightPanelState = "edit_team";
  }

  /**
   * Event handler to add a new player to the selected team
   */
  public addPlayer() {
    if (!this.selectedTeamObj) return;
    this.selectedTeamObj.players.push("");
  }

  /**
   * Event handler to update a player's name in the selected team
   * @param index Index of the player in the players array
   * @param value New player name
   */
  public updatePlayer(index: number, value: string) {
    if (!this.selectedTeamObj) return;
    this.selectedTeamObj.players[index] = value;
  }

  /**
   * Event handler to remove a player from the selected team
   * @param index Index of the player to remove
   */
  public removePlayer(index: number) {
    if (!this.selectedTeamObj) return;
    this.selectedTeamObj.players.splice(index, 1);
  }

  /**
   * Event handler to save changes to the selected team
   * Syncs the updated team to the backend
   * @param event Event object from form submission
   */
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

  /**
   * Event handler to delete the selected team
   * Syncs the deletion to the backend and resets selection
   */
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

  /**
   * Event handler for selecting a team when scheduling a session
   * @param teamName Selected team name from dropdown
   */
  public onTeamSelectForSession(teamName: string) {
    if (teamName === "---") return null;
    const team = this.teamsList.find((t) => t.name === teamName);
    return team ? team.id : null;
  }
}

export default TeamsView;
