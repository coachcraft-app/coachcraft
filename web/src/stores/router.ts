import alpine from "../utils/alpine";

export default class router {
  public defaultPage: string = "activities";
  public currentPage: string = "";

  /**
   * constructor to initialize router
   */
  public constructor() {
    // uses "hash based routing", allowing for changing the URL manually and having the SPA react to the change

    // Set initial page based on URL hash or to the default
    const hash = window.location.hash.slice(1); // removing the # from "#dashboard" || "#settings" etc
    this.currentPage = hash || this.defaultPage;

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.slice(1);
      this.currentPage = hash || this.defaultPage;
    });

    // Peg window.location.hash to this.currentPage
    const Alpine = alpine.getInstance().getGlobalAlpine();
    Alpine.effect(() => {
      if (this.currentPage) {
        window.location.hash = this.currentPage;

        // Reactively update document title
        const title =
          this.currentPage?.[0]?.toUpperCase() + this.currentPage?.slice(1);
        document.title = `CoachCraft ${title}`;
      }
    });
  }
}
