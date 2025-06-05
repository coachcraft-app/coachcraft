/**
 *
 */

interface Activity {
    id: string;           // Contains "default" or a string representation of int
    name: string;         // Name of activity
    duration: string;     // In the form "hh:mm"
    description: string;  //
    img_url: string;      //
    lastModified: Date;   //
}

interface APIActivitiesResponse {
    activities: APIActivity[];
}

interface APIListResponse {
    lists: APIList[];
}

interface APIActivity {
    id: number;           // Contains "default" or a string representation of int
    name: string;         // Title of activity
    duration: string;     // In the form "hh:mm"
    description: string;  //
    imgUrl: string;       //
    lastModified: string; //
}

interface APIList {
    id: number;
    name: string;
    accentColor: string;
    lastModified: string;
    activities: number[];
}

interface List {
    id: string;
    name: string;
    accent_color: string;
    activities: Activity[];
    lastModified: string;
}

class Sync {
    debug: boolean;
    activitiesList: Activity[];
    listsList: List[];

    constructor(activitiesList: Activity[], listsList: List[], debug: boolean = false) {
        this.activitiesList = activitiesList;
        this.listsList = listsList;
        this.debug = debug;
    }

    #convertActivityToAPIActivity(activity: Activity): APIActivity {
        return {
            id: +activity.id,
            name: activity.name,
            duration: activity.duration,
            description: activity.description,
            imgUrl: activity.img_url,
            lastModified: activity.lastModified.toString()
        };
    }

    #convertAPIActivityToActivity(activity: APIActivity): Activity {
        return {
            id: activity.id.toString(),
            name: activity.name,
            duration: activity.duration,
            description: activity.description,
            img_url: activity.imgUrl,
            lastModified: new Date(activity.lastModified),
        }
    }

    #convertListToAPIList(list: List): APIList {
        const activities: number[] = []

        for (const activity of list.activities) {
            activities.push(activity.id);
        }

        return {
            id: +list.id,
            name: list.name,
            accentColor: list.accent_color,
            activities: activities,
            lastModified: list.lastModified,
        };
    }

    #convertAPIListToList(list: APIList): List {
        const activities: Activity[] = []

        for (const activity of list.activities) {
            activities.push(this.activitiesList.find((a) => {
                return a.id === activity.toString();
            }));
        }

        return {
            id: list.id.toString(),
            name: list.name,
            accent_color: list.accentColor,
            activities: activities,
            lastModified: list.lastModified,
        };
    }

    #getActivitiesModifyDateTime(): Date {
        let newestDate: Date = new Date(0);
        for (const activity of this.activitiesList) {
            if (activity.lastModified) {
                newestDate = (activity.lastModified > newestDate) ? activity.lastModified : newestDate;
            }
        }
        return newestDate;
    }

    #getListsModifyDateTime(): Date {
        let newestDate: Date = new Date(0);
        for (const list of this.listsList) {
            if (list.lastModified) {
                newestDate = (list.lastModified > newestDate) ? list.lastModified : newestDate;
            }
        }
        return newestDate;
    }

    async sync(): Promise<void> {
        try {
            // Activities
            let response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/activity", {
                method: 'GET',
                headers: {
                    "If-Modified-Since": this.#getActivitiesModifyDateTime().toUTCString(),
                }
            });

            if (response.ok) {
                const json: APIActivitiesResponse = await response.json();
                // clear array
                this.activitiesList.length = 0;

                for (const activity of json.activities) {
                    this.activitiesList.push(this.#convertAPIActivityToActivity(activity));
                }
            // Current is up to date
            } else if(response.status === 304) {
                return;
            } else {
                console.error(response.statusText);
                return;
            }

            // Lists
            response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/list", {
                method: 'GET',
                headers: {
                    "If-Modified-Since": this.#getListsModifyDateTime(this.listsList).toUTCString(),
                }
            });

            if (response.ok) {
                const json: APIListResponse = await response.json();
                // clear array
                this.listsList.length = 0;

                for (const list of json.lists) {
                    this.listsList.push(this.#convertAPIListToList(list));
                }
                // Current is up to date
            } else if(response.status === 304) {
                return;
            } else {
                console.error(response.statusText);
                return;
            }
        } catch (e: any) {
            console.error(e);
        }
    }

    async deleteActivity(id: string): Promise<void> {
        try {
            const response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/activity/" + id, {
                method: 'DELETE',
            });

            if (response.ok) {
                await this.sync();
            } else {
                console.error(response.statusText);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async postActivity(activity: Activity): Promise<void> {
        try {
            // Strip out ids, post assigns ids automatically
            const convertActivity = this.#convertActivityToAPIActivity(activity)
            convertActivity.id = undefined

            const response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/activity", {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(convertActivity),
            });

            if (response.ok) {
                await this.sync();
            } else {
                console.error(response.statusText);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async putActivity(activity: Activity): Promise<void> {
        try {
            const response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/activity/" + activity.id, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.#convertActivityToAPIActivity(activity)),
            });

            if (response.ok) {
                await this.sync();
            } else {
                console.error(response.statusText);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async deleteList(id: string): Promise<void> {
        try {
            const response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/list/" + id, {
                method: 'DELETE',
            });

            if (response.ok) {
                await this.sync();
            } else {
                console.error(response.statusText);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async postList(list: List): Promise<void> {
        try {
            // Strip out ids, post assigns ids automatically
            const convertList = this.#convertListToAPIList(list);
            convertList.id = undefined;

            const response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/list", {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(convertList),
            });

            if (response.ok) {
                await this.sync();
            } else {
                console.error(response.statusText);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async putList(list: List): Promise<void> {
        try {
            const response = await fetch((this.debug && "http://localhost:3000" || "") + "/api/list/" + list.id, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.#convertListToAPIList(list)),
            });

            if (response.ok) {
                await this.sync();
            } else {
                console.error(response.statusText);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

function main() {
    let activities: Activity[] = [];
    let lists: List[] = [];
    const api = new Sync(activities, lists, true);

    api.sync().then(() => {
        console.log(activities);
        console.log(lists);
    });

    api.postList({id: "1", name: "Test Post List", accent_color: "Lavender", activities: [], lastModified: new Date()})
        .then(() => {
            console.log(lists);

            const putList = lists[1];
            putList.name = "Test Put List";
            putList.accent_color = "Banana";
            putList.activities = activities;
            api.putList(putList).then(() => {
                console.log(lists);

                api.deleteList(putList.id).then(() => {
                    console.log(lists);
                })
            })
        });


}

main()