export default function schedulingStore(Alpine) {
  Alpine.store("pages").scheduling = {
    // state
    sessionName: "", //name of the schedule
    sessionDate: "", //date of the schedule
    sessionNotes: "", //notes for the schedule
    sessionActivities: [], //array of activities dropped in
    selectedTeam: null, //id of selected team
    listsList: Alpine.store("pages").activities.listsList,
    activitiesList: Alpine.store("pages").activities.activitiesList,
    upcomingSessions: [], // sessions that haven't been completed yet
    previousSessions: [],
    selectedTab: "lists", // which tab is currently shown
    expandedSessions: [], // shows which history sessions are expanded

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
      // Push a copy of the activity into sessionActivities to avoid referencing the original template
      // any changes to original activity template should noyt affect existing sessions
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

    // Load activities from a session into the current session beingmade
    // All sessions store activity objects so they can be directly used
    loadSession(session) {
      if (!session || !session.activities) return;

      this.sessionActivities = [];

      // Each activity in the session is complete object so can add directly
      session.activities.forEach((activity) => {
        if (activity) {
          // Add a copy of the session activity so editing the loaded activities won't affect the original session
          this.addToSession(activity);
        }
      });
    },

    // Save current session to history
    saveSession(event) {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(event.target));

      if (!formData.sessionName || !this.sessionActivities.length) return;

      // Create copy of activities from original templates
      const activityCopies = this.sessionActivities.map((activity) => ({
        ...activity,
        // Create ID for the copied activity so it differes from original
        id: `${activity.id}_session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      }));

      const newSession = {
        id: `s${
          this.upcomingSessions.length + this.previousSessions.length + 1
        }`,
        name: formData.sessionName,
        date: formData.sessionDate,
        notes: formData.sessionNotes,
        // Store the activity objects instead ofID
        activities: activityCopies,
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

    // Delete a session by ID
    deleteSession(sessionId) {
      // Try to remove from upcomingSessions
      let idx = this.upcomingSessions.findIndex((s) => s.id === sessionId);
      if (idx !== -1) {
        this.upcomingSessions.splice(idx, 1);
        return;
      }
      // Try to remove from previousSessions
      idx = this.previousSessions.findIndex((s) => s.id === sessionId);
      if (idx !== -1) {
        this.previousSessions.splice(idx, 1);
      }
    },
  };
}
