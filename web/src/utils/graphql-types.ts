export interface ActivityStore {
  activitiesList: Activity[];
  listsList: List[];
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
  activities: string[]; // activity ids
  accent_color: string;
  lastModified?: Date;
}

export interface GraphQLActivity {
  id: number; // Contains "default" or a string representation of int
  name: string; // Title of activity
  duration: number; // In total minutes
  description: string; //
  imgUrl: string; //
  lastModified: string; //
}

export interface GraphQLList {
  id: number;
  name: string;
  accentColor: string;
  lastModified: string;
  activities: number[];
}

export interface APIActivitiesResponse {
  activities: GraphQLActivity[];
}

export interface APIListResponse {
  lists: GraphQLList[];
}
