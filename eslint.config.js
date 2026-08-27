import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["src/features/card-studio/registry/components/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // These legacy visual variants share the typed public data hooks but still use loose
    // presentation-only props. Keep the release gate focused on executable correctness.
    files: ["src/features/templates/catalog/**/*Gift.tsx", "src/features/templates/catalog/**/*Wishes.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
