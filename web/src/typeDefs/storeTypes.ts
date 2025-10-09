import type activities from "../stores/pages/activities";
import type scheduling from "../stores/pages/scheduling";

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
  activities: string[]; // activity ids
  accent_color: string;
  lastModified?: Date;
}
export interface ActivitiesListAccentColors {
  name: string;
  hex: string;
}

export interface PagesStore {
  activities: activities;
  scheduling: scheduling;
  teams: {
    teamsList: Team[];
  };
}

export interface SessionActivity extends Activity {
  isSessionCopy?: boolean;
  originalTemplateId?: string;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  notes: string;
  activities: SessionActivity[];
  team?: string;
  attendance?: { [key: string]: boolean };
}
