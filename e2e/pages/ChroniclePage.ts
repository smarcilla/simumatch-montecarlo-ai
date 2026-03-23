import { type Locator, type Page } from "@playwright/test";

export class ChroniclePage {
  readonly page: Page;
  readonly backToMatchLink: Locator;
  readonly matchDetailCard: Locator;
  readonly chronicleHero: Locator;
  readonly chronicleTitle: Locator;
  readonly chronicleSummary: Locator;
  readonly chronicleHighlights: Locator;
  readonly chronicleBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backToMatchLink = page.locator(".match-detail-back");
    this.matchDetailCard = page.locator(".match-detail-card");
    this.chronicleHero = page.locator(".chronicle-hero");
    this.chronicleTitle = page.locator(".chronicle-title");
    this.chronicleSummary = page.locator(".chronicle-summary");
    this.chronicleHighlights = page.locator(".chronicle-highlights");
    this.chronicleBody = page.locator(".chronicle-body");
  }

  async goto(matchId: string) {
    await this.page.goto(`/match/${matchId}/chronicle`);
  }

  async goBackToMatch() {
    await this.backToMatchLink.click();
  }
}
