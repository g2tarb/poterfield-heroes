import { test, expect } from "@playwright/test";
import { login } from "./_helpers";

test.describe("SRS", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("affiche soit le rating UI soit l'empty state", async ({ page }) => {
    await page.goto("/srs");

    // Deux cas possibles :
    //  - cartes à réviser → boutons "Raté/Difficile/Bon/Facile" éventuellement après "Voir la réponse"
    //  - empty state → texte "Aucune carte à réviser."
    const empty = page.getByText(/Aucune carte à réviser/i);
    const rateButton = page.getByRole("button", { name: /raté|voir la réponse/i });

    await expect.poll(
      async () => (await empty.count()) + (await rateButton.count()),
      { timeout: 15_000 },
    ).toBeGreaterThan(0);
  });
});
