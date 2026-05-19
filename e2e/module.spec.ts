import { test, expect } from "@playwright/test";
import { login } from "./_helpers";

test.describe("Module page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("ouvre un module actif et toggle le coach", async ({ page }) => {
    await page.goto("/");

    // Trouve le premier lien vers /modules/... (module actif au top dans staircase)
    const firstModuleLink = page.locator('a[href^="/modules/"]').first();
    await expect(firstModuleLink).toBeVisible({ timeout: 15_000 });
    await firstModuleLink.click();

    // On attend une URL /modules/xxx
    await page.waitForURL(/\/modules\//, { timeout: 15_000 });

    // Le coach a un bouton flottant avec aria-label "Ouvrir le coach"
    const coachOpen = page.getByRole("button", { name: /ouvrir le coach/i });
    await expect(coachOpen).toBeVisible({ timeout: 10_000 });
    await coachOpen.click();

    // Une fois ouvert, le label devient "Fermer le coach"
    await expect(
      page.getByRole("button", { name: /fermer le coach/i }),
    ).toBeVisible({ timeout: 5_000 });
  });
});
