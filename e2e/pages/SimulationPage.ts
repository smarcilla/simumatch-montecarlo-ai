import { type Locator, type Page } from "@playwright/test";
import { buildCanonicalMatchSimulationHref } from "@/app/match/match-route-utils";

export interface CanonicalMatchSimulationRoute {
  id: string;
  tournamentSlug: string;
  matchSlug: string;
  backUrl?: string;
}

export class SimulationPage {
  readonly page: Page;
  readonly backToMatchLink: Locator;
  readonly matchDetailCard: Locator;
  readonly probabilityChart: Locator;
  readonly xptsCards: Locator;
  readonly scoreDistribution: Locator;
  readonly playerStatsChart: Locator;
  readonly momentumTimeline: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backToMatchLink = page.locator(".match-detail-back");
    this.matchDetailCard = page.locator(".simulation-page .match-detail-card");
    this.probabilityChart = page.locator(".simulation-probability-chart");
    this.xptsCards = page.locator(".simulation-xpts-cards");
    this.scoreDistribution = page.locator(".score-distribution-chart");
    this.playerStatsChart = page.locator(".player-stats-chart");
    this.momentumTimeline = page.locator(".momentum-timeline-chart");
  }

  async goto(matchId: string) {
    await this.page.goto(`/match/${matchId}/simulation`);
  }

  async gotoCanonical(match: CanonicalMatchSimulationRoute) {
    const href =
      buildCanonicalMatchSimulationHref(
        match,
        match.backUrl ? { back: match.backUrl } : undefined
      ) ?? `/match/${match.id}/simulation`;
    await this.page.goto(href);
  }

  async goBackToMatch() {
    await this.backToMatchLink.click();
  }
}
