import type {
  Activity,
  Session,
  SessionActivity,
  Team,
} from "@/typedefs/storeTypes";

export default class scheduling {
  // public state
  public sessionName: string = "";
  public sessionDate: string = "";
  public sessionNotes: string = "";
  public sessionActivities: SessionActivity[] = [];
  public selectedTeam: string | null = null;
  public upcomingSessions: Session[] = [];
  public previousSessions: Session[] = [];
  public selectedTab: "lists" | "last" | "history" = "lists";
  public expandedSessions: { [key: string]: boolean } = {};

  private activitiesList: Activity[];
  private teamsList: Team[];

  /**
   * constructor
   */
  public constructor(activitiesList: Activity[], teamsList: Team[]) {
    this.activitiesList = activitiesList;
    this.teamsList = teamsList;
  }

  public get lastSession(): Session | { activities: [] } {
    if (this.previousSessions[0]) {
      return this.previousSessions[0];
    } else {
      return { activities: [] };
    }
  }

  public addToSession(activity: Activity) {
    if (!this.sessionActivities.find((a) => a.id === activity.id)) {
      this.sessionActivities.push({ ...activity });
    }
  }

  public removeFromSession(index: number) {
    this.sessionActivities.splice(index, 1);
  }

  public handleDragStart(dragEvent: DragEvent, activity: Activity) {
    dragEvent.dataTransfer?.setData("text/plain", activity.id);
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.effectAllowed = "copy";
    }
  }

  public handleDragOver(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.dropEffect = "copy";
    }
  }

  public handleDrop(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    const id = dragEvent.dataTransfer?.getData("text/plain");
    const act = this.activitiesList.find((a) => a.id === id);
    if (act) this.addToSession(act);
  }

  public switchTab(tab: "lists" | "last" | "history") {
    this.selectedTab = tab;
  }

  public toggleSessionDetails(sessionId: string) {
    this.expandedSessions[sessionId] = !this.expandedSessions[sessionId];
  }

  public loadSession(session: Session) {
    if (!session || !session.activities) return;

    this.sessionActivities = [];

    session.activities.forEach((activity) => {
      if (activity) {
        this.addToSession(activity);
      }
    });
  }

  public saveSession(event: Event) {
    event.preventDefault();
    const formData = Object.fromEntries(
      new FormData(event.target as HTMLFormElement),
    );

    if (!formData.sessionName || !this.sessionActivities.length) return;

    const activityCopies: SessionActivity[] = this.sessionActivities.map(
      (activity) => ({
        ...activity,
        id: `${activity.id}_session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        isSessionCopy: true,
        originalTemplateId: activity.id,
      }),
    );

    const newSession: Session = {
      id: `s${this.upcomingSessions.length + this.previousSessions.length + 1}`, // TODO: backend ID
      name: formData.sessionName as string,
      date: formData.sessionDate as string,
      notes: formData.sessionNotes as string,
      activities: activityCopies,
      team: this.selectedTeam || undefined,
      attendance: (() => {
        const team = this.teamsList.find(
          (t: Team) => t.id === this.selectedTeam,
        );
        if (!team) return {};
        const att: { [key: string]: boolean } = {};
        team.players.forEach((p: string) => (att[p] = true));
        return att;
      })(),
    };

    this.upcomingSessions.unshift(newSession);

    // Reset form fields
    this.sessionName = "";
    this.sessionDate = "";
    this.sessionNotes = "";
    this.sessionActivities = [];
    this.selectedTeam = null;

    (event.target as HTMLFormElement).reset();
  }

  public moveActivityUp(index: number) {
    if (index > 0) {
      const activity = this.sessionActivities[index];
      this.sessionActivities.splice(index, 1);
      this.sessionActivities.splice(index - 1, 0, activity);
    }
  }

  public moveActivityDown(index: number) {
    if (index < this.sessionActivities.length - 1) {
      const activity = this.sessionActivities[index];
      this.sessionActivities.splice(index, 1);
      this.sessionActivities.splice(index + 1, 0, activity);
    }
  }

  public deleteSession(sessionId: string) {
    let idx = this.upcomingSessions.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      this.upcomingSessions.splice(idx, 1);
      return;
    }

    idx = this.previousSessions.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      this.previousSessions.splice(idx, 1);
    }
  }
}
