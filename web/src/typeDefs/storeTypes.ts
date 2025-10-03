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
export interface List {
  id: string;
  name: string;
  activities: string[] | void[]; // activity ids
  accent_color: string;
  lastModified?: Date;
}

export interface PagesStore {
  activities: {
    activitiesList: Activity[];
    listsList: List[];
  };
  teams: {
    teamsList: Team[];
  };
}
