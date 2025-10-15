import type { Session } from "@/typedefs/storeTypes";

export default class sessions {
  private upcomingSessions: Session[];
  private previousSessions: Session[];

  /**
   * empty constructor for instantiation
   */
  public constructor(upcomingSessions: Session[], previousSessions: Session[]) {
    this.upcomingSessions = upcomingSessions;
    this.previousSessions = previousSessions;
  }

  // mark session as complete
  public completeSession(sessionId: string) {
    const sessionIndex = this.upcomingSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (sessionIndex === -1) return;

    const completedSession = this.upcomingSessions[sessionIndex];
    this.upcomingSessions.splice(sessionIndex, 1);
    this.previousSessions.unshift(completedSession);
  }

  // Update session notes
  public updateNotes(sessionId: string, newNotes: string) {
    // find in upcoming sessions
    const upcomingIndex = this.upcomingSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (upcomingIndex !== -1) {
      this.upcomingSessions[upcomingIndex].notes = newNotes;
      return;
    }

    // find in previous sessions
    const previousIndex = this.previousSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (previousIndex !== -1) {
      this.previousSessions[previousIndex].notes = newNotes;
    }
  }

  public toggleAttendance(sessionId: string, player: string) {
    const session =
      this.upcomingSessions.find((s: Session) => s.id === sessionId) ||
      this.previousSessions.find((s: Session) => s.id === sessionId);
    if (!session) return;
    if (!session.attendance) session.attendance = {};
    session.attendance[player] = !session.attendance[player];
  }
}
