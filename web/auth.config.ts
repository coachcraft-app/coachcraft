// Authentication
import Auth0 from '@auth/core/providers/auth0';
import { defineConfig } from 'auth-astro';

export default defineConfig({
  providers: [
    Auth0({
      clientId: import.meta.env.AUTH_AUTH0_ID,
      clientSecret: import.meta.env.AUTH_AUTH0_SECRET,
      issuer: import.meta.env.AUTH_AUTH0_ISSUER,
    }),
  ],
});