import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { MatchDetailPage } from "../pages/MatchDetailPage";
import { ChroniclePage } from "../pages/ChroniclePage";

test.describe("Chronicle flow", () => {
  test("should generate and view a chronicle from a simulated match", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.selectLeagueFromMenu(/.+/);
    await expect(homePage.matchCards.first()).toBeVisible();
    await homePage.clickFirstMatch();
    await page.waitForURL(/\/match\/.+/);

    const matchDetail = new MatchDetailPage(page);
    await expect(matchDetail.actionsPanel).toBeVisible();

    const canSimulate = await matchDetail.simulateButton.isVisible();
    if (canSimulate) {
      await matchDetail.simulateMatch();
      await page.waitForLoadState("networkidle");
    }

    const canWriteChronicle = await matchDetail.writeChronicleButton
      .isVisible()
      .catch(() => false);

    if (canWriteChronicle) {
      await matchDetail.writeChronicle();
      await page.waitForLoadState("networkidle");
    }

    const canReadChronicle = await matchDetail.readChronicleButton
      .isVisible()
      .catch(() => false);

    if (canReadChronicle) {
      await matchDetail.navigateToChronicle();
      await page.waitForURL(/\/match\/.+\/chronicle/);

      const chroniclePage = new ChroniclePage(page);
      await expect(chroniclePage.chronicleHero).toBeVisible({
        timeout: 30_000,
      });
      await expect(chroniclePage.chronicleTitle).toBeVisible();
    }
  });
});
