import { Shot } from "../entities/shot.entity";

export interface PlayerShotStats {
  playerId: string;
  playerName: string;
  playerShortName: string;
  isHome: boolean;
  shots: number;
  goals: number;
  totalXg: number;
  totalXgot: number;
}

function createPlayerShotStats(shot: Shot): PlayerShotStats {
  return {
    playerId: shot.player.id,
    playerName: shot.player.name,
    playerShortName: shot.player.shortName,
    isHome: shot.isHome,
    shots: 1,
    goals: shot.isGoal() ? 1 : 0,
    totalXg: shot.xg,
    totalXgot: shot.xgot,
  };
}

export interface GoalkeeperShotStats {
  goalkeeperName: string;
  goalkeeperShortName: string;
  isHome: boolean;
  xgotFaced: number;
  goalsConceded: number;
  saves: number;
}

function createGoalKeeperShotStats(
  shot: Shot,
  isHome: boolean
): GoalkeeperShotStats {
  return {
    goalkeeperName: shot.goalkeeper!.name,
    goalkeeperShortName: shot.goalkeeper!.shortName,
    isHome: !isHome,
    xgotFaced: shot.xgot,
    goalsConceded: shot.isGoal() ? 1 : 0,
    saves: shot.isSave() ? 1 : 0,
  };
}

export interface ShotMatchStats {
  homeXg: number;
  awayXg: number;
  homeGoals: number;
  awayGoals: number;
  playerStats: PlayerShotStats[];
  goalkeeperStats: GoalkeeperShotStats[];
}

export class ShotStatsCalculator {
  compute(shots: Shot[]): ShotMatchStats {
    let homeXg = 0;
    let awayXg = 0;
    let homeGoals = 0;
    let awayGoals = 0;

    const playerMap = new Map<string, PlayerShotStats>();
    const goalkeeperMap = new Map<string, GoalkeeperShotStats>();

    for (const shot of shots) {
      ({ homeXg, awayXg, homeGoals, awayGoals } = this.updateTeamStats(shot, {
        homeXg,
        awayXg,
        homeGoals,
        awayGoals,
      }));

      const updatedPlayerStats = this.updatePlayerStats(
        shot,
        playerMap.get(shot.player.id)
      );

      playerMap.set(shot.player.id, updatedPlayerStats);

      if (shot.goalkeeper && shot.isOnTarget()) {
        const updatedGoalkeeperStats = this.updateGoalkeeperStats(
          shot,
          goalkeeperMap.get(shot.goalkeeper.id)
        );
        goalkeeperMap.set(shot.goalkeeper.id, updatedGoalkeeperStats);
      }
    }

    return {
      homeXg: Math.round(homeXg * 100) / 100,
      awayXg: Math.round(awayXg * 100) / 100,
      homeGoals,
      awayGoals,
      playerStats: Array.from(playerMap.values()),
      goalkeeperStats: Array.from(goalkeeperMap.values()),
    };
  }

  private updateTeamStats(
    shot: Shot,
    stats: {
      homeXg: number;
      awayXg: number;
      homeGoals: number;
      awayGoals: number;
    }
  ): { homeXg: number; awayXg: number; homeGoals: number; awayGoals: number } {
    if (shot.isHome) {
      return {
        ...stats,
        homeXg: stats.homeXg + shot.xg,
        homeGoals: stats.homeGoals + (shot.isGoal() ? 1 : 0),
      };
    }
    return {
      ...stats,
      awayXg: stats.awayXg + shot.xg,
      awayGoals: stats.awayGoals + (shot.isGoal() ? 1 : 0),
    };
  }

  private updatePlayerStats(
    shot: Shot,
    existing: PlayerShotStats | undefined
  ): PlayerShotStats {
    if (existing) {
      return {
        ...existing,
        shots: existing.shots + 1,
        goals: existing.goals + (shot.isGoal() ? 1 : 0),
        totalXg: existing.totalXg + shot.xg,
        totalXgot: existing.totalXgot + shot.xgot,
      };
    }
    return createPlayerShotStats(shot);
  }

  private updateGoalkeeperStats(
    shot: Shot,
    existing: GoalkeeperShotStats | undefined
  ): GoalkeeperShotStats {
    if (existing) {
      return {
        ...existing,
        xgotFaced: existing.xgotFaced + shot.xgot,
        goalsConceded: existing.goalsConceded + (shot.isGoal() ? 1 : 0),
        saves: existing.saves + (shot.isSave() ? 1 : 0),
      };
    }
    return createGoalKeeperShotStats(shot, shot.isHome);
  }
}
