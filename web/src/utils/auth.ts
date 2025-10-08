import { User, UserManager } from "oidc-client-ts";
import alpine from "./alpine";
import type { AuthStore } from "../typeDefs/storeTypes";

/**
 * `auth` is a singleton class
 *  for accessing, use `getInstance(): auth`
 */
export class auth {
  private static instance: auth;
  private userManager: UserManager;

  /**
   * private contructor to disallow instantiation
   * with the `new` keyword
   */
  private constructor() {
    this.userManager = new UserManager({
      authority: import.meta.env.PUBLIC_COGNITO_PROD_USER_POOL,
      client_id: import.meta.env.PUBLIC_COGNITO_PROD_APP_CLIENT_ID,
      redirect_uri: import.meta.env.PUBLIC_COGNITO_POST_AUTH_REDIRECT_URL,
      scope: import.meta.env.PUBLIC_COGNITO_USER_DATA_SCOPE,
    });
  }

  /**
   * Proxy for constructor
   *
   * @returns auth
   */
  public static getInstance(): auth {
    if (!auth.instance) auth.instance = new auth();
    return auth.instance;
  }

  public getUserManager(): UserManager {
    if (!this.userManager) throw new Error("");

    return this.userManager;
  }

  public async initAuthFlow(): Promise<void> {
    const globalAlpine = alpine.getInstance().getGlobalAlpine();
    const authStore = globalAlpine.store("auth") as AuthStore;

    // store UserManager in Alpine's auth store
    // to be accessed in .astro files
    authStore.userManager = this.userManager;

    // attempt to get User
    const user: User | null = await this.userManager.getUser();

    // attempt to get URL parameters
    const urlParams: URLSearchParams = new URLSearchParams(
      window.location.search,
    );
    const urlHasAuthResponse =
      (urlParams.has("code") && urlParams.has("state")) ||
      urlParams.has("error");

    // determine the current state of authentication and redirect user
    if (user) {
      if (!user.expired) {
        // state 1: cached user exists and is valid
        authStore.user = user as User;
      } else {
        // state 2: cached user expired, redirect to Cognito

        await this.userManager.removeUser();
        this.userManager.signinRedirect();
      }
    } else if (urlHasAuthResponse) {
      // state 3: redirected from Cognito, with URL response parameters

      const user: User | undefined = await this.userManager.signinCallback();
      if (user) {
        authStore.user = user as User;

        // clear URL response parameters from the URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.hash,
        );
      } else {
        // signinCallback return undefined, redirect back to Cognito

        this.userManager.signinRedirect();
      }
    } else {
      // state 4: no cached user or URL parameters, redirect to cognito

      this.userManager.signinRedirect();
    }
  }
}

export default auth;
