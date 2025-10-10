import { defineConfig } from "astro/config";
import alpine from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
  output: "static",

  integrations: [
    alpine({
      entrypoint: "/src/alpineEntryPoint",
    }),
  ],

  vite: {
    plugins: [
      tailwindcss(),
      istanbul({
        include: "src/*",
        exclude: ["node_modules", "cypress", "dist"],
        extension: [".js", ".ts", ".astro"],
        requireEnv: false,
        forceBuildInstrument: true,
      }),
    ],
  },

  server: {
    port: 3000,
  },
});
