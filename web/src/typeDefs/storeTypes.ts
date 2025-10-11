export type Player = string;

// Represents a team used in teamsStore
export interface Team {
  id: string; // Contains string representation of int
  name: string; // Name of team
  description: string; // Description of team
  players: Player[]; // Array of player names
}

// Represents an activity used in activitiesStore
export interface Activity {
  id: string; // Contains "default" or a string representation of int
  name: string; // Name of activity
  duration: string; // In the form "hh:mm"
  description: string; //
  img_url: string; //
  lastModified?: Date; //
}
// Represents a list used in activitiesStore
export interface ActivitiesList {
  id: string;
  name: string;
  activities: string[] | void[]; // activity ids
  accent_color: string;
  lastModified?: Date;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  notes: string;
  activities: Activity[];
}

export interface PagesStore {
  activities: {
    activitiesList: Activity[];
    listsList: ActivitiesList[];
  };
  teams: {
    teamsList: Team[];
  };
  scheduling: {
    sessionName: ""; //name of the schedule
    sessionDate: ""; //date of the schedule
    sessionNotes: ""; //notes for the schedule
    sessionActivities: Activity[]; //array of activities dropped in
    selectedTeam: null; //id of selected team
    listsList: ActivitiesList[];
    activitiesList: Activity[];
    upcomingSessions: Session[]; // sessions that haven't been completed yet
    previousSessions: Session[];
    selectedTab: "lists"; // which tab is currently shown
    expandedSessions: Session[]; // shows which history sessions are expanded
  };
}
