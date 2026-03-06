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
    include: ["tests/e2e/**/*.e2e.test.ts"],
    globalSetup: ["./tests/e2e/global-setup.ts"],
    setupFiles: ["./tests/e2e/setup.ts"],
    passWithNoTests: true,
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000
  }
});
