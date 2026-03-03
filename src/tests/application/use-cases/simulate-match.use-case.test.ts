import { SimulateMatchUseCase } from "@/application/use-cases/simulate-match.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
  buildShots,
} from "@/tests/helpers/builders";

describe("SimulateMatchUseCase", () => {
  let useCase: SimulateMatchUseCase;
  let matchId: string;

  beforeEach(async () => {
    useCase = await DIContainer.getSimulateMatchUseCase();
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
    await buildShots(match._id, 20);
    matchId = match._id.toString();
  });

  it("should return a simulation result with expected fields", async () => {
    const result = await useCase.execute(matchId);

    expect(result.matchId).toBe(matchId);
    expect(result).toHaveProperty("homeWinProbability");
    expect(result).toHaveProperty("drawProbability");
    expect(result).toHaveProperty("awayWinProbability");
    expect(result).toHaveProperty("xPtsHome");
    expect(result).toHaveProperty("xPtsAway");
    expect(result).toHaveProperty("scoreDistribution");
    expect(result).toHaveProperty("playerStats");
    expect(result).toHaveProperty("momentumTimeline");
    expect(result).toHaveProperty("createdAt");
  });

  it("should return probabilities that sum to 1", async () => {
    const result = await useCase.execute(matchId);
    const total =
      result.homeWinProbability +
      result.drawProbability +
      result.awayWinProbability;
    expect(total).toBeCloseTo(1, 1);
  });

  it("should return probabilities within valid range", async () => {
    const result = await useCase.execute(matchId);
    expect(result.homeWinProbability).toBeGreaterThanOrEqual(0);
    expect(result.homeWinProbability).toBeLessThanOrEqual(1);
    expect(result.drawProbability).toBeGreaterThanOrEqual(0);
    expect(result.drawProbability).toBeLessThanOrEqual(1);
    expect(result.awayWinProbability).toBeGreaterThanOrEqual(0);
    expect(result.awayWinProbability).toBeLessThanOrEqual(1);
  });

  it("should persist the simulation so it can be retrieved", async () => {
    await useCase.execute(matchId);
    const saved =
      await DIContainer.getSimulationRepository().findByMatchId(matchId);
    expect(saved).not.toBeNull();
    expect(saved!.matchId).toBe(matchId);
  });

  it("should overwrite an existing simulation on re-execution", async () => {
    await useCase.execute(matchId);
    await useCase.execute(matchId);
    const saved =
      await DIContainer.getSimulationRepository().findByMatchId(matchId);
    expect(saved).not.toBeNull();
  });

  it("should return score distribution with valid structure", async () => {
    const result = await useCase.execute(matchId);
    expect(result.scoreDistribution.length).toBeGreaterThan(0);
    result.scoreDistribution.forEach((item) => {
      expect(item.home).toBeGreaterThanOrEqual(0);
      expect(item.away).toBeGreaterThanOrEqual(0);
      expect(item.percentage).toBeGreaterThanOrEqual(0);
      expect(item.percentage).toBeLessThanOrEqual(100);
    });
  });

  it("should return player stats for all shot takers", async () => {
    const result = await useCase.execute(matchId);
    expect(result.playerStats.length).toBeGreaterThan(0);
    result.playerStats.forEach((ps) => {
      expect(ps).toHaveProperty("playerId");
      expect(ps).toHaveProperty("playerName");
      expect(ps.goalProbability).toBeGreaterThanOrEqual(0);
      expect(ps.goalProbability).toBeLessThanOrEqual(100);
    });
  });
});
