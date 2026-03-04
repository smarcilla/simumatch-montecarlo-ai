import { describe, it, expect } from "vitest";
import { MonteCarloSimulatorService } from "@/domain/services/montecarlo-simulator.service";
import { Simulation } from "@/domain/entities/simulation.entity";
import { Shot } from "@/domain/entities/shot.entity";
import { Player } from "@/domain/entities/player.entity";
import { ShotType } from "@/domain/value-objects/shot-type.value";
import { ShotSituation } from "@/domain/value-objects/shot-situation.value";
import { BodyPart } from "@/domain/value-objects/body-part.value";

function makePlayer(id: string, name: string, shortName: string): Player {
  return new Player(
    id,
    Number.parseInt(id),
    name,
    `${name}-slug`,
    shortName,
    "forward",
    "9"
  );
}

function makeShot(
  id: string,
  matchId: string,
  isHome: boolean,
  xg: number,
  xgot: number,
  timeSeconds: number,
  player: Player
): Shot {
  return new Shot(
    id,
    Number.parseInt(id),
    xg,
    xgot,
    isHome,
    ShotType.create("save"),
    ShotSituation.create("regular"),
    BodyPart.create("right-foot"),
    timeSeconds,
    player,
    null,
    matchId
  );
}

const playerA = makePlayer("1", "Lionel Messi", "Messi");
const playerB = makePlayer("2", "Vinicius Jr", "Vinicius");

