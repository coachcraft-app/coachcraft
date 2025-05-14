import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";

import activitiesStore from "./stores/activitiesStore.js";

export default function () {
  Alpine.plugin(collapse);
  Alpine.plugin(focus);
  Alpine.plugin(mask);

  activitiesStore(Alpine);
};
