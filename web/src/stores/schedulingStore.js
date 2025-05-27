export default function schedulingStore(Alpine) {
  Alpine.store("scheduling", {
    // state
    sessionName: "", //name of the schedule
    sessionDate: "", //date of the schedule
    sessionNotes: "", //notes for the schedule
    sessionActivities: [], //array of activities dropped in
    listsList: Alpine.store("pages").activities.listsList,
    activitiesList: Alpine.store("pages").activities.activitiesList,
    previousSessions: [
      // EXAMPLE PREVIOUS sessions for Last/History tabs. just to show functionality
      {
        id: "s1",
        name: "Week 1 Warmup",
        date: "2024-03-20",
        notes: "Focus on warmup exercises",
        activities: ["1", "4", "2"],
      },
      {
        id: "s2",
        name: "Practice session",
        date: "2024-03-21",
        notes: "Regular practice",
        activities: ["5", "3", "7"],
      },
    ],
    selectedTab: "lists", // which tab is currently shown

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

    // shows activities in the session
    loadSession(session) {
      this.sessionActivities = session.activities
        .map((id) => this.activitiesList.find((a) => a.id === id))
        .filter(Boolean);
    },

    // Save current session to history
    saveSession() {
      if (!this.sessionName || !this.sessionActivities.length) return;

      const newSession = {
        id: `s${Date.now()}`,
        name: this.sessionName,
        date: this.sessionDate,
        notes: this.sessionNotes,
        activities: this.sessionActivities.map((a) => a.id),
      };

      this.previousSessions.unshift(newSession);
      this.sessionName = "";
      this.sessionDate = "";
      this.sessionNotes = "";
      this.sessionActivities = [];
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
