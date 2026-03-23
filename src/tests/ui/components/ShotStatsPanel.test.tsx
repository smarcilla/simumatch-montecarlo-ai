// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, vi, beforeEach } from "vitest";
import { ShotStatsPanel } from "@/infrastructure/ui/components/ShotStatsPanel";
import { ShotMatchStatsResult } from "@/application/results/shot-match-stats.result";

vi.mock("next-intl/server", () => ({
  getTranslations: () => Promise.resolve((key: string) => key),
}));

vi.mock("@/infrastructure/ui/components/ShotXgBar", () => ({
  ShotXgBar: (props: Record<string, unknown>) => (
    <div
      data-testid="shot-xg-bar"
      data-home-xg={props.homeXg}
      data-away-xg={props.awayXg}
    />
  ),
}));

vi.mock("@/infrastructure/ui/components/ShotPlayerStatsTable", () => ({
  ShotPlayerStatsTable: (props: Record<string, unknown>) => (
    <div
      data-testid="player-stats-table"
      data-count={(props.playerStats as unknown[]).length}
    />
  ),
}));

vi.mock("@/infrastructure/ui/components/ShotGoalkeeperStatsTable", () => ({
  ShotGoalkeeperStatsTable: (props: Record<string, unknown>) => (
    <div
      data-testid="goalkeeper-stats-table"
      data-count={(props.goalkeeperStats as unknown[]).length}
    />
  ),
}));

const baseProps = {
  homeTeam: "Barcelona",
  awayTeam: "Madrid",
  homeColor: "#A50044",
  awayColor: "#FFFFFF",
  homeColorSecondary: "#004D98",
  awayColorSecondary: "#000000",
};

function buildStats(
  overrides: Partial<ShotMatchStatsResult> = {}
): ShotMatchStatsResult {
  return {
    homeXg: 1.5,
    awayXg: 0.8,
    homeGoals: 2,
    awayGoals: 1,
    playerStats: [],
    goalkeeperStats: [],
    ...overrides,
  };
}

describe("ShotStatsPanel", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the stats title", async () => {
    const jsx = await ShotStatsPanel({ ...baseProps, stats: buildStats() });
    render(jsx);
    expect(screen.getByText("title")).toBeDefined();
  });

  it("should render the ShotXgBar with correct data", async () => {
    const jsx = await ShotStatsPanel({
      ...baseProps,
      stats: buildStats({ homeXg: 2.3, awayXg: 0.5 }),
    });
    render(jsx);
    const xgBar = screen.getByTestId("shot-xg-bar");
    expect(xgBar.dataset.homeXg).toBe("2.3");
    expect(xgBar.dataset.awayXg).toBe("0.5");
  });

  it("should render ShotPlayerStatsTable when playerStats is not empty", async () => {
    const jsx = await ShotStatsPanel({
      ...baseProps,
      stats: buildStats({
        playerStats: [
          {
            playerName: "Messi",
            playerShortName: "Messi",
            isHome: true,
            shots: 3,
            goals: 1,
            totalXg: 0.8,
            totalXgot: 0.6,
          },
        ],
      }),
    });
    render(jsx);
    expect(screen.getByTestId("player-stats-table")).toBeDefined();
  });

  it("should not render ShotPlayerStatsTable when playerStats is empty", async () => {
    const jsx = await ShotStatsPanel({
      ...baseProps,
      stats: buildStats({ playerStats: [] }),
    });
    render(jsx);
    expect(screen.queryByTestId("player-stats-table")).toBeNull();
  });

  it("should render ShotGoalkeeperStatsTable when goalkeeperStats is not empty", async () => {
    const jsx = await ShotStatsPanel({
      ...baseProps,
      stats: buildStats({
        goalkeeperStats: [
          {
            goalkeeperName: "Courtois",
            goalkeeperShortName: "Courtois",
            isHome: false,
            xgotFaced: 1.2,
            goalsConceded: 1,
            saves: 3,
          },
        ],
      }),
    });
    render(jsx);
    expect(screen.getByTestId("goalkeeper-stats-table")).toBeDefined();
  });

  it("should not render ShotGoalkeeperStatsTable when goalkeeperStats is empty", async () => {
    const jsx = await ShotStatsPanel({
      ...baseProps,
      stats: buildStats({ goalkeeperStats: [] }),
    });
    render(jsx);
    expect(screen.queryByTestId("goalkeeper-stats-table")).toBeNull();
  });
});
