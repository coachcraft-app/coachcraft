import type { User, UserManager } from "oidc-client-ts";

export type Player = string;

export interface Auth {
  user: User;
  userManage: UserManager;
}

export interface PagesStore {
  activities: {
    activitiesList: Activity[];
    activitiesListsList: ActivitiesList[];
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
    upcomingSessions: Session[]; // sessions that haven't been completed yet
    previousSessions: Session[];
    selectedTab: "lists"; // which tab is currently shown
    expandedSessions: Session[]; // shows which history sessions are expanded
  };
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

// Represents a team used in teamsStore
export interface Team {
  id: string; // Contains string representation of int
  name: string; // Name of team
  description: string; // Description of team
  players: Player[]; // Array of player names
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
export interface SessionActivity extends Activity {
  isSessionCopy?: boolean;
  originalTemplateId?: string;
}

export interface ToastNotification {
  id: number | undefined;
  title: string;
  message: string;
  variant: "info" | "danger";
}
