import { SimulationPlayerStat } from "./simulation.types";
import { ScoreDistributionItem } from "../value-objects/score-distribution-item.value";
import { MomentumPoint } from "../value-objects/momentum-point.value";

export class Simulation {
  constructor(
    readonly id: string,
    readonly matchId: string,
    readonly homeWinProbability: number,
    readonly drawProbability: number,
    readonly awayWinProbability: number,
    readonly xPtsHome: number,
    readonly xPtsAway: number,
    readonly scoreDistribution: ScoreDistributionItem[],
    readonly playerStats: SimulationPlayerStat[],
    readonly momentumTimeline: MomentumPoint[],
    readonly createdAt: Date
  ) {}

  static computeXPts(winProbability: number, drawProbability: number): number {
    return winProbability * 3 + drawProbability;
  }

  topScoringPlayer(): SimulationPlayerStat | null {
    if (this.playerStats.length === 0) return null;
    return this.playerStats.reduce(
      (best, current) =>
        current.goalProbability > best!.goalProbability ? current : best,
      this.playerStats[0]
    )!;
  }

  mostLikelyScore(): ScoreDistributionItem | null {
    return this.scoreDistribution[0] ?? null;
  }
}
