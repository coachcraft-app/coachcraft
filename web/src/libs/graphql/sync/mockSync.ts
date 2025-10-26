import type {
  Activity,
  ActivitiesList,
  Team,
  Session,
} from "@/typeDefs/storeTypes";

export class MockActivitiesSync {
  async subscribeToActivitiesList(activitiesList: Activity[]): Promise<void> {
    // no-op: keep current list as-is
    activitiesList.length = activitiesList.length;
  }
  async delete(id: number): Promise<void> {
    console.log("delete activity", id);
  }
  async post(activity: Activity): Promise<void> {
    console.log("post activity", activity?.name);
  }
  async put(activity: Activity): Promise<void> {
    console.log("put activity", activity?.id);
  }
}

export class MockActivitiesListsSync {
  async subscribeToActivitiesListsList(lists: ActivitiesList[]): Promise<void> {
    // no-op: keep current list as-is
    lists.length = lists.length;
  }
  async delete(id: string): Promise<void> {
    console.log("delete list", id);
  }
  async post(list: ActivitiesList): Promise<void> {
    console.log("post list", list?.name);
  }
  async put(list: ActivitiesList): Promise<void> {
    console.log("put list", list?.id);
  }
}

export class MockTeamsSync {
  async subscribeToTeamsList(teams: Team[]): Promise<void> {
    // no-op: keep current list as-is
    teams.length = teams.length;
  }
  async delete(id: string): Promise<void> {
    console.log("delete team", id);
  }
  async post(team: Team): Promise<void> {
    console.log("post team", team?.name);
  }
  async put(team: Team): Promise<void> {
    console.log("put team", team?.id);
  }
}

export class MockSessionsSync {
  async subscribeToSessionsList(
    previousSessionsList: Session[],
    upcomingSessionsList: Session[],
  ): Promise<void> {
    // no-op: keep arrays as-is
    previousSessionsList.length = previousSessionsList.length;
    upcomingSessionsList.length = upcomingSessionsList.length;
  }
  async delete(id: number): Promise<void> {
    console.log("delete session", id);
  }
  async post(session: Session): Promise<void> {
    console.log("post session", session?.name);
  }
  async notes(session: Session): Promise<void> {
    console.log("update session notes", session?.id);
  }
}
