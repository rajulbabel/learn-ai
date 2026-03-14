import globals from "globals";

export default [
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-duplicate-imports": "error",
      "no-constant-condition": "warn",
      "eqeqeq": ["warn", "smart"],
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  },
];
