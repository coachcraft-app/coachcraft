import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import routerStore from "./stores/routerStore.js";
import activitiesStore from "./stores/pages/activitiesStore.js";
import schedulingStore from "./stores/pages/schedulingStore.js";
import teamsStore from "./stores/pages/teamsStore.js";
import sessionsStore from "./stores/pages/sessionsStore.js";
import dashboardStore from "./stores/pages/dashboardStore.js";
import notesStore from "./stores/pages/notesStore.js";
import settingsStore from "./stores/pages/settingsStore.js";

import toastStore from "./stores/common/toastStore.js";

import { userManager, signOutRedirect } from "./utils/oicdCognitoConfig.js";

export default (Alpine) => {
  Alpine.plugin(collapse);
  Alpine.plugin(focus);
  Alpine.plugin(mask);

  Alpine.store("pages", {});
  Alpine.store("common", {});

  Alpine.store("auth", {});

  Alpine.store("auth").userManager = userManager;
  Alpine.store("auth").signOutRedirect = signOutRedirect;

  // Initialize /pages stores
  routerStore(Alpine);
  activitiesStore(Alpine);
  schedulingStore(Alpine);
  teamsStore(Alpine);
  sessionsStore(Alpine);
  dashboardStore(Alpine);
  notesStore(Alpine);
  settingsStore(Alpine);

  // Initialize /commmon stores
  toastStore(Alpine);

  // Initialize router
  Alpine.store("router").init();
};
