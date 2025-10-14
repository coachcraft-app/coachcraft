import alpine from "@/libs/alpine";
import dummyAuth from "./auth.json";
import dummyActivities from "./activities.json";
import dummyScheduling from "./scheduling.json";
import dummyTeams from "./teams.json";

import type { PagesStore, Auth } from "@/typedefs/storeTypes";

export default function loadDummyData() {
  const globalAlpine = alpine.getInstance().getGlobalAlpine();

  const auth: Auth = globalAlpine.store("auth") as Auth;
  console.log("auth", auth);
  auth.user = {
    profile: {
      profile: dummyAuth.profile_picture_url,
      given_name: dummyAuth.given_name,
      email: dummyAuth.email,
      // Add dummy values for the missing properties
      sub: "dummy-sub",
      iss: "dummy-iss",
      aud: "dummy-aud",
      exp: 0,
      iat: 0,
    },
    session_state: "dummy-session-state",
    access_token: "dummy-access-token",
    token_type: "Bearer",
    scope: "openid profile email",
    scopes: ["openid", "profile", "email"],
    expires_at: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    expires_in: 3600,
    expired: false,
    id_token: "dummy-id-token",
    state: "dummy-state",
    toStorageString: () => "", // Mock function
  };

  // auth.user.profile.profile = dummyAuth.profile_picture_url;
  // auth.user.profile.given_name = dummyAuth.given_name;
  // auth.user.profile.email = dummyAuth.email;

  const pages: PagesStore = globalAlpine.store("pages") as PagesStore;
  pages.activities.activitiesList = dummyActivities.activitiesList;
  pages.activities.listsList = dummyActivities.listsList;
  pages.teams.teamsList = dummyTeams.teamsList;
  pages.scheduling.previousSessions = dummyScheduling.previousSessions;
}
