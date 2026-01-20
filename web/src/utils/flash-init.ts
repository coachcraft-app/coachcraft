import { oidc } from "@/libs/oidc";

export async function initApp(mode: string) {
  try {
    console.log("Flash screen - Mode:", mode);

    // Skip authentication only in development mode
    if (mode !== "production") {
      console.log("Development mode: Redirecting to app...");
      // Brief delay to show flash screen
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Redirecting now...");
      window.location.href = "/app";
      return;
    }

    // Production mode: Check authentication status
    console.log("Production mode - initializing OIDC...");

    // Enhanced loop detection
    const now = Date.now();
    const lastRedirectTime = parseInt(sessionStorage.getItem("lastFlashRedirectTime") || "0");
    const redirectCount = parseInt(sessionStorage.getItem("flashRedirectCount") || "0");
    
    // If we're redirecting too frequently (within 1 second) or too many times (>2), break the loop
    const timeSinceLastRedirect = now - lastRedirectTime;
    if ((timeSinceLastRedirect < 1000 && redirectCount > 0) || redirectCount > 2) {
      console.error("Redirect loop detected. Attempts:", redirectCount, "Time since last:", timeSinceLastRedirect);
      sessionStorage.removeItem("flashRedirectCount");
      sessionStorage.removeItem("lastFlashRedirectTime");
      document.body.innerHTML =
        '<div style="color: white; text-align: center; padding: 50px;">' +
        '<h1>Authentication Error</h1>' +
        '<p>Unable to authenticate. The app is stuck in a redirect loop.</p>' +
        '<p>This may be due to Cognito configuration issues.</p>' +
        '<button onclick="sessionStorage.clear(); window.location.reload();" style="background: #60a5fa; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">Retry</button>' +
        '<button onclick="window.location.href=\'/app\';" style="background: #4b5563; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">Skip Auth (Dev Only)</button>' +
        '</div>';
      return;
    }
    
    sessionStorage.setItem("flashRedirectCount", (redirectCount + 1).toString());
    sessionStorage.setItem("lastFlashRedirectTime", now.toString());

    const oidcInstance = oidc.getInstance();
    const userManager = oidcInstance.getUserManager();

    // Check URL for OIDC callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hasOidcCallback =
      (urlParams.has("code") && urlParams.has("state")) ||
      urlParams.has("error");

    if (hasOidcCallback) {
      // Handle callback from Cognito
      try {
        const user = await userManager.signinCallback();
        if (user && !user.expired) {
          // Clear redirect count on successful auth
          sessionStorage.removeItem("flashRedirectCount");
          // Clean URL and redirect to app
          window.history.replaceState({}, document.title, "/flash");
          window.location.href = "/app";
          return;
        }
      } catch (error) {
        console.error("Sign-in callback error:", error);
        userManager.signinRedirect();
        return;
      }
    }

    // Check for existing valid user session
    const user = await userManager.getUser();

    if (user && !user.expired) {
      // Valid session exists, redirect to app
      sessionStorage.removeItem("flashRedirectCount");
      window.location.href = "/app";
    } else {
      // No valid session, redirect to Cognito
      if (user) {
        await userManager.removeUser();
      }
      console.log("No valid user, redirecting to Cognito...");
      userManager.signinRedirect();
    }
  } catch (error) {
    console.error("Flash screen error:", error);
    // On error, show error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    document.body.innerHTML =
      '<div style="color: white; text-align: center; padding: 50px;"><h1>Authentication Error</h1><p>' +
      errorMessage +
      '</p><p><a href="/app" style="color: #60a5fa;">Continue to app anyway (dev)</a></p></div>';
  }
}
