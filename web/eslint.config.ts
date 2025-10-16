// @ts-nocheck
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginSonarjs from "eslint-plugin-sonarjs";

import js from "@eslint/js";

import { FlatCompat } from "@eslint/eslintrc";

import { fileURLToPath } from "url";
import * as path from "path";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: dirname });

const unicornFlat = pluginUnicorn?.configs?.["flat/recommended"];
const sonarFlat = pluginSonarjs?.configs?.["recommended"];

export default tseslint.config([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Use flat presets when available
  ...(unicornFlat ? [unicornFlat] : []),
  ...(sonarFlat ? [sonarFlat] : []),

  // The following plugins need to be installed as npm packages
  // imported under the hood by compat
  // compat is used for importing legacy plugins using the latest eslint config
  ...compat.extends(
    "plugin:promise/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ),

  // Project settings
  {
    files: [
      "src/**/*.{js,jsx,ts,tsx}",
      "scripts/**/*.{js,ts}",
      "pages/**/*.{js,jsx,ts,tsx}",
      "components/**/*.{js,jsx,ts,tsx}",
    ],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: dirname,
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      "import/resolver": {
        typescript: { project: true, alwaysTryTypes: true },
        node: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // For plain JS files, do not use type-aware project to avoid false positives
  {
    files: ["**/*.{js,cjs,mjs,jsx}"],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
  },

  {
    ignores: [
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
