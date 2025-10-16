/**
 * This module sets up Alpine.js with plugins and state management stores.
 *
 * It uses the singleton pattern to ensure only one instance of Alpine is created and used throughout the application.
 * It registers several Alpine.js plugins and initializes various state management stores for activities, scheduling, teams, sessions, authentication, routing, and toast notifications.
 * @module
 */
import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import { ActivitiesView } from "@/stores/views/activities";
import { SchedulingView } from "@/stores/views/scheduling";
import { TeamsView } from "@/stores/views/teams";
import { SessionsView } from "@/stores/views/sessions";
import { Toast } from "@/stores/common/toast";

import { auth } from "@/stores/auth";
import { Router } from "@/stores/router";

import type { Alpine } from "alpinejs";

/**
 * `alpine` is a singleton class
 *
 * For accessing/initialising, use `getInstance(alpineObj?: Alpine): alpine`
 */
export class alpine {
  private static instance: alpine;
  private globalAlpine: Alpine;

  /**
   * private contructor to disallow instantiation
   * with the `new` keyword
   *
   * @param alpineObj - to be assigned as the globally accessible alpine object
   */
  private constructor(alpineObj: Alpine) {
    this.globalAlpine = alpineObj;

    // register plugins
    this.globalAlpine.plugin(collapse);
    this.globalAlpine.plugin(focus);
    this.globalAlpine.plugin(mask);

    // initialize stores classes
    const activitiesStore = new ActivitiesView();
    const teamsStore = new TeamsView();
    const schedulingStore = new SchedulingView(
      activitiesStore.activitiesList,
      teamsStore.teamsList,
    );
    const sessionsStore = new SessionsView(
      schedulingStore.upcomingSessions,
      schedulingStore.previousSessions,
    );

    const toastStore = new Toast();
    const authStore = new auth();
    const routerStore = new Router();

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
      const page = (this.globalAlpine.store("router") as Router).currentPage;
      const current = window.location.hash.slice(1);
      if (page && page !== current) {
        window.location.hash = page;
      }
    });
  }

  /**
   * Proxy for constructor
   *
   * @param alpineObj - to be assigned as the globally accessible alpine object,
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
