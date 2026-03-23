import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globalSetup: ["src/tests/setup/global.setup.ts"],
    setupFiles: ["src/tests/setup/vitest.setup.ts"],
    fileParallelism: false,
    exclude: ["e2e/**", "node_modules/**", ".next/**", "playwright.config.ts"],
    env: {
      MONGODB_NAME: "test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        global: {
          lines: 40,
          functions: 40,
          branches: 40,
          statements: 40,
        },
        "./src/application/use-cases": {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  },
});
