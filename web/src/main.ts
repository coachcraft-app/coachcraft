import { userManager, initAuth } from "./utils/auth";

import type { Alpine } from "alpinejs";
import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import routerStore from "./stores/routerStore.js";
import authStore from "./stores/authStore.js";

import activitiesStore from "./stores/pages/activitiesStore.js";
import schedulingStore from "./stores/pages/schedulingStore.js";
import teamsStore from "./stores/pages/teamsStore.js";
import sessionsStore from "./stores/pages/sessionsStore.js";
import dashboardStore from "./stores/pages/dashboardStore.js";
import notesStore from "./stores/pages/notesStore.js";
import settingsStore from "./stores/pages/settingsStore.js";

import toastStore from "./stores/common/toastStore.js";

export default async (Alpine: Alpine) => {
  Alpine.plugin(collapse);
  Alpine.plugin(focus);
  Alpine.plugin(mask);

  Alpine.store("pages", {});
  Alpine.store("common", {});

  routerStore(Alpine);
  authStore(Alpine);

  // Initialize /pages stores
  activitiesStore(Alpine);
  schedulingStore(Alpine);
  teamsStore(Alpine);
  sessionsStore(Alpine);
  dashboardStore(Alpine);
  notesStore(Alpine);
  settingsStore(Alpine);

  // Initialize /commmon stores
  toastStore(Alpine);

  await initAuth(Alpine, userManager);
};
