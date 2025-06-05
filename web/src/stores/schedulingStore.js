export default function schedulingStore(Alpine) {
  Alpine.store("scheduling", {
    // state
    sessionName: "", //name of the schedule
    sessionDate: "", //date of the schedule
    sessionNotes: "", //notes for the schedule
    sessionActivities: [], //array of activities dropped in
    selectedTeam: null, //id of selected team
    listsList: Alpine.store("pages").activities.listsList,
    activitiesList: Alpine.store("pages").activities.activitiesList,
    upcomingSessions: [], // sessions that haven't been completed yet
    previousSessions: [
      // EXAMPLE PREVIOUS sessions for Last/History tabs. just to show functionality
      {
        id: "s1",
        name: "Week 1 Warmup",
        date: "2025-05-20",
        notes: "Focus on warmup exercises ",
        activities: ["1", "4", "2"],
      },
      {
        id: "s2",
        name: "Practice session",
        date: "2025-04-15",
        notes: "Regular practice",
        activities: ["5", "3", "7"],
      },
    ],
    selectedTab: "lists", // which tab is currently shown
    expandedSessions: {}, // shows which history sessions are expanded

    // ----------------getters-------------

    get lastSession() {
      // first item in previousSessions
      if (this.previousSessions[0]) {
        return this.previousSessions[0];
      } else {
        return { activities: [] };
      }
    },

    // ----------------METHODS---------------

    addToSession(activity) {
      // push a copy of the activity into sessionActivities
      if (!this.sessionActivities.find((a) => a.id === activity.id)) {
        this.sessionActivities.push({ ...activity });
      }
    },
    removeFromSession(index) {
      // remove by array index
      this.sessionActivities.splice(index, 1);
    },

    // Drag & Drop functionality
    handleDragStart(dragEvent, activity) {
      dragEvent.dataTransfer.setData("text/plain", activity.id);
      dragEvent.dataTransfer.effectAllowed = "copy";
    },
    handleDragOver(dragEvent) {
      dragEvent.preventDefault();
      dragEvent.dataTransfer.dropEffect = "copy";
    },
    handleDrop(dragEvent) {
      dragEvent.preventDefault();
      const id = dragEvent.dataTransfer.getData("text/plain");
      const act = this.activitiesList.find((a) => a.id === id);
      if (act) this.addToSession(act);
    },

    // switch tabs
    switchTab(tab) {
      this.selectedTab = tab;
    },

    // Toggle session details in history
    toggleSessionDetails(sessionId) {
      this.expandedSessions[sessionId] = !this.expandedSessions[sessionId];
    },

    // shows activities in the session
    loadSession(session) {
      if (!session || !session.activities) return;

      this.sessionName = session.name;
      this.sessionDate = session.date;
      this.sessionNotes = session.notes;
      this.selectedTeam = session.team;
      this.sessionActivities = [];

      session.activities.forEach((id) => {
        const activity = this.activitiesList.find((a) => a.id === id);
        if (activity) {
          this.addToSession(activity);
        }
      });
    },

    // Save current session to history
    saveSession(event) {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(event.target));

      if (!formData.sessionName || !this.sessionActivities.length) return;

      const newSession = {
        id: `s${this.upcomingSessions.length + this.previousSessions.length + 1}`,
        name: formData.sessionName,
        date: formData.sessionDate,
        notes: formData.sessionNotes,
        activities: this.sessionActivities.map((a) => a.id),
        team: this.selectedTeam,
        attendance: (() => {
          const team = Alpine.store("pages").teams.teamsList.find(
            (t) => t.id === this.selectedTeam,
          );
          if (!team) return {};
          const att = {};
          team.players.forEach((p) => (att[p] = true));
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

      // Reset the form element
      event.target.reset();
    },

    moveActivityUp(index) {
      if (index > 0) {
        const activity = this.sessionActivities[index];
        this.sessionActivities.splice(index, 1);
        this.sessionActivities.splice(index - 1, 0, activity);
      }
    },

    moveActivityDown(index) {
      if (index < this.sessionActivities.length - 1) {
        const activity = this.sessionActivities[index];
        this.sessionActivities.splice(index, 1);
        this.sessionActivities.splice(index + 1, 0, activity);
      }
    },
  });
}
