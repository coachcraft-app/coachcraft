/**
 * SessionsView class
 * Holds state and methods for managing sessions view
 * @class
 */

import type { Session } from "@/typeDefs/storeTypes";
import { Sync } from "@/libs/graphql/sync";

/**
 * SessionsView class
 * Holds state and methods for managing sessions view
 * Shows upcoming and previous sessions and their activities
 * @class
 */
export class SessionsView {
  /** List of upcoming sessions (date is more than Date.now()) */
  public upcomingSessions: Session[];
  /** List of previous sessions (date is less than Date.now()) */
  public previousSessions: Session[];

  /**
   * empty constructor for instantiation
   */
  public constructor(upcomingSessions: Session[], previousSessions: Session[]) {
    this.upcomingSessions = upcomingSessions;
    this.previousSessions = previousSessions;
  }

  /**
   * Event handler to mark a session as completed
   * @param sessionId Session ID to mark as completed
   */
  public completeSession(sessionId: string) {
    const sessionIndex = this.upcomingSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (sessionIndex === -1) return;

    const completedSession = this.upcomingSessions[sessionIndex];
    this.upcomingSessions.splice(sessionIndex, 1);
    this.previousSessions.unshift(completedSession);
  }

  /**
   * Event handler to update notes for a session
   * @param sessionId Session ID to update notes for
   * @param newNotes New notes content
   */
  public updateNotes(sessionId: string, newNotes: string) {
    // find in upcoming sessions
    const upcomingIndex = this.upcomingSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (upcomingIndex !== -1) {
      this.upcomingSessions[upcomingIndex].notes = newNotes;
      Sync.sessions.notes(this.upcomingSessions[upcomingIndex]);
      return;
    }

    // find in previous sessions
    const previousIndex = this.previousSessions.findIndex(
      (s: Session) => s.id === sessionId,
    );
    if (previousIndex !== -1) {
      this.previousSessions[previousIndex].notes = newNotes;
      Sync.sessions.notes(this.previousSessions[previousIndex]);
    }
  }

  /**
   * Event handler for toggling attendance for a player in a session
   * @param sessionId Session ID
   * @param player Player name
   */
  public toggleAttendance(sessionId: string, player: string) {
    const session =
      this.upcomingSessions.find((s: Session) => s.id === sessionId) ||
      this.previousSessions.find((s: Session) => s.id === sessionId);
    if (!session) return;
    if (!session.attendance) session.attendance = {};
    session.attendance[player] = !session.attendance[player];
  }
}
