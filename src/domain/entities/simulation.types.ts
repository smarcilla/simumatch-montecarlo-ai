export interface SimulationPlayerStat {
  playerId: string;
  playerName: string;
  playerShortName: string;
  isHome: boolean;
  goalProbability: number;
  sga: number;
}

export interface ScoreDistributionItemData {
  home: number;
  away: number;
  count: number;
  percentage: number;
}

export interface MomentumPointData {
  minute: number;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
}
