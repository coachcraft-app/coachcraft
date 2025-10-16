/**
 * Activities View
 * Manages state for the Activities view
 */

import type {
  Activity,
  ActivitiesList,
  ActivitiesListAccentColors,
} from "@/typeDefs/storeTypes";

import { Sync } from "@/libs/graphql/sync";

/**
 * Activities View class to manage state for the Activities view
 * Handles activities and activity lists
 * Has event handlers for user interactions
 * @class
 */
export class ActivitiesView {
  // public state
  public activitiesListsList: ActivitiesList[] = [];
  public activitiesList: Activity[] = [];
  public activitiesListAccentColors: ActivitiesListAccentColors[] = [];

  private selectedList: string = "default";
  private selectedActivity: string = "";
  private rightPanelState: "placeholder" | "edit_activity" | "manage_lists" =
    "placeholder";
  private manageListsSelectedList: string = "default";

  /**
   * empty constructor for instantiation
   */
  public constructor() {}

  /**
   * Returns the list of activities for the currently selected list
   * or all activities if "All Activities" is selected
   * @returns {Activity[]} The list of activities for the selected list
   */
  public get selectedListActivities() {
    if (this.selectedList == "default") {
      return this.activitiesList;
    }

    const selectedActivitiyIDs = this.activitiesListsList.find(
      (list) => list.id == this.selectedList,
    )?.activities;

    if (!selectedActivitiyIDs) {
      return [];
    }

    return this.activitiesList.filter((activity) =>
      selectedActivitiyIDs.includes(activity.id),
    );
  }

  /**
   * Returns the currently selected activity object
   * or undefined if no activity is selected
   * @returns {Activity | undefined} The selected activity object
   */
  public get selectedActivityObj() {
    return this.activitiesList.find(
      (activity) => activity.id == this.selectedActivity,
    );
  }

  /**
   * Returns an array of names of all activity lists
   * @returns {string[]} The names of all activity lists
   */
  public get listsNames() {
    const listsNames: string[] = [];
    this.activitiesList.forEach((list) => listsNames.push(list.name));
    return listsNames;
  }

  /**
   * Returns an array of names of all available accent colors for activity lists
   * @returns {string[]} The names of all available accent colors for activity lists
   */
  public get listAccentColorNames() {
    const listAccentColors: string[] = [];
    this.activitiesListAccentColors.forEach((color) =>
      listAccentColors.push(color.name),
    );
    return listAccentColors;
  }

  /**
   * Returns the currently selected list object in the Manage Lists panel
   * or undefined if no list is selected
   * @returns {ActivitiesList | undefined} The selected list object
   */
  public get manageListsSelectedListObj() {
    return this.activitiesListsList.find(
      (list) => list.id == this.manageListsSelectedList,
    );
  }

  /**
   * Returns an array of names of all lists containing the currently selected activity
   * @returns {string[]} The names of all lists containing the selected activity
   */
  public get containingListsNames() {
    // get all lists that this.selectedActivity belongs to

    const containingLists: string[] = [];
    this.activitiesListsList.forEach((list) => {
      if (list.activities.includes(this.selectedActivity)) {
        containingLists.push(list.name);
      }
    });
    return containingLists;
  }

  /**
   * Event handler for switching between activity lists
   * @param listToSelect The name of the list to select
   */
  public onListSwitch(listToSelect: string) {
    if (listToSelect == "All Activities") {
      this.selectedList = "default";
    } else {
      this.selectedList =
        this.activitiesListsList.find((list) => list.name == listToSelect)
          ?.id || "default";
    }
    this.selectedActivity = "";
    this.rightPanelState = "placeholder";
  }

  /**
   * Event handler for selecting/deselecting an activity
   * @remarks
   * If the activity is already selected, it will be deselected
   * and the right panel will switch to the placeholder state
   * If a new activity is selected, the right panel will switch to the edit_activity state
   * @param id The id of the activity to select
   */
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

  /**
   * Event handler for updating which lists holds the currently selected activity
   * @param containingList The names of the lists to which the selected activity should belong
   */
  public onContainingListsUpdate(containingList: string[]) {
    // update the lists to which this.selectedActivity belongs

    this.activitiesListsList.forEach((list: ActivitiesList) => {
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
      Sync.activities.list.put(list);
    });
  }

  /**
   * Event handler for saving changes to an activity
   * @param event The form submission event
   */
  public onSaveChanges(event: Event) {
    event.preventDefault();
    const activityData = Object.fromEntries(
      new FormData(event.target as HTMLFormElement),
    );
    this.saveActivity(activityData);
  }

  /**
   * Event handler for resetting changes to an activity
   * re-selects the currently selected activity to reset any unsaved changes
   */
  public onResetChanges() {
    // store current selection
    const currentSelection = this.selectedActivity;

    // clear selection and re-select
    this.selectedActivity = "";
    this.selectedActivity = currentSelection;
  }

