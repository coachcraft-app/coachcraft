import { defineConfig } from "astro/config";
import alpine from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  output: "static",

  integrations: [
    alpine({
      entrypoint: "/src/main.ts",
    }),
  ],

  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [
      tailwindcss() as any,
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },

  server: {
    port: 3000,
  },
});
