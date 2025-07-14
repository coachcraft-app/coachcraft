import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import activitiesStore from "./stores/pages/activitiesStore.js";
import schedulingStore from "./stores/pages/schedulingStore.js";
import teamsStore from "./stores/pages/teamsStore.js";
import sessionsStore from "./stores/pages/sessionsStore.js";
import dashboardStore from "./stores/pages/dashboardStore.js";
import notesStore from "./stores/pages/notesStore.js";
import settingsStore from "./stores/pages/settingsStore.js";

export default (Alpine) => {
  Alpine.plugin(collapse);
  Alpine.plugin(focus);
  Alpine.plugin(mask);

  Alpine.store("pages", {});
  activitiesStore(Alpine);
  schedulingStore(Alpine);
  teamsStore(Alpine);
  sessionsStore(Alpine);
  dashboardStore(Alpine);
  notesStore(Alpine);
  settingsStore(Alpine);
};
