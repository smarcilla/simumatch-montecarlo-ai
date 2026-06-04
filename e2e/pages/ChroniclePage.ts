import { type Locator, type Page } from "@playwright/test";
import { buildCanonicalMatchChronicleHref } from "@/app/match/match-route-utils";

export interface CanonicalMatchChronicleRoute {
  id: string;
  tournamentSlug: string;
  matchSlug: string;
  backUrl?: string;
}

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

  async gotoCanonical(match: CanonicalMatchChronicleRoute) {
    const href =
      buildCanonicalMatchChronicleHref(
        match,
        match.backUrl ? { back: match.backUrl } : undefined
      ) ?? `/match/${match.id}/chronicle`;
    await this.page.goto(href);
  }

  async goBackToMatch() {
    await this.backToMatchLink.click();
  }
}
