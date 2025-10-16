/**
 * Scheduling View
 * Manages state and actions related to scheduling sessions
 * Held in Alpine.js store
 * @module
 */

import type {
  Activity,
  Session,
  SessionActivity,
  Team,
} from "@/typeDefs/storeTypes";

/**
 * SchedulingView class
 * Holds state and methods for scheduling sessions
 * Has event handlers for drag-and-drop and form submissions
 * @class
 */
export class SchedulingView {
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

  /**
   * Get the last session or an empty session if none exist
   * @returns {Session | { activities: [] }} The last session or an empty session object
   */
  public get lastSession(): Session | { activities: [] } {
    if (this.previousSessions[0]) {
      return this.previousSessions[0];
    } else {
      return { activities: [] };
    }
  }

  /**
   * Event handler that adds an activity to the current session if not already present
   * @param activity Activity to add
   */
  public addToSession(activity: Activity) {
    if (!this.sessionActivities.find((a) => a.id === activity.id)) {
      this.sessionActivities.push({ ...activity });
    }
  }

  /**
   * Event handler that removes an activity from the current session by index
   * @param index Index of the activity to remove
   */
  public removeFromSession(index: number) {
    this.sessionActivities.splice(index, 1);
  }

  /**
   * Event handler for drag start event for activities
   * Sets the drag data to the activity ID
   * @param dragEvent Drag event
   * @param activity Activity being dragged
   */
  public handleDragStart(dragEvent: DragEvent, activity: Activity) {
    dragEvent.dataTransfer?.setData("text/plain", activity.id);
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.effectAllowed = "copy";
    }
  }

  /**
   * Event handler for drag over event on the drop target
   * Copies the dragged activity to the session if dropped
   * @param dragEvent Drag event
   */
  public handleDragOver(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.dropEffect = "copy";
    }
  }

  /**
   * Event handler for drop event on the drop target
   * Adds the dragged activity to the session
   * @param dragEvent Drag event
   */
  public handleDrop(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    const id = dragEvent.dataTransfer?.getData("text/plain");
    const act = this.activitiesList.find((a) => a.id === id);
    if (act) this.addToSession(act);
  }

  /**
   * Event handler to switch between tabs on right panel ("lists", "last", "history")
   * @param tab Tab to switch to
   */
  public switchTab(tab: "lists" | "last" | "history") {
    this.selectedTab = tab;
  }

  /**
   * Event handler to toggle expansion of session details
   * @param sessionId ID of the session to toggle
   */
  public toggleSessionDetails(sessionId: string) {
    this.expandedSessions[sessionId] = !this.expandedSessions[sessionId];
  }

  /**
   * Load a session's activities into the current session
   * @param session Session to load
   */
  public loadSession(session: Session) {
    if (!session || !session.activities) return;

    this.sessionActivities = [];

    session.activities.forEach((activity) => {
      if (activity) {
        this.addToSession(activity);
      }
    });
  }

  /**
   * Event handler for saving the current session
   * Creates a new session object and adds it to upcoming sessions
   * Resets form fields after saving
   * @param event Event from form submission
   */
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

  /**
   * Event handler to move an activity up in the session activities list
   * @param index Index of the activity to move up
   */
  public moveActivityUp(index: number) {
    if (index > 0) {
      const activity = this.sessionActivities[index];
      this.sessionActivities.splice(index, 1);
      this.sessionActivities.splice(index - 1, 0, activity);
    }
  }

  /**
   * Event handler to move an activity down in the session activities list
   * @param index Index of the activity to move down
   */
  public moveActivityDown(index: number) {
    if (index < this.sessionActivities.length - 1) {
      const activity = this.sessionActivities[index];
      this.sessionActivities.splice(index, 1);
      this.sessionActivities.splice(index + 1, 0, activity);
    }
  }

  /**
   * Delete a session by ID from either upcoming or previous sessions
   * @param sessionId Session ID to delete
   */
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
