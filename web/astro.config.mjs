// @ts-check
import { defineConfig } from "astro/config";
// AlpineJS for declarative dynamic behaviour
import alpinejs from "@astrojs/alpinejs";
// CSS
import tailwindcss from "@tailwindcss/vite";
<<<<<<< HEAD
// Authentication
import auth from "auth-astro";
// Adapter - Where are we hosting the output of astro
import node from "@astrojs/node";
=======
>>>>>>> atharv/#68/manage_activities

// https://astro.build/config
export default defineConfig({
  // Required for auth, makes it so the server does not pre-render by default
<<<<<<< HEAD
  output: "server",

  // When we are building, we want something compatible with node
  // 'middleware' means we can import the astro build as a middleware to express
  adapter: node({
    mode: "middleware",
  }),
=======
  output: "static",

  // outDir: "../backend/public",
>>>>>>> atharv/#68/manage_activities

  integrations: [
    alpinejs({
      entrypoint: "/src/alpineEntryPoint",
    }),
    auth(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // Required for Auth0
  server: {
    port: 3000,
  },
});
