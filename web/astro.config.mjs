import { defineConfig } from "astro/config";
import alpine from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",

  integrations: [
    alpine({
      entrypoint: "/src/alpineEntryPoint",
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  server: {
    port: 3000,
  },
});
