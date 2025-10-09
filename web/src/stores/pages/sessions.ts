export default function sessionsStore(Alpine) {
  Alpine.store("sessions", {
    // mark session as complete
    completeSession(sessionId) {
      const schedulingStore = Alpine.store("scheduling");
      const sessionIndex = schedulingStore.upcomingSessions.findIndex(
        (s) => s.id === sessionId,
      );
      if (sessionIndex === -1) return;

      const completedSession = schedulingStore.upcomingSessions[sessionIndex];
      schedulingStore.upcomingSessions.splice(sessionIndex, 1);
      schedulingStore.previousSessions.unshift(completedSession);
    },

    // Update session notes
    updateNotes(sessionId, newNotes) {
      const schedulingStore = Alpine.store("scheduling");

      // find in upcoming sessions
      const upcomingIndex = schedulingStore.upcomingSessions.findIndex(
        (s) => s.id === sessionId,
      );
      if (upcomingIndex !== -1) {
        schedulingStore.upcomingSessions[upcomingIndex].notes = newNotes;
        return;
      }

      // find in previous sessions
      const previousIndex = schedulingStore.previousSessions.findIndex(
        (s) => s.id === sessionId,
      );
      if (previousIndex !== -1) {
        schedulingStore.previousSessions[previousIndex].notes = newNotes;
      }
    },

    toggleAttendance(sessionId, player) {
      const schedulingStore = Alpine.store("scheduling");
      let session =
        schedulingStore.upcomingSessions.find((s) => s.id === sessionId) ||
        schedulingStore.previousSessions.find((s) => s.id === sessionId);
      if (!session) return;
      if (!session.attendance) session.attendance = {};
      session.attendance[player] = !session.attendance[player];
    },
  });
}
