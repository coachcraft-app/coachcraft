import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import activitiesStore from "./stores/pages/activitiesStore.js";
import schedulingStore from "./stores/schedulingStore.js";
import teamsStore from "./stores/teamsStore.js";
import sessionsStore from "./stores/sessionsStore.js";

export default (Alpine) => {
  Alpine.plugin(collapse);
  Alpine.plugin(focus);
  Alpine.plugin(mask);

  Alpine.store("pages", {});
  activitiesStore(Alpine);
  schedulingStore(Alpine);
  teamsStore(Alpine);
  sessionsStore(Alpine);
};
