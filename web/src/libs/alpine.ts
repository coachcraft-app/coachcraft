import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import activities from "@/stores/views/activities";
import scheduling from "@/stores/views/scheduling";
import teams from "@/stores/views/teams";
import sessions from "@/stores/views/sessions";
import toast from "@/stores/common/toast";

import auth from "@/stores/auth";
import router from "@/stores/router";

import type { Alpine } from "alpinejs";

/**
 * `alpine` is a singleton class
 *
 * For accessing/initialising, use `getInstance(alpineObj?: Alpine): alpine`
 */
class alpine {
  private static instance: alpine;
  private globalAlpine: Alpine;

  /**
   * private contructor to disallow instantiation
   * with the `new` keyword
   *
   * @argument alpineObj - to be assigned as the globally accessible alpine object
   */
  private constructor(alpineObj: Alpine) {
    this.globalAlpine = alpineObj;

    // register plugins
    this.globalAlpine.plugin(collapse);
    this.globalAlpine.plugin(focus);
    this.globalAlpine.plugin(mask);

    // initialize stores classes
    const activitiesStore = new activities();
    const teamsStore = new teams();
    const schedulingStore = new scheduling(
      activitiesStore.activitiesList,
      teamsStore.teamsList,
    );
    const sessionsStore = new sessions(
      schedulingStore.upcomingSessions,
      schedulingStore.previousSessions,
    );

    const toastStore = new toast();
    const authStore = new auth();
    const routerStore = new router();

    this.globalAlpine.store("activities", activitiesStore);
    this.globalAlpine.store("scheduling", schedulingStore);
    this.globalAlpine.store("teams", teamsStore);
    this.globalAlpine.store("sessions", sessionsStore);

    // nest common stores classes within the overarching "common" store
    this.globalAlpine.store("common", {
      toast: toastStore,
    });

    this.globalAlpine.store("auth", authStore);

    this.globalAlpine.store("router", routerStore);
    this.globalAlpine.effect(() => {
      const page = (this.globalAlpine.store("router") as router).currentPage;
      const current = window.location.hash.slice(1);
      if (page && page !== current) {
        window.location.hash = page;
      }
    });
  }

  /**
   * Proxy for constructor
   *
   * @argument alpineObj - to be assigned as the globally accessible alpine object,
   * only needs to be supplied when getInstance() is first called
   *
   * @returns The global instance of alpineSingleton,
   * via which the Alpine instance can be accessed
   */
  public static getInstance(alpineObj?: Alpine): alpine {
    // if this is the first call to getInstance()
    if (!alpine.instance) {
      // check if the Alpine object is supplied
      if (!alpineObj)
        throw new Error(
          "The Alpine object must be supplied when getInstance() is first called.",
        );

      // call the constructor
      alpine.instance = new alpine(alpineObj);
    }

    // return the single global instance
    return alpine.instance;
  }

  /**
   *
   * @returns Alpine object
   * @throws Error if the Alpine instance var has not been initialised
   */
  public getGlobalAlpine(): Alpine {
    if (!this.globalAlpine)
      throw new Error(
        "The alpine singleton class has not been initialised yet. Use alpine.getInstance(alpineObj?: Alpine) first.",
      );

    return this.globalAlpine;
  }
}

export default alpine;
