import sync from "../../utils/sync";
import type {
  Activity,
  ActivitiesList,
  ActivitiesListAccentColors,
} from "../../typeDefs/storeTypes";

export default class activities {
  // state
  public listsList: ActivitiesList[] = [];

  public activitiesList: Activity[] = [];

  public listAccentColors: ActivitiesListAccentColors[] = [];

  private selectedList: string = "default";
  private selectedActivity: string = "";
  private rightPanelState: "placeholder" | "edit_activity" | "manage_lists" =
    "placeholder";

  private manageListsSelectedList: string = "default";

  /**
   * empty constructor for instantiation
   */
  public constructor() {}

  public get selectedListActivities() {
    if (this.selectedList == "default") {
      return this.activitiesList;
    }

    const selectedActivitiyIDs = this.listsList.find(
      (list) => list.id == this.selectedList,
    )?.activities;

    if (!selectedActivitiyIDs) {
      return [];
    }

    return this.activitiesList.filter((activity) =>
      selectedActivitiyIDs.includes(activity.id),
    );
  }
  public get selectedActivityObj() {
    return this.activitiesList.find(
      (activity) => activity.id == this.selectedActivity,
    );
  }
  public get listsNames() {
    const listsNames: string[] = [];
    this.listsList.forEach((list) => listsNames.push(list.name));
    return listsNames;
  }
  public get listAccentColorNames() {
    const listAccentColors: string[] = [];
    this.listAccentColors.forEach((color) => listAccentColors.push(color.name));
    return listAccentColors;
  }
  public get manageListsSelectedListObj() {
    return this.listsList.find(
      (list) => list.id == this.manageListsSelectedList,
    );
  }
  public get containingListsNames() {
    // get all lists that this.selectedActivity belongs to

    const containingLists: string[] = [];
    this.listsList.forEach((list) => {
      if (list.activities.includes(this.selectedActivity)) {
        containingLists.push(list.name);
      }
    });
    return containingLists;
  }

  public onListSwitch(listToSelect: string) {
    if (listToSelect == "All Activities") {
      this.selectedList = "default";
    } else {
      this.selectedList =
        this.listsList.find((list) => list.name == listToSelect)?.id ||
        "default";
    }
    this.selectedActivity = "";
    this.rightPanelState = "placeholder";
  }
  public onActivitySelection(id: string) {
    // if the activity is already selected, just deselect it
    if (this.selectedActivity == id) {
      this.selectedActivity = "";
      this.rightPanelState = "placeholder";
    } else {
      this.selectedActivity = id;
      this.rightPanelState = "edit_activity";
    }
  }
  public onContainingListsUpdate(containingList: string[]) {
    // update the lists to which this.selectedActivity belongs

    this.listsList.forEach((list: ActivitiesList) => {
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
      sync.activities.list.put(list);
    });
  }
  public onSaveChanges(event: Event) {
    event.preventDefault();
    const activityData = Object.fromEntries(
      new FormData(event.target as HTMLFormElement),
    );
    this.saveActivity(activityData);
  }
  public onResetChanges() {
    // store current selection
    const currentSelection = this.selectedActivity;

    // clear selection and re-select
    this.selectedActivity = "";
    this.selectedActivity = currentSelection;
  }
  public onDeleteActivity() {
    this.activitiesList = this.activitiesList.filter(
      (activity) => activity.id != this.selectedActivity,
    );

    this.listsList.forEach((list) => {
      list.activities.filter(
        (activity_id) => activity_id != this.selectedActivity,
      );
    });

    // Sync to backend
    sync.activities.activity.delete(Number(this.selectedActivity));

    // Cleanup
    this.selectedActivity = "";
    this.rightPanelState = "placeholder";
  }
  public onManageLists() {
    if (this.rightPanelState != "manage_lists") {
      this.selectedActivity = "";
      this.rightPanelState = "manage_lists";
    } else {
      this.rightPanelState = "placeholder";
    }
  }
  public onManageListsListSwitch(listToSelect: string) {
    this.manageListsSelectedList =
      this.listsList.find((list) => list.name == listToSelect)?.id || "default";
  }
  public onManageListsSaveChanges(event: Event) {
    event.preventDefault();
    const listData = Object.fromEntries(
      new FormData(event.target as HTMLFormElement),
    );

    if (
      this.manageListsSelectedList != "new" &&
      this.manageListsSelectedList != "default"
    ) {
      // update existing list
      const listToUpdate = this.listsList.find(
        (list) => list.id == this.manageListsSelectedList,
      );
      if (listToUpdate) {
        listToUpdate.name = listData.listName as string;
        // TODO: save list accent color
        // sync with backend
        sync.activities.list.put(listToUpdate);
      }
    } else {
      // save new list
      const newList: ActivitiesList = {
        id: Date.now().toString(), // TODO: update to assign ID provided by backend
        name: listData.listName as string,
        activities: [],
        accent_color: "Colors", // TODO: grab accent color
      };

      this.listsList.shift(); // remove newListTemplate
      this.listsList.unshift(newList); // add the new list to the top
      sync.activities.list.post(newList);
    }
  }
  public onCreateNewList() {
    const newListTemplate: ActivitiesList = {
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
  }
  public onDeleteList() {
    if (this.manageListsSelectedList != "default") {
      this.listsList = this.listsList.filter(
        (list) => list.id != this.manageListsSelectedList,
      );

      sync.activities.list.delete(this.manageListsSelectedList);
    }
  }

  public saveActivity(activityData: { [k: string]: FormDataEntryValue }) {
    if (this.selectedActivity != "new") {
      // update an existing activity

      const activityToUpdate = this.activitiesList.find(
        (activity) => activity.id == this.selectedActivity,
      );

      if (activityToUpdate) {
        activityToUpdate.name = activityData.activityName as string;
        activityToUpdate.duration = activityData.duration as string;
        activityToUpdate.description = activityData.description as string;

        // Sync to backend
        sync.activities.activity.put(activityToUpdate);
      }
    } else {
      // save as new activtiy

      const activity: Activity = {
        id: Date.now().toString(), // TODO: update to assign ID provided by backend
        name: activityData.activityName as string,
        duration: activityData.duration as string,
        description: (activityData.description as string) || "",
        img_url: "",
      };

      this.activitiesList.shift(); // remove default new activity template
      this.activitiesList.unshift(activity); // insert new activity obj

      // add to currently selected list, unless "All Activities" is selected
      if (this.selectedList !== "default") {
        this.listsList
          .find((list) => list.id == this.selectedList)
          ?.activities.unshift(activity.id);
      }

      this.selectedActivity = activity.id;
      sync.activities.activity.post(activity);
    }
  }
  public createActivity() {
    const newActivityTemplate: Activity = {
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
      if (containingList) {
        containingList.activities = containingList.activities.filter(
          (id) => id != newActivityTemplate.id,
        );
      }
    }

    // assign new activity draft to currently selected list
    this.listsList
      .find((list) => list.id == this.selectedList)
      ?.activities.push(newActivityTemplate.id);

    this.selectedActivity = newActivityTemplate.id;
    this.rightPanelState = "edit_activity";
  }
}
