export function registerActivitiesStore(Alpine) {
    Alpine.store('activities', {

        // state
        listsList: [
            {   // Not dummy data, do not remove this default option
                "list_id": "0", 
                "list_name": "All Activities",
                "list_activities": [1, 2, 3, 4]
            },
            {
                "list_id": "1", 
                "list_name": "Warm Up",
                "list_activities": [1, 2, 3, 4]
            },
            {
                "list_id": "2", 
                "list_name": "Dribbling Drills",
                "list_activities": [5, 6, 7, 8]
            },
            {
                "list_id": "3", 
                "list_name": "Assorted",
                "list_activities": [1, 5, 4, 7]
            },
        ],

        activitiesList: [
            {
                "activity_id": "1", 
                "activity_name": "Catch Me If You Can",
                "duration": "00:30", 
                "description": "", 
                "notes": "",
                "img_url": ""
            },
            {
                "activity_id": "2", 
                "activity_name": "Circle Passing",
                "duration": "00:45", 
                "description": "", 
                "notes": "",
                "img_url": ""
            },
            {
                "activity_id": "3", 
                "activity_name": "Dribbling Commands",
                "duration": "00:30", 
                "description": "", 
                "notes": "",
                "img_url": ""
            },
            {
                "activity_id": "4", 
                "activity_name": "Dynamic Soccer Warm Up",
                "duration": "01:00", 
                "description": "", 
                "notes": "",
                "img_url": ""
            },
            {
                "activity_id": "5", 
                "activity_name": "1-on-1 Gate Dribbling",
                "duration": "01:00", 
                "description": "", 
                "notes": "",
                "img_url": ""
            },
            {
                "activity_id": "6", 
                "activity_name": "1-on-1-on-1 Dribbling",
                "duration": "01:00", 
                "description": "", 
                "notes": "",
                "img_url": ""
            },
            {
                "activity_id": "7", 
                "activity_name": "Dribble Attack",
                "duration": "01:00", 
                "description": "", 
                "notes": "",
                "img_url": ""
            },
            {
                "activity_id": "8", 
                "activity_name": "Dribble Knockout",
                "duration": "01:00", 
                "description": "", 
                "notes": "",
                "img_url": ""
            },
        ],
        selectedActivity: "",
        selectedList: "0",
        changesMade: false,
        changesSyncInProgress: false,

        // fetch data from API
        async fetchData() {

        }

    });
    // console.log("Activities List:", Alpine.store('activities').activitiesList);
}