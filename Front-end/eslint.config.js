import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default [
  // Ignore patterns
  {
    ignores: ["dist/**", "build/**", "node_modules/**", "coverage/**"],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // Prettier integration - must be last
  prettier,

  // Main config
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React plugin rules
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // React Refresh rules
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Custom rules
      "no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      // React plugin marks JSX-used vars as used
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },

  // Test files - more lenient
  {
    files: [
      "**/*.test.{js,jsx}",
      "**/*.spec.{js,jsx}",
      "**/test/**/*.{js,jsx}",
    ],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
    },
  },

  // App.jsx - allow context exports (Fast Refresh warning suppression)
  {
    files: ["src/App.jsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
];
