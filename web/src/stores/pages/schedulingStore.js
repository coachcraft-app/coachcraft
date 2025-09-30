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
      // EXAMPLE PREVIOUS sessions for Last/History tabs. Uses new full activity objects
      {
        id: "s1",
        name: "Week 1 Warmup",
        date: "2025-05-20",
        notes: "Focus on warmup exercises ",
        // Complete activity objects copied from templates - ensures session independence
        activities: [
          {
            id: "1_session_example_s1_1",
            name: "Catch Me If You Can",
            duration: "00:30",
            description:
              "Players pair up with one ball between them. The player without the ball starts running while the player with the ball counts to 3, then dribbles to try and catch their partner. Switch roles after each round. Focuses on acceleration, change of direction, and dribbling speed.",
            img_url: "",
            isSessionCopy: true,
            originalTemplateId: "1",
          },
          {
            id: "4_session_example_s1_2",
            name: "Dynamic Soccer Warm Up",
            duration: "01:00",
            description:
              "Progressive warm-up routine including jogging, high knees, butt kicks, side shuffles, karaoke steps, dynamic stretching, and light ball work. Set up in lanes 15-20 yards long. Ensure all major muscle groups are activated. Finish with short passing sequences to transition into technical work.",
            img_url: "",
            isSessionCopy: true,
            originalTemplateId: "4",
          },
          {
            id: "2_session_example_s1_3",
            name: "Circle Passing",
            duration: "00:45",
            description:
              "Players form a circle with 1-2 players in the middle. Outer players pass the ball around while inside players try to intercept. If successful, the player who lost the ball switches to the middle. Focus on quick, accurate passing and communication. Increase difficulty by adding a second ball.",
            img_url: "",
            isSessionCopy: true,
            originalTemplateId: "2",
          },
        ],
      },
      {
        id: "s2",
        name: "Practice session",
        date: "2025-04-15",
        notes: "Regular practice",
        // Complete activity objects copied from templates - ensures session independence
        activities: [
          {
            id: "5_session_example_s2_1",
            name: "1-on-1 Gate Dribbling",
            duration: "01:00",
            description:
              "Set up multiple 'gates' (two cones 1-2 yards apart) throughout the playing area. Players pair up, with one attacker and one defender. Attackers score by dribbling through as many gates as possible in 60 seconds while defenders try to win the ball. Switch roles and compare scores. Develops close control and shielding.",
            img_url: "",
            isSessionCopy: true,
            originalTemplateId: "5",
          },
          {
            id: "3_session_example_s2_2",
            name: "Dribbling Commands",
            duration: "00:30",
            description:
              "Players dribble freely in a marked area. Coach calls out commands like 'stop', 'change direction', 'use left foot only', 'outside of foot only', etc. Players must immediately respond while maintaining ball control. Great for developing listening skills and technical ability under pressure.",
            img_url: "",
            isSessionCopy: true,
            originalTemplateId: "3",
          },
          {
            id: "7_session_example_s2_3",
            name: "Dribble Attack",
            duration: "01:00",
            description:
              "Create a 30x20 yard grid with goals at each end. Divide players into attackers and defenders. Attackers start with the ball and must dribble past defenders to score in the opposite goal. Defenders can only win the ball in their defensive half. If successful, they transition to attack. Emphasizes 1v1 attacking moves and finishing.",
            img_url: "",
            isSessionCopy: true,
            originalTemplateId: "7",
          },
        ],
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
        id: `${activity.id}_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        // Mark this as a session copy to differentiate from original
        isSessionCopy: true,
      }));

      const newSession = {
        id: `s${this.upcomingSessions.length + this.previousSessions.length + 1}`,
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
  });
}
