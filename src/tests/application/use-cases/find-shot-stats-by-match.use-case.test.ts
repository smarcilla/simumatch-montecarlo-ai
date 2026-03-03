import { FindShotStatsByMatchUseCase } from "@/application/use-cases/find-shot-stats-by-match.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import { Types } from "mongoose";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
  buildPlayer,
  buildShot,
} from "@/tests/helpers/builders";

describe("FindShotStatsByMatchUseCase", () => {
  let useCase: FindShotStatsByMatchUseCase;

  beforeEach(async () => {
    useCase = await DIContainer.getFindShotStatsByMatchUseCase();
  });

  it("should aggregate xG totals per team from shots", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    const match = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id
    );
    const p1 = await buildPlayer();
    const p2 = await buildPlayer();
    await buildShot(match._id, p1._id, { isHome: true, xg: 0.3, xgot: 0.2 });
    await buildShot(match._id, p1._id, { isHome: true, xg: 0.2, xgot: 0.1 });
    await buildShot(match._id, p2._id, { isHome: false, xg: 0.4, xgot: 0.3 });

    const stats = await useCase.execute(match._id.toString());

    expect(stats.homeXg).toBeCloseTo(0.5, 5);
    expect(stats.awayXg).toBeCloseTo(0.4, 5);
    expect(stats.homeXg).toBeGreaterThanOrEqual(0);
    expect(stats.awayXg).toBeGreaterThanOrEqual(0);
  });

  it("should count goals by shot type", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    const match = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id
    );
    const p1 = await buildPlayer();
    const p2 = await buildPlayer();
    await buildShot(match._id, p1._id, { isHome: true, shotType: "goal" });
    await buildShot(match._id, p1._id, { isHome: true, shotType: "save" });
    await buildShot(match._id, p2._id, { isHome: false, shotType: "goal" });

    const stats = await useCase.execute(match._id.toString());

    expect(stats.homeGoals).toBe(1);
    expect(stats.awayGoals).toBe(1);
  });

  it("should return player stats with expected fields", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    const match = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id
    );
    const player = await buildPlayer();
    await buildShot(match._id, player._id, { isHome: true });

    const stats = await useCase.execute(match._id.toString());

    expect(stats.playerStats.length).toBeGreaterThan(0);
    const ps = stats.playerStats[0];
    expect(ps).toHaveProperty("playerName");
    expect(ps).toHaveProperty("playerShortName");
    expect(ps).toHaveProperty("isHome");
    expect(ps).toHaveProperty("shots");
    expect(ps).toHaveProperty("goals");
    expect(ps).toHaveProperty("totalXg");
    expect(ps).toHaveProperty("totalXgot");
  });

  it("should return empty stats for a match with no shots", async () => {
    const stats = await useCase.execute(new Types.ObjectId().toString());
    expect(stats.homeXg).toBe(0);
    expect(stats.awayXg).toBe(0);
    expect(stats.homeGoals).toBe(0);
    expect(stats.awayGoals).toBe(0);
    expect(stats.playerStats).toHaveLength(0);
    expect(stats.goalkeeperStats).toHaveLength(0);
  });
});
