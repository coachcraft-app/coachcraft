export default function schedulingStore(Alpine) {
  Alpine.store("scheduling", {
    // state
    sessionName: "", //name of the schedule
    sessionActivities: [], //array of activities dropped in
    listsList: Alpine.store("activities").listsList,
    activitiesList: Alpine.store("activities").activitiesList,
    previousSessions: [
      // EXAMPLE PREVIOUS sessions for Last/History tabs. just to show functionality
      { id: "s1", name: "Week 1 Warmup", activities: ["1", "4", "2"] },
      { id: "s2", name: "Practice session", activities: ["5", "3", "7"] },
    ],
    selectedTab: "lists", // which tab is currently shown

    // ----------------getters-------------

    get filteredActivities() {
      // return the selected list
      return Alpine.store("activities").selectedListActivities;
    },
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
  });
}
