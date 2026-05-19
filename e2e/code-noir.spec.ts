import { test, expect } from "@playwright/test";
import { login } from "./_helpers";

test.describe("Code Noir", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("affiche le skill tree et la PROCHAINE CIBLE card", async ({ page }) => {
    await page.goto("/code-noir");

    // En-tête du skill tree (texte "$ skill tree [n/m]")
    await expect(page.getByText(/skill tree/i).first()).toBeVisible({
      timeout: 15_000,
    });

    // Card "PROCHAINE CIBLE" (rendue si au moins une technique reste à débloquer)
    // ou état "tout débloqué" — on tolère les deux.
    const target = page.getByText(/PROCHAINE CIBLE|tout débloqué|tout est unlocked/i);
    await expect(target.first()).toBeVisible({ timeout: 10_000 });
  });
});
