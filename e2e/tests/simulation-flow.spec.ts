import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { MatchDetailPage } from "../pages/MatchDetailPage";
import { SimulationPage } from "../pages/SimulationPage";

test.describe("Simulation flow", () => {
  test("should simulate a match and view simulation results", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.selectLeagueFromMenu(/.+/);
    await expect(homePage.matchCards.first()).toBeVisible();
    await homePage.clickFirstMatch();
    await page.waitForURL(/\/match\/.+/);

    const matchDetail = new MatchDetailPage(page);
    await expect(matchDetail.matchDetailCard).toBeVisible();
    await expect(matchDetail.actionsPanel).toBeVisible();

    const hasSimulateButton = await matchDetail.simulateButton.isVisible();
    const hasViewSimButton = await matchDetail.viewSimulationButton
      .isVisible()
      .catch(() => false);

    if (hasSimulateButton) {
      await matchDetail.simulateMatch();
      await page.waitForLoadState("networkidle");
    }

    if (hasViewSimButton || hasSimulateButton) {
      const viewBtn = matchDetail.viewSimulationButton;
      await expect(viewBtn).toBeVisible({ timeout: 10_000 });
      await matchDetail.navigateToSimulation();
      await page.waitForURL(/\/match\/.+\/simulation/);

      const simulationPage = new SimulationPage(page);
      await expect(simulationPage.matchDetailCard).toBeVisible();
    }
  });
});
