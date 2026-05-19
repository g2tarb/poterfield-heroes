import type { Page } from "@playwright/test";

export const ACCESS_PASSWORD =
  process.env["ACCESS_PASSWORD"] ?? "ci_password_test";

/**
 * Login via UI puis attend la redirection. À utiliser en `beforeEach` pour les
 * tests qui nécessitent une session authentifiée.
 */
export async function login(page: Page): Promise<void> {
  await page.goto("/login");
  await page.locator("#password").fill(ACCESS_PASSWORD);
  await page.getByRole("button", { name: /entrer dans l'atelier/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 15_000,
  });
}
