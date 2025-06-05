/**
 *
 */

interface Activity {
    id: string;           // Contains "default" or a string representation of int
    name: string;         // Name of activity
    duration: string;     // In the form "hh:mm"
    description: string;  //
    img_url: string;
}

interface List {
    id: string;
    name: string;
    activities: Activity[];
    accent_color: string;
}

class RESTAPI {
    debug;
    activitiesStore = {}

    constructor(debug: boolean, activitiesStore: any) {
        this.debug = debug;
        this.activitiesStore = activitiesStore;
    }

    async getActivities() {
        try {
            const response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/activities");

            if (response.ok) {

            } else if(response.status === 304) {
                return {};
            }
        } catch (e: any) {
            console.log(e);
        }
        {}
    }

    async deleteActivity() {

    }

    async postActivities(activities: Activity[]) {
        
    }

    async putActivities() {

    }
}

function main() {
    const api = new RESTAPI(true);
}

main()