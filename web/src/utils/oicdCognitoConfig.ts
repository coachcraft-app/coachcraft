import { UserManager } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_0a77n19jq",
  client_id: "3r52p9m6umlgmfg3uqbgocd4ii",
  redirect_uri: "https://coachcraft.athn.dev",
  response_type: "code",
  scope: "email openid phone",
};

// create a UserManager instance
export const userManager = new UserManager({
  ...cognitoAuthConfig,
});

export async function signOutRedirect() {
  const clientId = "3r52p9m6umlgmfg3uqbgocd4ii";
  const logoutUri = "https://google.com";
  const cognitoDomain = "https://coachcraft-auth.athn.dev";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
}

export async function isSessionExpired() {
  const user = await userManager.getUser();
}
