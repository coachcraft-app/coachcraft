import { User, UserManager } from "oidc-client-ts";
import type { AuthStore } from "../typeDefs/storeTypes";
import type { Alpine } from "alpinejs";

export const userManager = new UserManager({
  authority: import.meta.env.PUBLIC_COGNITO_PROD_USER_POOL,
  client_id: import.meta.env.PUBLIC_COGNITO_PROD_APP_CLIENT_ID,
  redirect_uri: import.meta.env.PUBLIC_COGNITO_POST_AUTH_REDIRECT_URL,
  scope: import.meta.env.PUBLIC_COGNITO_USER_DATA_SCOPE,
});

export async function initAuth(Alpine: Alpine, userManager: UserManager) {
  const authStore: AuthStore = Alpine.store("auth") as AuthStore;
  authStore.userManager = userManager;

  if (urlHasAuthResponse()) {
    // state 1: redirected from Cognito, with URL response parameters
    const user = await userManager.signinCallback();
    if (user) authStore.user = user;

    // remove the AUTH response parameters from the URL without reload
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.hash,
    );
  } else if (!(await userManager.getUser())) {
    // state 2: no cached user, redirect to cognito
    userManager.signinRedirect();
  } else {
    // state 3: cached user exists, check for expiry
    const user = await userManager.getUser();
    if (user && !user.expired) authStore.user = user;
  }
}

function urlHasAuthResponse() {
  const params = new URLSearchParams(window.location.search);

  return (params.has("code") && params.has("state")) || params.has("error");
}
