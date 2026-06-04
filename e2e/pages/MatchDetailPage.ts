import { type Locator, type Page, expect } from "@playwright/test";
import { buildCanonicalMatchHref } from "@/app/match/match-route-utils";

export interface CanonicalMatchRoute {
  id: string;
  tournamentSlug: string;
  matchSlug: string;
  backUrl?: string;
}

export class MatchDetailPage {
  readonly page: Page;
  readonly backToMatchesLink: Locator;
  readonly matchDetailCard: Locator;
  readonly actionsPanel: Locator;
  readonly simulateButton: Locator;
  readonly viewSimulationButton: Locator;
  readonly writeChronicleButton: Locator;
  readonly readChronicleButton: Locator;
  readonly shotStatsPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backToMatchesLink = page.locator(".match-detail-back");
    this.matchDetailCard = page.locator(".match-detail-card");
    this.actionsPanel = page.locator(".match-actions-panel");
    this.simulateButton = this.actionsPanel.locator(
      "button.match-action-btn.primary"
    );
    this.viewSimulationButton = this.actionsPanel.getByRole("button", {
      name: /simulation|simulaci/i,
    });
    this.writeChronicleButton = this.actionsPanel.getByRole("button", {
      name: /write|escribir/i,
    });
    this.readChronicleButton = this.actionsPanel.getByRole("button", {
      name: /read|leer/i,
    });
    this.shotStatsPanel = page.locator(".shot-stats-panel");
  }

  async goto(matchId: string) {
    await this.page.goto(`/match/${matchId}`);
  }

  async gotoCanonical(match: CanonicalMatchRoute) {
    const href =
      buildCanonicalMatchHref(match, match.backUrl ? { back: match.backUrl } : undefined) ??
      `/match/${match.id}`;
    await this.page.goto(href);
  }

  async simulateMatch() {
    await this.simulateButton.click();
    await expect(this.simulateButton).not.toBeVisible({ timeout: 60_000 });
  }

  async navigateToSimulation() {
    await this.viewSimulationButton.click();
  }

  async writeChronicle() {
    await this.writeChronicleButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToChronicle() {
    await this.readChronicleButton.click();
  }
}
