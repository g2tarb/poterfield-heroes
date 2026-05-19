import { defineConfig, devices } from "@playwright/test";

// Playwright config — mono-user, on tape sur le web local (3030).
// Le webServer démarre `pnpm dev` (web + api en parallèle via pnpm -r) avant les tests.

const isCI = !!process.env["CI"];

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: isCI ? 2 : 0,
  workers: 1,
  reporter: isCI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:3030",
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3030",
    reuseExistingServer: !isCI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
