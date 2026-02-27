export interface PlayerShotStatsResult {
  playerName: string;
  playerShortName: string;
  isHome: boolean;
  shots: number;
  goals: number;
  totalXg: number;
  totalXgot: number;
}

export interface GoalkeeperShotStatsResult {
  goalkeeperName: string;
  goalkeeperShortName: string;
  isHome: boolean;
  xgotFaced: number;
  goalsConceded: number;
  saves: number;
}

export interface ShotMatchStatsResult {
  homeXg: number;
  awayXg: number;
  homeGoals: number;
  awayGoals: number;
  playerStats: PlayerShotStatsResult[];
  goalkeeperStats: GoalkeeperShotStatsResult[];
}
