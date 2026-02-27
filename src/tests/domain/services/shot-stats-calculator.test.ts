import { describe, it, expect } from "vitest";
import { ShotStatsCalculator } from "@/domain/services/shot-stats-calculator";
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

interface MakeShotParams {
  id: string;
  matchId: string;
  isHome: boolean;
  shotType: string;
  situation: string;
  xg: number;
  xgot: number;
  player: Player;
  goalkeeper?: Player | null;
}

function makeShot(params: MakeShotParams): Shot {
  return new Shot(
    params.id,
    Number.parseInt(params.id),
    params.xg,
    params.xgot,
    params.isHome,
    ShotType.create(params.shotType),
    ShotSituation.create(params.situation),
    BodyPart.create("right-foot"),
    600,
    params.player,
    params.goalkeeper || null,
    params.matchId
  );
}

const playerA = makePlayer("1", "Lionel Messi", "Messi");
const playerB = makePlayer("2", "Vinicius Jr", "Vinicius");
const gkHome = makePlayer("10", "Ter Stegen", "Ter Stegen");
const gkAway = makePlayer("11", "Courtois", "Courtois");

describe("ShotStatsCalculator", () => {
  it("should return zero stats for empty shots array", () => {
    const stats = ShotStatsCalculator.compute([]);
    expect(stats.homeXg).toBe(0);
    expect(stats.awayXg).toBe(0);
    expect(stats.homeGoals).toBe(0);
    expect(stats.awayGoals).toBe(0);
    expect(stats.playerStats).toHaveLength(0);
    expect(stats.goalkeeperStats).toHaveLength(0);
  });

  it("should correctly sum xG per team", () => {
    const shots = [
      makeShot({
        id: "1",
        matchId: "m1",
        isHome: true,
        shotType: "goal",
        situation: "regular",
        xg: 0.7,
        xgot: 0.8,
        player: playerA,
        goalkeeper: gkAway,
      }),
      makeShot({
        id: "2",
        matchId: "m1",
        isHome: true,
        shotType: "miss",
        situation: "regular",
        xg: 0.3,
        xgot: 0,
        player: playerA,
      }),
      makeShot({
        id: "3",
        matchId: "m1",
        isHome: false,
        shotType: "save",
        situation: "regular",
        xg: 0.5,
        xgot: 0.6,
        player: playerB,
        goalkeeper: gkHome,
      }),
    ];
    const stats = ShotStatsCalculator.compute(shots);
    expect(stats.homeXg).toBe(1);
    expect(stats.awayXg).toBe(0.5);
  });

  it("should count home and away goals correctly", () => {
    const shots = [
      makeShot({
        id: "1",
        matchId: "m1",
        isHome: true,
        shotType: "goal",
        situation: "regular",
        xg: 0.7,
        xgot: 0.9,
        player: playerA,
        goalkeeper: gkAway,
      }),
      makeShot({
        id: "2",
        matchId: "m1",
        isHome: true,
        shotType: "goal",
        situation: "penalty",
        xg: 0.76,
        xgot: 0.92,
        player: playerA,
        goalkeeper: gkAway,
      }),
      makeShot({
        id: "3",
        matchId: "m1",
        isHome: false,
        shotType: "goal",
        situation: "regular",
        xg: 0.5,
        xgot: 0.7,
        player: playerB,
        goalkeeper: gkHome,
      }),
    ];
    const stats = ShotStatsCalculator.compute(shots);
    expect(stats.homeGoals).toBe(2);
    expect(stats.awayGoals).toBe(1);
  });

  it("should aggregate shots and xG correctly per player", () => {
    const shots = [
      makeShot({
        id: "1",
        matchId: "m1",
        isHome: true,
        shotType: "goal",
        situation: "regular",
        xg: 0.7,
        xgot: 0.8,
        player: playerA,
        goalkeeper: gkAway,
      }),
      makeShot({
        id: "2",
        matchId: "m1",
        isHome: true,
        shotType: "miss",
        situation: "regular",
        xg: 0.2,
        xgot: 0,
        player: playerA,
      }),
      makeShot({
        id: "3",
        matchId: "m1",
        isHome: false,
        shotType: "save",
        situation: "regular",
        xg: 0.4,
        xgot: 0.5,
        player: playerB,
        goalkeeper: gkHome,
      }),
    ];
    const stats = ShotStatsCalculator.compute(shots);
    const messiStats = stats.playerStats.find(
      (p) => p.playerName === "Lionel Messi"
    );
    expect(messiStats).toBeDefined();
    expect(messiStats!.shots).toBe(2);
    expect(messiStats!.goals).toBe(1);
    expect(messiStats!.totalXg).toBeCloseTo(0.9);
  });

  it("should only count goalkeeper stats for on-target shots", () => {
    const shots = [
      makeShot({
        id: "1",
        matchId: "m1",
        isHome: true,
        shotType: "goal",
        situation: "regular",
        xg: 0.7,
        xgot: 0.9,
        player: playerA,
        goalkeeper: gkAway,
      }),
      makeShot({
        id: "2",
        matchId: "m1",
        isHome: true,
        shotType: "save",
        situation: "regular",
        xg: 0.4,
        xgot: 0.6,
        player: playerA,
        goalkeeper: gkAway,
      }),
      makeShot({
        id: "3",
        matchId: "m1",
        isHome: true,
        shotType: "miss",
        situation: "regular",
        xg: 0.1,
        xgot: 0,
        player: playerA,
        goalkeeper: gkAway,
      }),
      makeShot({
        id: "4",
        matchId: "m1",
        isHome: true,
        shotType: "block",
        situation: "regular",
        xg: 0.2,
        xgot: 0,
        player: playerA,
        goalkeeper: gkAway,
      }),
    ];
    const stats = ShotStatsCalculator.compute(shots);
    const courtoisStats = stats.goalkeeperStats.find(
      (gk) => gk.goalkeeperName === "Courtois"
    );
    expect(courtoisStats).toBeDefined();
    expect(courtoisStats!.xgotFaced).toBeCloseTo(0.9 + 0.6);
    expect(courtoisStats!.goalsConceded).toBe(1);
    expect(courtoisStats!.saves).toBe(1);
  });

  it("should not include goalkeeper stats if no shots on target", () => {
    const shots = [
      makeShot({
        id: "1",
        matchId: "m1",
        isHome: true,
        shotType: "miss",
        situation: "regular",
        xg: 0.1,
        xgot: 0,
        player: playerA,
        goalkeeper: gkAway,
      }),
      makeShot({
        id: "2",
        matchId: "m1",
        isHome: true,
        shotType: "block",
        situation: "regular",
        xg: 0.15,
        xgot: 0,
        player: playerA,
        goalkeeper: gkAway,
      }),
    ];
    const stats = ShotStatsCalculator.compute(shots);
    expect(stats.goalkeeperStats).toHaveLength(0);
  });

  it("should identify goalkeeper as opponent team (isHome = !isHome of shot)", () => {
    const shots = [
      makeShot({
        id: "1",
        matchId: "m1",
        isHome: true,
        shotType: "save",
        situation: "regular",
        xg: 0.4,
        xgot: 0.6,
        player: playerA,
        goalkeeper: gkAway,
      }),
    ];
    const stats = ShotStatsCalculator.compute(shots);
    const gkStats = stats.goalkeeperStats[0];
    expect(gkStats).toBeDefined();
    expect(gkStats!.isHome).toBe(false);
  });

  it("should round homeXg and awayXg to 2 decimal places", () => {
    const shots = [
      makeShot({
        id: "1",
        matchId: "m1",
        isHome: true,
        shotType: "goal",
        situation: "regular",
        xg: 0.123,
        xgot: 0.2,
        player: playerA,
      }),
      makeShot({
        id: "2",
        matchId: "m1",
        isHome: true,
        shotType: "miss",
        situation: "regular",
        xg: 0.456,
        xgot: 0,
        player: playerA,
      }),
    ];
    const stats = ShotStatsCalculator.compute(shots);
    expect(stats.homeXg).toBe(0.58);
  });
});
