import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["**/dist", "**/node_modules"]),
  {
    files: ["apps/frontend/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "quotes": ["error", "double", { "avoidEscape": false }],
      "no-empty": "off",
      "comma-dangle": ["error", "never"],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../*", "./*"]
        }
      ],
      "arrow-parens": ["error", "always"],
      "no-console": "error"
    },
  },
  {
    files: ["apps/backend/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "quotes": ["error", "double", { "avoidEscape": false }],
      "no-empty": "off",
      "comma-dangle": ["error", "never"],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../*", "./*"]
        }
      ],
      "arrow-parens": ["error", "always"],
      "no-console": "error"
    },
  },
  {
    files: ["packages/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
]);
