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
  player: GraphQLPlayer[]; // Array of players
}

export interface GraphQLActivity {
  id: number; // Contains "default" or a string representation of int
  name: string; // Title of activity
  duration: number; // In total minutes
  description: string; //
  imgUrl: string; //
  lastModified: string; //
  session?: number;
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

export interface GraphQLSession {
  id: number;
  name: string;
  date: string;
  notes: string;
  activities?: GraphQLActivity[];
  teams?: GraphQLTeam;
  lastModified?: string;
}
