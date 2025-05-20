import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import activitiesStore from "./stores/activitiesStore.js";
import schedulingStore from "./stores/schedulingStore.js";

export default (Alpine) => {
  Alpine.plugin(collapse);
  Alpine.plugin(focus);
  Alpine.plugin(mask);

  activitiesStore(Alpine);
  schedulingStore(Alpine);
};
