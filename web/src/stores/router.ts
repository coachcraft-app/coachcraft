/**
 * A simple router class to manage page navigation in a single-page application (SPA).
 * It uses the URL hash to determine the current page and allows for navigation between different views.
 */

/**
 * Router class to manage page navigation
 */
export class Router {
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
      const target = hash || this.defaultPage;
      if (target !== this.currentPage) {
        this.currentPage = target;
      }
    });
  }
}

export default Router;
