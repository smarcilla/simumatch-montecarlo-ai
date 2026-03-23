import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("Match browsing", () => {
  test("should show welcome banner when no league is selected", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(homePage.welcomeBanner).toBeVisible();
  });

  test("should display matches when a league is selected from the menu", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.selectLeagueFromMenu(/.+/);

    await expect(homePage.pageHeader).toBeVisible();
    const matchCount = await homePage.getMatchCardCount();
    expect(matchCount).toBeGreaterThan(0);
  });

  test("should navigate to the next page of matches", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.selectLeagueFromMenu(/.+/);
    await expect(homePage.matchCards.first()).toBeVisible();

    const hasPagination = await homePage.pagination.isVisible();
    if (!hasPagination) {
      test.skip();
      return;
    }

    const pageBefore = await homePage.getCurrentPageNumber();
    await homePage.goToNextPage();
    const expectedPage = pageBefore + 1;
    await expect(homePage.pagination.locator(".pagination-info")).toContainText(
      String(expectedPage)
    );
    const pageAfter = await homePage.getCurrentPageNumber();
    expect(pageAfter).toBe(expectedPage);
  });

  test("should navigate to match detail when clicking a match card", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.selectLeagueFromMenu(/.+/);
    await expect(homePage.matchCards.first()).toBeVisible();

    await homePage.clickFirstMatch();
    await page.waitForURL(/\/match\/.+/);
    expect(page.url()).toMatch(/\/match\/.+/);
  });
});
