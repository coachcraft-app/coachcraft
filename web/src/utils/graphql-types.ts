export interface ActivityStore {
  activitiesList: Activity[];
  listsList: List[];
}

// Represents a team used in teamsStore
export interface Team {
  id: string; // Contains string representation of int
  name: string; // Name of team
  description: string; // Description of team
  players: string[]; // Array of player names
}

// GraphQL representation of a player
export interface GraphQLPlayer {
  id: number; // Contains id integer from database
  name: string; // Name of player
  lastModified: string; // ISO 8601 date string
}

// GraphQL representation of a team
export interface GraphQLTeam {
  id: number; // Contains id integer from database
  name: string; // Name of team
  description: string; // Description of team
  lastModified: string; // ISO 8601 date string
  players: GraphQLPlayer[]; // Array of players
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

export interface GraphQLActivity {
  id: number; // Contains "default" or a string representation of int
  name: string; // Title of activity
  duration: number; // In total minutes
  description: string; //
  imgUrl: string; //
  lastModified: string; //
}

// Represents a list used in activitiesStore
export interface List {
  id: string;
  name: string;
  activities: string[] | void[]; // activity ids
  accent_color: string;
  lastModified?: Date;
}

export type listToActivityTemplate = { activityTemplate: { id: number } }[];

export interface GraphQLListQuery {
  id: number;
  name: string;
  listToActivityTemplate?: listToActivityTemplate;
  accentColor?: string;
  lastModified: string;
}

export interface GraphQLListPost {
  id: number;
  name: string;
  listToActivityTemplate?: { id: number }[];
  accentColor?: string;
  lastModified?: string;
}
