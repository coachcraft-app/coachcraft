export default function activitiesStore(Alpine) {
  Alpine.store("activities", {
    // state
    listsList: [
      {
        // Not dummy data, do not remove this default option
        id: "default",
        name: "All Activities",
        activities: [],
      },
      {
        id: "0",
        name: "Warm Up",
        activities: ["1", "2", "3", "4"],
      },
      {
        id: "1",
        name: "Dribbling Drills",
        activities: ["5", "6", "7", "8"],
      },
      {
        id: "2",
        name: "Assorted",
        activities: ["1", "5", "4", "7"],
      },
    ],

    activitiesList: [
      {
        id: "1",
        name: "Catch Me If You Can",
        duration: "00:30",
        description: "",
        notes: "",
        img_url: "",
      },
      {
        id: "2",
        name: "Circle Passing",
        duration: "00:45",
        description: "",
        notes: "",
        img_url: "",
      },
      {
        id: "3",
        name: "Dribbling Commands",
        duration: "00:30",
        description: "",
        notes: "",
        img_url: "",
      },
      {
        id: "4",
        name: "Dynamic Soccer Warm Up",
        duration: "01:00",
        description: "",
        notes: "",
        img_url: "",
      },
      {
        id: "5",
        name: "1-on-1 Gate Dribbling",
        duration: "01:00",
        description: "",
        notes: "",
        img_url: "",
      },
      {
        id: "6",
        name: "1-on-1-on-1 Dribbling",
        duration: "01:00",
        description: "",
        notes: "",
        img_url: "",
      },
      {
        id: "7",
        name: "Dribble Attack",
        duration: "01:00",
        description: "",
        notes: "",
        img_url: "",
      },
      {
        id: "8",
        name: "Dribble Knockout",
        duration: "01:00",
        description: "",
        notes: "",
        img_url: "",
      },
    ],
    selectedList: "default",
    selectedActivity: "",
    changesMade: false,
    changesSyncInProgress: false,

    get selectedListActivities() {
      if (this.selectedList === "default") {
        return this.activitiesList;
      }

      const selectedActivitiyIDs = this.listsList.find(
        (list) => list.id === this.selectedList,
      ).activities;

      return this.activitiesList.filter((activity) =>
        selectedActivitiyIDs.includes(activity.id),
      );
    },

    get selectedListName() {
      return this.listsList.find((list) => list.id === this.selectedList).name;
    },

    handleListSwitch(id) {
      this.selectedList = id;
    },

    addNewActivity() {},

    // fetch data from API
    async fetchData() {},
  });
}