describe("MonteCarloSimulatorService", () => {
  const service = new MonteCarloSimulatorService();

  it("should return a Simulation entity", () => {
    const shots = [makeShot("1", "m1", true, 0.4, 0.5, 600, playerA)];
    const result = service.simulate("m1", shots);
    expect(result).toBeInstanceOf(Simulation);
    expect(result.matchId).toBe("m1");
    expect(result.homeWinProbability).toBeDefined();
    expect(result.drawProbability).toBeDefined();
    expect(result.awayWinProbability).toBeDefined();
    expect(result.xPtsHome).toBeDefined();
    expect(result.xPtsAway).toBeDefined();
    expect(result.scoreDistribution).toBeInstanceOf(Array);
    expect(result.playerStats).toBeInstanceOf(Array);
    expect(result.momentumTimeline).toBeInstanceOf(Array);
  });

  it("should return probabilities that sum to 1 for a non-empty shot list", () => {
    const shots = [
      makeShot("1", "m1", true, 0.4, 0.5, 600, playerA),
      makeShot("2", "m1", false, 0.3, 0.4, 1200, playerB),
    ];

    const result = service.simulate("m1", shots);

    const total =
      result.homeWinProbability +
      result.drawProbability +
      result.awayWinProbability;
    expect(total).toBeCloseTo(1, 1);
  });

  it("should return probabilities between 0 and 1", () => {
    const shots = [
      makeShot("1", "m1", true, 0.6, 0.7, 300, playerA),
      makeShot("2", "m1", false, 0.1, 0.2, 900, playerB),
    ];

    const result = service.simulate("m1", shots);

    expect(result.homeWinProbability).toBeGreaterThanOrEqual(0);
    expect(result.homeWinProbability).toBeLessThanOrEqual(1);
    expect(result.drawProbability).toBeGreaterThanOrEqual(0);
    expect(result.drawProbability).toBeLessThanOrEqual(1);
    expect(result.awayWinProbability).toBeGreaterThanOrEqual(0);
    expect(result.awayWinProbability).toBeLessThanOrEqual(1);
  });

  it("should return xPts values between 0 and 3", () => {
    const shots = [
      makeShot("1", "m1", true, 0.5, 0.6, 600, playerA),
      makeShot("2", "m1", false, 0.2, 0.3, 1200, playerB),
    ];

    const result = service.simulate("m1", shots);

    expect(result.xPtsHome).toBeGreaterThanOrEqual(0);
    expect(result.xPtsHome).toBeLessThanOrEqual(3);
    expect(result.xPtsAway).toBeGreaterThanOrEqual(0);
    expect(result.xPtsAway).toBeLessThanOrEqual(3);
  });

  it("should compute xPts using Simulation.computeXPts", () => {
    const shots = [makeShot("1", "m1", true, 0.5, 0.6, 600, playerA)];
    const result = service.simulate("m1", shots);
    const expectedHome = Simulation.computeXPts(
      result.homeWinProbability,
      result.drawProbability
    );
    expect(result.xPtsHome).toBeCloseTo(expectedHome, 5);
  });

  it("should return at most 10 score distribution entries", () => {
    const shots = [
      makeShot("1", "m1", true, 0.3, 0.4, 600, playerA),
      makeShot("2", "m1", false, 0.3, 0.4, 1200, playerB),
      makeShot("3", "m1", true, 0.2, 0.3, 1800, playerA),
      makeShot("4", "m1", false, 0.1, 0.2, 2400, playerB),
      makeShot("5", "m1", true, 0.4, 0.5, 3000, playerA),
      makeShot("6", "m1", false, 0.2, 0.3, 3600, playerB),
      makeShot("7", "m1", true, 0.3, 0.4, 4200, playerA),
      makeShot("8", "m1", false, 0.2, 0.3, 4800, playerB),
      makeShot("9", "m1", true, 0.5, 0.6, 5400, playerA),
      makeShot("10", "m1", false, 0.3, 0.4, 6000, playerB),
      makeShot("11", "m1", true, 0.2, 0.3, 6600, playerA),
    ];

    const result = service.simulate("m1", shots);

    expect(result.scoreDistribution.length).toBeLessThanOrEqual(10);
  });

  it("should return one momentum point per shot ordered by time", () => {
    const shots = [
      makeShot("3", "m1", true, 0.4, 0.5, 1800, playerA),
      makeShot("4", "m1", false, 0.1, 0.2, 2400, playerB),
      makeShot("1", "m1", true, 0.3, 0.4, 600, playerA),
      makeShot("2", "m1", false, 0.2, 0.3, 1200, playerB),
    ];

    const result = service.simulate("m1", shots);

    expect(result.momentumTimeline).toHaveLength(shots.length);
    expect(result.momentumTimeline[0]!.minute).toBeLessThanOrEqual(
      result.momentumTimeline[1]!.minute
    );
  });

  it("should compute SGA correctly for each player", () => {
    const xg = 0.3;
    const xgot = 0.5;
    const shots = [makeShot("1", "m1", true, xg, xgot, 600, playerA)];

    const result = service.simulate("m1", shots);

    const stat = result.playerStats.find((p) => p.playerId === playerA.id);
    expect(stat).toBeDefined();
    expect(stat!.sga).toBeCloseTo(xgot - xg, 5);
    expect(stat!.isHome).toBe(true);
  });

  it("should expose topScoringPlayer from the returned Simulation", () => {
    const shots = [
      makeShot("1", "m1", true, 0.8, 0.9, 600, playerA),
      makeShot("2", "m1", false, 0.7, 0.2, 1200, playerB),
    ];
    const result = service.simulate("m1", shots);
    const top = result.topScoringPlayer();
    expect(top).not.toBeNull();
    expect(top!.playerId).toBe(playerA.id);
  });

  it("should return a 0-0 score entry and no player or momentum data for empty shot list", () => {
    const result = service.simulate("m1", []);

    expect(result.scoreDistribution).toHaveLength(1);
    expect(result.scoreDistribution[0]!.home).toBe(0);
    expect(result.scoreDistribution[0]!.away).toBe(0);
    expect(result.playerStats).toHaveLength(0);
    expect(result.momentumTimeline).toHaveLength(0);
    expect(result.homeWinProbability).toBeCloseTo(0, 1);
    expect(result.drawProbability).toBeCloseTo(1, 1);
    expect(result.awayWinProbability).toBeCloseTo(0, 1);
  });
});
