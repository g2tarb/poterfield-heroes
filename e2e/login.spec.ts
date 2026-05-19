import { test, expect } from "@playwright/test";

const PASSWORD = process.env["ACCESS_PASSWORD"] ?? "ci_password_test";

test.describe("Login", () => {
  test("affiche le formulaire et redirige vers / après succès", async ({
    page,
  }) => {
    await page.goto("/login");

    const passwordInput = page.locator("#password");
    await expect(passwordInput).toBeVisible();

    await passwordInput.fill(PASSWORD);
    await page.getByRole("button", { name: /entrer dans l'atelier/i }).click();

    // On attend une URL différente de /login (redirect vers "/" ou la cible).
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
      timeout: 15_000,
    });
  });

  test("rejette un mauvais mot de passe", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#password").fill("clairement-mauvais");
    await page.getByRole("button", { name: /entrer dans l'atelier/i }).click();
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10_000 });
  });
});
