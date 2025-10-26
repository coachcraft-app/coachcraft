export class MockActivitiesSync {
  async subscribeToActivitiesList(_activitiesList: any[]): Promise<void> {}
  async delete(id: number): Promise<void> {
    console.log("delete activity");
  }
  async post(activity: any): Promise<void> {
    console.log("post activity");
  }
  async put(activity: any): Promise<void> {
    console.log("put activity");
  }
}

export class MockActivitiesListsSync {
  async subscribeToActivitiesListsList(_lists: any[]): Promise<void> {}
  async delete(id: string): Promise<void> {
    console.log("delete list");
  }
  async post(list: any): Promise<void> {
    console.log("post list");
  }
  async put(list: any): Promise<void> {
    console.log("put list");
  }
}

export class MockTeamsSync {
  async subscribeToTeamsList(teams: any[]): Promise<void> {}
  async delete(id: string): Promise<void> {
    console.log("delete team");
  }
  async post(team: any): Promise<void> {
    console.log("post team");
  }
  async put(team: any): Promise<void> {
    console.log("put team");
  }
}
