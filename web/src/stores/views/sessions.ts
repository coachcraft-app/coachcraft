import alpine from "../../libs/alpine";
import type { Session } from "@/typedefs/storeTypes";

export default class sessions {
  /**
   * empty constructor for instantiation
   */
  public constructor() {}

  private get schedulingStore() {
    const pagesStore = alpine
      .getInstance()
      .getGlobalAlpine()
      .store("pages") as PagesStore;
    return pagesStore.scheduling;
  }

  // mark session as complete
  public completeSession(sessionId: string) {
    const schedulingStore = this.schedulingStore;
    const sessionIndex = schedulingStore.upcomingSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (sessionIndex === -1) return;

    const completedSession = schedulingStore.upcomingSessions[sessionIndex];
    schedulingStore.upcomingSessions.splice(sessionIndex, 1);
    schedulingStore.previousSessions.unshift(completedSession);
  }

  // Update session notes
  public updateNotes(sessionId: string, newNotes: string) {
    const schedulingStore = this.schedulingStore;

    // find in upcoming sessions
    const upcomingIndex = schedulingStore.upcomingSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (upcomingIndex !== -1) {
      schedulingStore.upcomingSessions[upcomingIndex].notes = newNotes;
      return;
    }

    // find in previous sessions
    const previousIndex = schedulingStore.previousSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (previousIndex !== -1) {
      schedulingStore.previousSessions[previousIndex].notes = newNotes;
    }
  }

  public toggleAttendance(sessionId: string, player: string) {
    const schedulingStore = this.schedulingStore;
    const session =
      schedulingStore.upcomingSessions.find(
        (s: Session) => s.id === sessionId,
      ) ||
      schedulingStore.previousSessions.find((s: Session) => s.id === sessionId);
    if (!session) return;
    if (!session.attendance) session.attendance = {};
    session.attendance[player] = !session.attendance[player];
  }
}
