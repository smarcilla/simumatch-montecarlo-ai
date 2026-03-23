import { FindSimulationByMatchIdUseCase } from "@/application/use-cases/find-simulation-by-match-id.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
  buildSimulation,
} from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("FindSimulationByMatchIdUseCase", () => {
  let useCase: FindSimulationByMatchIdUseCase;

  beforeEach(async () => {
    useCase = await DIContainer.getFindSimulationByMatchIdUseCase();
  });

  it("should return simulation result when it exists", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);
    await buildSimulation(match._id, {
      homeWinProbability: 0.6,
      drawProbability: 0.25,
      awayWinProbability: 0.15,
      xPtsHome: 2.05,
      xPtsAway: 0.7,
    });

    const result = await useCase.execute(match._id.toString());

    expect(result).not.toBeNull();
    expect(result!.matchId).toBe(match._id.toString());
    expect(result!.homeWinProbability).toBe(0.6);
    expect(result!.drawProbability).toBe(0.25);
    expect(result!.awayWinProbability).toBe(0.15);
    expect(result!.xPtsHome).toBe(2.05);
    expect(result!.xPtsAway).toBe(0.7);
  });

  it("should return null when simulation does not exist", async () => {
    const result = await useCase.execute("507f1f77bcf86cd799439011");

    expect(result).toBeNull();
  });

  it("should map scoreDistribution correctly", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);
    await buildSimulation(match._id, {
      scoreDistribution: [
        { home: 1, away: 0, count: 300, percentage: 30 },
        { home: 0, away: 0, count: 200, percentage: 20 },
      ],
    });

    const result = await useCase.execute(match._id.toString());

    expect(result).not.toBeNull();
    expect(result!.scoreDistribution).toHaveLength(2);
    expect(result!.scoreDistribution[0]).toEqual({
      home: 1,
      away: 0,
      count: 300,
      percentage: 30,
    });
    expect(result!.scoreDistribution[1]).toEqual({
      home: 0,
      away: 0,
      count: 200,
      percentage: 20,
    });
  });

  it("should map momentumTimeline correctly", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);
    await buildSimulation(match._id, {
      momentumTimeline: [
        {
          minute: 15,
          homeWinProbability: 0.4,
          drawProbability: 0.35,
          awayWinProbability: 0.25,
        },
        {
          minute: 45,
          homeWinProbability: 0.55,
          drawProbability: 0.25,
          awayWinProbability: 0.2,
        },
      ],
    });

    const result = await useCase.execute(match._id.toString());

    expect(result).not.toBeNull();
    expect(result!.momentumTimeline).toHaveLength(2);
    expect(result!.momentumTimeline[0]).toEqual({
      minute: 15,
      homeWinProbability: 0.4,
      drawProbability: 0.35,
      awayWinProbability: 0.25,
    });
    expect(result!.momentumTimeline[1]).toEqual({
      minute: 45,
      homeWinProbability: 0.55,
      drawProbability: 0.25,
      awayWinProbability: 0.2,
    });
  });
});
