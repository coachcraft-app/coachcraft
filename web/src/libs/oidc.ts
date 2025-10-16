/**
 * oidc is a singleton class
 *
 * Handles OIDC authentication with AWS Cognito
 * @module
 */

import { User, UserManager } from "oidc-client-ts";
import { alpine } from "@/libs/alpine";

import type { auth } from "@/stores/auth";

/**
 * Handles OIDC authentication with AWS Cognito
 * used to create tokens for authenticating GraphQL requests
 *
 * `oidc` is a singleton class
 *  for accessing/initialising, use `getInstance(): oidc`
 */
export class oidc {
  private static instance: oidc;
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
   * @returns oidc
   */
  public static getInstance(): oidc {
    if (!oidc.instance) oidc.instance = new oidc();
    return oidc.instance;
  }

  /**
   * Returns a UserManager instance used to signin/signout users
   * @returns userManager
   */
  public getUserManager(): UserManager {
    if (!this.userManager) throw new Error("");

    return this.userManager;
  }

  /**
   * Initialises the OIDC authentication flow
   *
   * Determines the current authentication state, and redirects the user accordingly
   */
  public async initOidcFlow(): Promise<void> {
    const globalAlpine = alpine.getInstance().getGlobalAlpine();

    const authStore: auth = globalAlpine.store("auth") as auth;

    const user: User | null = await this.userManager.getUser();

    const urlParams: URLSearchParams = new URLSearchParams(
      window.location.search,
    );
    const urlHasOidcResponse =
      (urlParams.has("code") && urlParams.has("state")) ||
      urlParams.has("error");

    // determine the current state of authentication and redirect user
    if (user) {
      if (!user.expired) {
        // state 1: cached user exists and is valid

        authStore.userProfilePic = user.profile.profile;
        authStore.givenName = user.profile.given_name;
        authStore.userEmail = user.profile.email;
      } else {
        // state 2: cached user expired, redirect to Cognito

        await this.userManager.removeUser();
        this.userManager.signinRedirect();
      }
    } else if (urlHasOidcResponse) {
      // state 3: redirected from Cognito, with URL response parameters

      const user: User | undefined = await this.userManager.signinCallback();
      if (user) {
        authStore.userProfilePic = user.profile.profile;
        authStore.givenName = user.profile.given_name;
        authStore.userEmail = user.profile.email;

        // clear URL response parameters from the URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.hash,
        );
      } else {
        // error, signinCallback returns undefined, redirect back to Cognito

        this.userManager.signinRedirect();
      }
    } else {
      // state 4: no cached user or URL parameters, redirect to cognito

      this.userManager.signinRedirect();
    }
  }
}
