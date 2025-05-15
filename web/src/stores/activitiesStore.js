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
        description:
          "Players pair up with one ball between them. The player without the ball starts running while the player with the ball counts to 3, then dribbles to try and catch their partner. Switch roles after each round. Focuses on acceleration, change of direction, and dribbling speed.",
        img_url: "",
      },
      {
        id: "2",
        name: "Circle Passing",
        duration: "00:45",
        description:
          "Players form a circle with 1-2 players in the middle. Outer players pass the ball around while inside players try to intercept. If successful, the player who lost the ball switches to the middle. Focus on quick, accurate passing and communication. Increase difficulty by adding a second ball.",
        img_url: "",
      },
      {
        id: "3",
        name: "Dribbling Commands",
        duration: "00:30",
        description:
          "Players dribble freely in a marked area. Coach calls out commands like 'stop', 'change direction', 'use left foot only', 'outside of foot only', etc. Players must immediately respond while maintaining ball control. Great for developing listening skills and technical ability under pressure.",
        img_url: "",
      },
      {
        id: "4",
        name: "Dynamic Soccer Warm Up",
        duration: "01:00",
        description:
          "Progressive warm-up routine including jogging, high knees, butt kicks, side shuffles, karaoke steps, dynamic stretching, and light ball work. Set up in lanes 15-20 yards long. Ensure all major muscle groups are activated. Finish with short passing sequences to transition into technical work.",
        img_url: "",
      },
      {
        id: "5",
        name: "1-on-1 Gate Dribbling",
        duration: "01:00",
        description:
          "Set up multiple 'gates' (two cones 1-2 yards apart) throughout the playing area. Players pair up, with one attacker and one defender. Attackers score by dribbling through as many gates as possible in 60 seconds while defenders try to win the ball. Switch roles and compare scores. Develops close control and shielding.",
        img_url: "",
      },
      {
        id: "6",
        name: "1-on-1-on-1 Dribbling",
        duration: "01:00",
        description:
          "Three players work in a triangle formation with one ball. The player with the ball attempts to dribble toward either of the other two players, who defend. If a defender wins the ball, they become the attacker. Play in a confined space to increase difficulty. Focuses on quick decision-making and protecting the ball.",
        img_url: "",
      },
      {
        id: "7",
        name: "Dribble Attack",
        duration: "01:00",
        description:
          "Create a 30x20 yard grid with goals at each end. Divide players into attackers and defenders. Attackers start with the ball and must dribble past defenders to score in the opposite goal. Defenders can only win the ball in their defensive half. If successful, they transition to attack. Emphasizes 1v1 attacking moves and finishing.",
        img_url: "",
      },
      {
        id: "8",
        name: "Dribble Knockout",
        duration: "01:00",
        description:
          "All players dribble within a defined area while trying to knock other players' balls out of bounds. If your ball goes out, you perform a quick fitness activity (5 push-ups, 10 jumping jacks) before rejoining. Last player remaining wins. Gradually reduce the playing area to increase difficulty. Builds ball control under pressure.",
        img_url: "",
      },
    ],
    selectedList: "default",
    selectedActivity: "",
    changesMade: false,
    changesSyncInProgress: false,

    newActivity: {
      id: "new",
      name: "New Activity",
      duration: "",
      description: "",
      img_url: "",
    },

    get selectedListActivities() {
      if (this.selectedList == "default") {
        return this.activitiesList;
      }

      const selectedActivitiyIDs = this.listsList.find(
        (list) => list.id == this.selectedList,
      ).activities;

      return this.activitiesList.filter((activity) =>
        selectedActivitiyIDs.includes(activity.id),
      );
    },
    get selectedListName() {
      return this.listsList.find((list) => list.id == this.selectedList).name;
    },
    get selectedActivityObj() {
      return this.activitiesList.find(
        (activity) => activity.id == this.selectedActivity,
      );
    },

    handleListSwitch(id) {
      this.selectedList = id;
      this.selectedActivity = "";
    },
    handleActivitySelection(id) {
      this.selectedActivity = id;
    },
    handleSaveChanges(event) {
      event.preventDefault();
      const activityData = Object.fromEntries(new FormData(event.target));
      console.log("Activity data to save:", activityData);
      this.saveActivity(activityData);
    },
    handleResetChanges() {}, //TODO
    handleDeleteActivity() {
      this.activitiesList = this.activitiesList.filter(
        (activity) => activity.id != this.selectedActivity,
      );

      this.listsList.array.forEach((list) => {
        list.activities.filter(
          (activity_id) => activity_id != this.selectedActivity,
        );
      });

      this.selectedActivity = "";
    },

    saveActivity(activityData) {
      // if updating an existing activity
      if (this.selectedActivity != "new") {
        const activityToUpdate = this.activitiesList.find(
          (activity) => activity.id == this.selectedActivity,
        );

        activityToUpdate.name = activityData.activityName;
        activityToUpdate.duration = activityData.duration;
        activityToUpdate.description = activityData.description;
      } else {
        // create new activtiy
        const newActivity = {
          id: Date.now().toString(), // temporary unique ID
          name: activityData.activityName,
          duration: activityData.duration,
          description: activityData.description || "",
          img_url: "",
        };

        this.activitiesList.shift(); // remove default new activity template
        this.activitiesList.unshift(newActivity); // insert new activity obj

        // add to currently selected list, unless "All Activities" is selected
        if (this.selectedList !== "default") {
          const list = this.listsList
            .find((list) => list.id === this.selectedList)
            .activities.unshift(newActivity.id);
        }

        this.selectedActivity = newActivity.id;
        console.log("New activity created:", newActivity);
      }
    },
    isActivitySelected(id) {
      return this.selectedActivity == id;
    },
    addNewActivity() {
      // only create a new activity if a draft does not already exist
      if (
        !this.activitiesList.find(
          (activity) => activity.id == this.newActivity.id,
        )
      ) {
        this.activitiesList.unshift(this.newActivity);

        this.listsList
          .find((list) => list.id == this.selectedList)
          .activities.push(this.newActivity.id);

        this.selectedActivity = this.newActivity.id;
      } else {
        // if draft new activity exists, redirect to it
        this.handleListSwitch(
          this.listsList.find((list) =>
            list.activities.includes(this.newActivity.id),
          ).id,
        );
        this.handleActivitySelection(this.newActivity.id);
      }
    },

    // fetch data from API
    async fetchData() {},
  });
}
