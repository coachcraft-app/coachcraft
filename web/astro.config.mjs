// @ts-check
import { defineConfig } from "astro/config";
// AlpineJS for declarative dynamic behaviour
import alpinejs from "@astrojs/alpinejs";
// CSS
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Required for auth, makes it so the server does not pre-render by default
  output: "static",

  // outDir: "../backend/public",

  integrations: [
    alpinejs({
      entrypoint: "/src/alpineEntryPoint",
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // Required for Auth0
  server: {
    port: 3000,
  },
});
