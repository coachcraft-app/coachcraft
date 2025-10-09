import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import activitiesStore from "../stores/pages/activities.ts";
import schedulingStore from "../stores/pages/schedulingStore.js";
import teamsStore from "../stores/pages/teamsStore.js";
import sessionsStore from "../stores/pages/sessionsStore.js";
import toastStore from "../stores/common/toastStore.js";

import authStore from "../stores/authStore.js";
import routerStore from "../stores/routerStore.js";

import type { Alpine, Stores } from "alpinejs";

/**
 * `alpine` is a singleton class
 *  for accessing/initialising, use `getInstance(alpineObj?: Alpine): alpine`
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

    // initialize /pages stores
    this.globalAlpine.store("pages", {});
    const pagesStore: Stores = this.globalAlpine.store("pages") as Stores;

    pagesStore.activities = new activitiesStore();
    schedulingStore(this.globalAlpine);
    teamsStore(this.globalAlpine);
    sessionsStore(this.globalAlpine);

    // initialize /common stores
    this.globalAlpine.store("common", {});
    toastStore(this.globalAlpine);

    authStore(this.globalAlpine);

    routerStore(this.globalAlpine);
    const router: any = this.globalAlpine.store("router");
    router.init();
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
