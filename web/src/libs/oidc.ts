import { User, UserManager } from "oidc-client-ts";
import alpine from "@/libs/alpine";

/**
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

  public getUserManager(): UserManager {
    if (!this.userManager) throw new Error("");

    return this.userManager;
  }

  public async initOidcFlow(): Promise<void> {
    const globalAlpine = alpine.getInstance().getGlobalAlpine();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authStore: any = globalAlpine.store("auth");

    authStore.userManager = this.userManager;

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

        authStore.user = user as User;
      } else {
        // state 2: cached user expired, redirect to Cognito

        await this.userManager.removeUser();
        this.userManager.signinRedirect();
      }
    } else if (urlHasOidcResponse) {
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
        // error, signinCallback returns undefined, redirect back to Cognito

        this.userManager.signinRedirect();
      }
    } else {
      // state 4: no cached user or URL parameters, redirect to cognito

      this.userManager.signinRedirect();
    }
  }
}

export default oidc;
