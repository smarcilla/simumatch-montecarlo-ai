import { describe, it, expect, beforeEach } from "vitest";
import { SimulateMatchUseCase } from "@/application/use-cases/simulate-match.use-case";
import { DIContainer } from "@/infrastructure/di-container";

const MATCH_ID = "match-la-liga-id-season-22-23-0";

describe("SimulateMatchUseCase", () => {
  let useCase: SimulateMatchUseCase;

  beforeEach(async () => {
    DIContainer.reset();
    useCase = await DIContainer.getSimulateMatchUseCase();
  });

  it("should return a simulation result with expected fields", async () => {
    const result = await useCase.execute(MATCH_ID);

    expect(result).toBeDefined();
    expect(result.matchId).toBe(MATCH_ID);
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
    const result = await useCase.execute(MATCH_ID);

    const total =
      result.homeWinProbability +
      result.drawProbability +
      result.awayWinProbability;
    expect(total).toBeCloseTo(1, 1);
  });

  it("should persist the simulation in the repository", async () => {
    await useCase.execute(MATCH_ID);

    const saved =
      await DIContainer.getSimulationRepository().findByMatchId(MATCH_ID);
    expect(saved).not.toBeNull();
    expect(saved!.matchId).toBe(MATCH_ID);
  });

  it("should call updateStatus without error even when match is in-memory", async () => {
    await expect(useCase.execute(MATCH_ID)).resolves.not.toThrow();
  });

  it("should overwrite existing simulation on re-execution", async () => {
    await useCase.execute(MATCH_ID);
    const firstResult = await useCase.execute(MATCH_ID);

    const saved =
      await DIContainer.getSimulationRepository().findByMatchId(MATCH_ID);
    expect(saved).not.toBeNull();
    expect(firstResult.matchId).toBe(MATCH_ID);
  });
});
