import { type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly matchCards: Locator;
  readonly pagination: Locator;
  readonly welcomeBanner: Locator;
  readonly pageHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator(".dashboard-sidebar");
    this.matchCards = page.locator(".match-card");
    this.pagination = page.locator("nav.pagination");
    this.welcomeBanner = page.locator(".info-banner");
    this.pageHeader = page.locator(".page-header");
  }

  async goto() {
    await this.page.goto("/");
  }

  async gotoWithParams(leagueId: string, seasonId: string) {
    await this.page.goto(`/?league=${leagueId}&season=${seasonId}`);
  }

  async selectLeagueFromMenu(leagueName: string | RegExp) {
    await this.sidebar
      .locator("button.league-button")
      .filter({ hasText: leagueName })
      .first()
      .click();
  }

  async getMatchCardCount() {
    return this.matchCards.count();
  }

  async clickFirstMatch() {
    await this.matchCards.first().click();
  }

  async clickMatchByIndex(index: number) {
    await this.matchCards.nth(index).click();
  }

  async goToNextPage() {
    const currentUrl = this.page.url();
    await this.pagination.getByText("›", { exact: true }).click();
    await this.page.waitForURL((url) => url.toString() !== currentUrl);
  }

  async getCurrentPageNumber() {
    const info = await this.pagination
      .locator(".pagination-info")
      .textContent();
    const match = info?.match(/(\d+)/);
    return match ? Number.parseInt(match[1], 10) : 0;
  }
}
