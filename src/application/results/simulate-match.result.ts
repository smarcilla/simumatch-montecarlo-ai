import {
  MomentumPointData,
  ScoreDistributionItemData,
  SimulationPlayerStat,
} from "@/domain/entities/simulation.types";

export interface SimulateMatchResult {
  id: string;
  matchId: string;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  xPtsHome: number;
  xPtsAway: number;
  scoreDistribution: ScoreDistributionItemData[];
  playerStats: SimulationPlayerStat[];
  momentumTimeline: MomentumPointData[];
  createdAt: Date;
}
