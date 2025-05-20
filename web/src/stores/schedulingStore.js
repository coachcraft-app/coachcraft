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
  });
}
