export default function activitiesStore(Alpine) {
  Alpine.store("pages").activities = {
    // state
    activitiesList: [],
    listsList: [],
    listAccentColors: [],

    selectedList: "default",
    selectedActivity: "",
    rightPanelState: "placeholder", // "placeholder" || "edit_activity" || "manage_lists"

    manageListsSelectedList: "default",

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
    get selectedActivityObj() {
      return this.activitiesList.find(
        (activity) => activity.id == this.selectedActivity,
      );
    },
    get listsNames() {
      var listsNames = [];
      this.listsList.forEach((list) => listsNames.push(list.name));
      return listsNames;
    },
    get listAccentColorNames() {
      var listAccentColors = [];
      this.listAccentColors.forEach((color) =>
        listAccentColors.push(color.name),
      );
      return listAccentColors;
    },
    get manageListsSelectedListObj() {
      return this.listsList.find(
        (list) => list.id == this.manageListsSelectedList,
      );
    },
    get containingListsNames() {
      // get all lists that this.selectedActivity belongs to

      var containingLists = [];
      this.listsList.forEach((list) => {
        if (list.activities.includes(this.selectedActivity)) {
          containingLists.push(list.name);
        }
      });
      return containingLists;
    },

    onListSwitch(listToSelect) {
      if (listToSelect == "All Activities") {
        this.selectedList = "default";
      } else {
        this.selectedList = this.listsList.find(
          (list) => list.name == listToSelect,
        ).id;
      }
      this.selectedActivity = "";
      this.rightPanelState = "placeholder";
    },
    onActivitySelection(id) {
      // if the activity is already selected, just deselect it
      if (this.selectedActivity == id) {
        this.selectedActivity = "";
        this.rightPanelState = "placeholder";
      } else {
        this.selectedActivity = id;
        this.rightPanelState = "edit_activity";
      }
    },
    onContainingListsUpdate(containingList) {
      // update the lists to which this.selectedActivity belongs

      this.listsList.forEach((list) => {
        if (containingList.includes(list.name)) {
          if (!list.activities.includes(this.selectedActivity)) {
            list.activities.push(this.selectedActivity);
          }
        } else {
          // to account for any instances of
          // this.selectedActivity being detached from any lists
          list.activities = list.activities.filter(
            (activityId) => activityId != this.selectedActivity,
          );
        }
        // Alpine.store("sync").putList(list);
      });
    },
    onSaveChanges(event) {
      event.preventDefault();
      const activityData = Object.fromEntries(new FormData(event.target));
      this.saveActivity(activityData);
    },
    onResetChanges() {
      // store current selection
      const currentSelection = this.selectedActivity;

      // clear selection and re-select
      this.selectedActivity = "";
      this.selectedActivity = currentSelection;
    },
    onDeleteActivity() {
      this.activitiesList = this.activitiesList.filter(
        (activity) => activity.id != this.selectedActivity,
      );

      this.listsList.forEach((list) => {
        list.activities.filter(
          (activity_id) => activity_id != this.selectedActivity,
        );
      });

      // Sync to backend
      // Alpine.store("sync").deleteActivity(this.selectedActivity);

      // Cleanup
      this.selectedActivity = "";
      this.rightPanelState = "placeholder";
    },
    onManageLists() {
      if (this.rightPanelState != "manage_lists") {
        this.selectedActivity = "";
        this.rightPanelState = "manage_lists";
      } else {
        this.rightPanelState = "placeholder";
      }
    },
    onManageListsListSwitch(listToSelect) {
      this.manageListsSelectedList = this.listsList.find(
        (list) => list.name == listToSelect,
      ).id;
    },
    onManageListsSaveChanges(event) {
      event.preventDefault();
      const listData = Object.fromEntries(new FormData(event.target));

      if (
        this.manageListsSelectedList != "new" &&
        this.manageListsSelectedList != "default"
      ) {
        // update existing list
        const listToUpdate = this.listsList.find(
          (list) => list.id == this.manageListsSelectedList,
        );
        listToUpdate.name = listData.listName;
        // TODO: save list accent color
        // sync with backend
        // Alpine.store("sync").putList(listToUpdate);
      } else {
        // save new list
        const newList = {
          id: Date.now().toString(), // TODO: update to assign ID provided by backend
          name: listData.listName,
          activities: [],
          accent_color: "Colors", // TODO: grab accent color
        };

        this.listsList.shift(); // remove newListTemplate
        this.listsList.unshift(newList); // add the new list to the top
        // Alpine.store("sync").postList(newList);
      }
    },
    onCreateNewList() {
      const newListTemplate = {
        id: "new",
        name: "New List",
        activities: [],
        accent_color: "Colors",
      };

      if (!this.listsList.find((list) => list.id == newListTemplate.id)) {
        // proceed only if new list draft doesn't already exist
        this.listsList.unshift(newListTemplate);
        this.manageListsSelectedList = "new";
      }
    },
    onDeleteList() {
      if (this.manageListsSelectedList != "default") {
        this.listsList = this.listsList.filter(
          (list) => list.id != this.manageListsSelectedList,
        );

        // Alpine.store("sync").deleteList(this.manageListsSelectedList);
      }
    },

    saveActivity(activityData) {
      if (this.selectedActivity != "new") {
        // update an existing activity

        const activityToUpdate = this.activitiesList.find(
          (activity) => activity.id == this.selectedActivity,
        );

        activityToUpdate.name = activityData.activityName;
        activityToUpdate.duration = activityData.duration;
        activityToUpdate.description = activityData.description;

        // Sync to backend
        // Alpine.store("sync").putActivity(activityToUpdate);
      } else {
        // save as new activtiy

        const activity = {
          id: Date.now().toString(), // TODO: update to assign ID provided by backend
          name: activityData.activityName,
          duration: activityData.duration,
          description: activityData.description || "",
          img_url: "",
        };

        this.activitiesList.shift(); // remove default new activity template
        this.activitiesList.unshift(activity); // insert new activity obj

        // add to currently selected list, unless "All Activities" is selected
        if (this.selectedList !== "default") {
          this.listsList
            .find((list) => list.id == this.selectedList)
            .activities.unshift(activity.id);
        }

        this.selectedActivity = activity.id;
        // Alpine.store("sync").postActivity(activity);
      }
    },
    createActivity() {
      const newActivityTemplate = {
        id: "new",
        name: "New Activity",
        duration: "",
        description: "",
        img_url: "",
      };

      if (
        !this.activitiesList.find(
          (activity) => activity.id == newActivityTemplate.id,
        )
      ) {
        // if no new activity draft is already present
        this.activitiesList.unshift(newActivityTemplate);
      } else {
        // if a new activity draft exists in another list,
        // detach it and create a new one
        const containingList = this.listsList.find((list) =>
          list.activities.includes(newActivityTemplate.id),
        );
        containingList.activities = containingList.activities.filter(
          (id) => id != newActivityTemplate.id,
        );
      }

      // assign new activity draft to currently selected list
      this.listsList
        .find((list) => list.id == this.selectedList)
        .activities.push(newActivityTemplate.id);

      this.selectedActivity = newActivityTemplate.id;
      this.rightPanelState = "edit_activity";
    },

    // fetch data from API
    async fetchData() {},
  };
}
