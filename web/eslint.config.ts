// @ts-nocheck

import tseslint from "typescript-eslint";
import pluginUnicorn from "eslint-plugin-unicorn";

import globals from "globals";

import { fileURLToPath } from "url";
import * as path from "path";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config([
  ...tseslint.configs.recommended,

  // Unicorn recommended preset
  pluginUnicorn.configs.recommended,

  // Project settings
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true, // makes eslint "type aware"
        tsconfigRootDir: dirname,
        sourceType: "module",
      },
      globals: globals.browser, // include "global" browser types
    },
  },

  // Ignores
  {
    ignores: [
      "**/*.js",
      "**/*.mjs",
      "**/node_modules/**",
      "dist/**",
      ".astro/**",
      "coverage/**",
      "cypress/**",
      "cypress.config.*",
      "astro.config.ts",
      "tailwind.config.ts",
      "eslint.config.ts",
    ],
  },
]);
