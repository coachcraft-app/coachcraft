import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import activities from "../stores/pages/activities";
import scheduling from "../stores/pages/scheduling";
import teams from "../stores/pages/teams";
import sessions from "../stores/pages/sessions";
import toast from "../stores/common/toast";

import auth from "../stores/auth";
import router from "../stores/router";

import type { Alpine } from "alpinejs";

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
    this.globalAlpine.store("pages", {
      activities: new activities(),
      scheduling: new scheduling(),
      teams: new teams(),
      sessions: new sessions(),
    });

    // initialize /common stores
    this.globalAlpine.store("common", {
      toast: new toast(),
    });

    this.globalAlpine.store("auth", new auth());

    this.globalAlpine.store("router", new router());
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
