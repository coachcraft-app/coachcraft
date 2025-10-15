import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(...tseslint.configs.recommended, {
  files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
    globals: {
      ...globals.browser,
    },
  },
  ignores: [
    "**/node_modules/**",
    "dist/**",
    "astro.config.ts",
    "tailwind.config.ts",
    "eslint.config.ts",
  ],
});
