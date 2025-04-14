import { createAuth0Client } from '@auth0/auth0-spa-js';

/*
<div x-data="loginButtons">
    <button id="btn-login"  x-if="!isAuthenticated" @click="login">Log in</button>
    <button id="btn-logout" x-if="isAuthenticated"  @click="logout">Log out</button>
</div>
*/

// Create a function to fetch auth_config.json
const fetchAuthConfig = () => fetch("/auth_config.json");

// Authorise 
const configureClient = async () => {
    try {
        const response = await fetchAuthConfig();
        const config = await response.json();

        Alpine.store('auth0').auth0Client = await createAuth0Client({
            domain: config.domain,
            clientId: config.clientId
        });
    } catch(error) {
        console.log(`Error fetching auth_config.json: ${error}`);
        return;
    }
};

async function updateAuth() {
    this.isReady = false;
    this.isAuthenticated = await this.auth0Client.isAuthenticated();
    this.user = await this.auth0Client.getUser();
    this.isReady = true;
}

export default function Auth() {
    return {
        // Data
        isAuthenticated: false,
        isReady: false,
        auth0Client: null,
        user: {
            firstname: "",
            lastname: "",
            name: "",
            picture: "",
        },

        // Constructor
        async init() {
            // Create consfigure and create auth0Client
            await configureClient();

            // Grab the global client from store
            this.auth0Client = Alpine.store('auth0').auth0Client

            // Update buttons
            await updateAuth.call(this);

            // Handle redirect from login page
            const query = window.location.search;
            if (query.includes("code=") && query.includes("state=")) {
                // Process the login state
                await this.auth0Client.handleRedirectCallback();

                // Update buttons
                await updateAuth.call(this);

                // Use replaceState to redirect the user away and remove the querystring parameters
                window.history.replaceState({}, document.title, "/");
            }
        },

        // Button functions
        async login() {
            await this.auth0Client.loginWithRedirect({
                authorizationParams: {
                    redirect_uri: window.location.origin
                }
            });
        },
        logout() {
            this.auth0Client.logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        }
    };
}