  /**
   * Event handler for deleting the currently selected activity
   * removes the activity from all lists and syncs with the backend
   * @remarks
   * After deletion, clears the selected activity and switches to the placeholder state
   */
  public onDeleteActivity() {
    this.activitiesList = this.activitiesList.filter(
      (activity) => activity.id != this.selectedActivity,
    );

    this.activitiesListsList.forEach((list) => {
      list.activities.filter(
        (activity_id) => activity_id != this.selectedActivity,
      );
    });

    // Sync to backend
    Sync.activities.activity.delete(Number(this.selectedActivity));

    // Cleanup
    this.selectedActivity = "";
    this.rightPanelState = "placeholder";
  }

  /**
   * Event handler for toggling the Manage Lists panel
   * @remarks
   * If the panel is being opened, clears any selected activity
   * If the panel is being closed, switches to the placeholder state
   */
  public onManageLists() {
    if (this.rightPanelState != "manage_lists") {
      this.selectedActivity = "";
      this.rightPanelState = "manage_lists";
    } else {
      this.rightPanelState = "placeholder";
    }
  }

  /**
   * Event handler for switching between lists in the Manage Lists panel
   * @param listToSelect The name of the list to select
   */
  public onManageListsListSwitch(listToSelect: string) {
    this.manageListsSelectedList =
      this.activitiesListsList.find((list) => list.name == listToSelect)?.id ||
      "default";
  }

  /**
   * Event handler for saving changes to a list in the Manage Lists panel
   * @param event The form submission event
   * @remarks
   * If an existing list is being edited, updates the list name and syncs with the backend
   * If a new list is being created, adds the new list to the top of the lists array and syncs with the backend
   */
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
      const listToUpdate = this.activitiesListsList.find(
        (list) => list.id == this.manageListsSelectedList,
      );
      if (listToUpdate) {
        listToUpdate.name = listData.listName as string;
        // TODO: save list accent color
        // sync with backend
        Sync.activities.list.put(listToUpdate);
      }
    } else {
      // save new list
      const newList: ActivitiesList = {
        id: Date.now().toString(), // TODO: update to assign ID provided by backend
        name: listData.listName as string,
        activities: [],
        accent_color: "Colors", // TODO: grab accent color
      };

      this.activitiesListsList.shift(); // remove newListTemplate
      this.activitiesListsList.unshift(newList); // add the new list to the top
      Sync.activities.list.post(newList);
    }
  }

  /**
   * Event handler for creating a new list in the Manage Lists panel
   * @remarks
   * Adds a new list draft to the top of the lists array and selects it
   * If a new list draft already exists, does nothing
   */
  public onCreateNewList() {
    const newListTemplate: ActivitiesList = {
      id: "new",
      name: "New List",
      activities: [],
      accent_color: "Colors",
    };

    if (
      !this.activitiesListsList.find((list) => list.id == newListTemplate.id)
    ) {
      // proceed only if new list draft doesn't already exist
      this.activitiesListsList.unshift(newListTemplate);
      this.manageListsSelectedList = "new";
    }
  }

  /**
   * Event handler for deleting a list in the Manage Lists panel
   * @remarks
   * Removes the selected list from the lists array and syncs with the backend
   * Does nothing if the default list is selected
   */
  public onDeleteList() {
    if (this.manageListsSelectedList != "default") {
      this.activitiesListsList = this.activitiesListsList.filter(
        (list) => list.id != this.manageListsSelectedList,
      );

      Sync.activities.list.delete(this.manageListsSelectedList);
    }
  }

  /**
   * Saves changes to an activity, either updating an existing activity or creating a new one
   * @param activityData The data of the activity to save
   * @remarks
   * If updating an existing activity, finds the activity by ID and updates its properties
   * If creating a new activity, creates a new activity object and adds it to the top of the activities array
   * Syncs changes with the backend
   */
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
        Sync.activities.activity.put(activityToUpdate);
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
        this.activitiesListsList
          .find((list) => list.id == this.selectedList)
          ?.activities.unshift(activity.id);
      }

      this.selectedActivity = activity.id;
      Sync.activities.activity.post(activity);
    }
  }

  /**
   * Event handler for creating a new activity
   * @remarks
   * If no new activity draft exists, creates a new activity draft and assigns it to the currently selected list
   * If a new activity draft already exists in another list, detaches it from that list and creates a new one
   * Switches the right panel to the edit_activity state and selects the new activity draft
   */
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
      const containingList = this.activitiesListsList.find((list) =>
        list.activities.includes(newActivityTemplate.id),
      );
      if (containingList) {
        containingList.activities = containingList.activities.filter(
          (id) => id != newActivityTemplate.id,
        );
      }
    }

    // assign new activity draft to currently selected list
    this.activitiesListsList
      .find((list) => list.id == this.selectedList)
      ?.activities.push(newActivityTemplate.id);

    this.selectedActivity = newActivityTemplate.id;
    this.rightPanelState = "edit_activity";
  }
}
