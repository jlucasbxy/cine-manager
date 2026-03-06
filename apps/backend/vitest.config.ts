import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    globals: true,
    passWithNoTests: true,
    include: ["tests/unit/**/*.unit.test.ts"],
    exclude: ["tests/integration/**", "tests/e2e/**"]
  }
});
