import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rules for hydration safety
  {
    rules: {
      // Warn about potential hydration issues
      "react/no-danger": "warn",
      "react/no-find-dom-node": "error",
      // Ensure suppressHydrationWarning is used intentionally
      "react/no-unknown-property": "error",
    },
  },
]);

export default eslintConfig;
