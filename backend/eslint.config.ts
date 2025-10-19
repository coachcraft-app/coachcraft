// @ts-nocheck

import tseslint from "typescript-eslint";
import globals from "globals";

import { fileURLToPath } from "url";
import * as path from "path";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config([
  ...tseslint.configs.recommended,

  // Unicorn recommended preset
  pluginUnicorn.configs["flat/recommended"],

  // Global rule tweaks
  {
    rules: {
      // Patch to fix known issues with ESLint, Unicorn combo
      "unicorn/expiring-todo-comments": "off",
    },
  },

  // Project settings
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true, // makes eslint "type aware"
        tsconfigRootDir: dirname,
        sourceType: "module",
      },
      globals: globals.node, // Node.js environment globals types
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
      "drizzle.config.ts",
      "eslint.config.ts",
    ],
  },
]);
