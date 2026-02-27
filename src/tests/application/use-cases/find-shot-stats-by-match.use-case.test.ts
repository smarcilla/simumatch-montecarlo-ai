import { FindShotStatsByMatchUseCase } from "@/application/use-cases/find-shot-stats-by-match.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeAll, describe, expect, it } from "vitest";

const MATCH_ID = "match-la-liga-id-season-22-23-0";

describe("FindShotStatsByMatchUseCase", () => {
  let useCase: FindShotStatsByMatchUseCase;

  beforeAll(async () => {
    useCase = await DIContainer.getFindShotStatsByMatchUseCase();
  });

  it("should return stats for a match", async () => {
    const stats = await useCase.execute(MATCH_ID);
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("homeXg");
    expect(stats).toHaveProperty("awayXg");
    expect(stats).toHaveProperty("homeGoals");
    expect(stats).toHaveProperty("awayGoals");
    expect(stats).toHaveProperty("playerStats");
    expect(stats).toHaveProperty("goalkeeperStats");
  });

  it("should have non-negative xG values", async () => {
    const stats = await useCase.execute(MATCH_ID);
    expect(stats.homeXg).toBeGreaterThanOrEqual(0);
    expect(stats.awayXg).toBeGreaterThanOrEqual(0);
  });

  it("should correctly count goals", async () => {
    const stats = await useCase.execute(MATCH_ID);
    expect(stats.homeGoals).toBeGreaterThanOrEqual(0);
    expect(stats.awayGoals).toBeGreaterThanOrEqual(0);
  });

  it("should return player stats with expected fields", async () => {
    const stats = await useCase.execute(MATCH_ID);
    expect(stats.playerStats.length).toBeGreaterThan(0);
    const player = stats.playerStats[0];
    expect(player).toHaveProperty("playerName");
    expect(player).toHaveProperty("playerShortName");
    expect(player).toHaveProperty("isHome");
    expect(player).toHaveProperty("shots");
    expect(player).toHaveProperty("goals");
    expect(player).toHaveProperty("totalXg");
    expect(player).toHaveProperty("totalXgot");
  });

  it("should return goalkeeper stats with expected fields when data exists", async () => {
    const stats = await useCase.execute(MATCH_ID);
    if (stats.goalkeeperStats.length > 0) {
      const gk = stats.goalkeeperStats[0];
      expect(gk).toHaveProperty("goalkeeperName");
      expect(gk).toHaveProperty("goalkeeperShortName");
      expect(gk).toHaveProperty("isHome");
      expect(gk).toHaveProperty("xgotFaced");
      expect(gk).toHaveProperty("goalsConceded");
      expect(gk).toHaveProperty("saves");
    }
  });

  it("should return empty stats for unknown match", async () => {
    const stats = await useCase.execute("non-existent-match");
    expect(stats.homeXg).toBe(0);
    expect(stats.awayXg).toBe(0);
    expect(stats.homeGoals).toBe(0);
    expect(stats.awayGoals).toBe(0);
    expect(stats.playerStats).toHaveLength(0);
    expect(stats.goalkeeperStats).toHaveLength(0);
  });

  it("should delegate calculation to domain service (homeXg matches sum of home shot xG)", async () => {
    const stats = await useCase.execute(MATCH_ID);
    const allShots =
      await DIContainer.getShotRepository().findAllByMatchId(MATCH_ID);
    const expectedHomeXg = allShots
      .filter((s) => s.isHome)
      .reduce((acc, s) => acc + s.xg, 0);
    expect(stats.homeXg).toBeCloseTo(Math.round(expectedHomeXg * 100) / 100, 5);
  });
});
