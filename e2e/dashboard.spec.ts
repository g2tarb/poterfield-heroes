import { test, expect } from "@playwright/test";
import { login } from "./_helpers";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("affiche ProgressionPanel + Staircase une fois loggé", async ({
    page,
  }) => {
    await page.goto("/");

    // Le panel "Palier X" est rendu par ProgressionPanel.
    await expect(page.getByText(/Palier\s+\d/i).first()).toBeVisible({
      timeout: 15_000,
    });

    // Staircase rend au minimum une station de module.
    const stations = page.locator('[data-testid="staircase-station"]');
    if ((await stations.count()) === 0) {
      // fallback : si pas de testid, on cherche un lien vers /modules/...
      await expect(
        page.locator('a[href^="/modules/"]').first(),
      ).toBeVisible({ timeout: 15_000 });
    } else {
      await expect(stations.first()).toBeVisible();
    }
  });
});
