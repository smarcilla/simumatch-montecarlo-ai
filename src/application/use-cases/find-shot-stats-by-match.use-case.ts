import { ShotRepository } from "@/domain/repositories/shot.repository";
import {
  ShotStatsCalculator,
  ShotMatchStats,
} from "@/domain/services/shot-stats-calculator";
import {
  ShotMatchStatsResult,
  PlayerShotStatsResult,
  GoalkeeperShotStatsResult,
} from "../results/shot-match-stats.result";

export class FindShotStatsByMatchUseCase {
  constructor(
    private readonly shotRepository: ShotRepository,
    private readonly shotStatsCalculator: ShotStatsCalculator
  ) {}

  async execute(matchId: string): Promise<ShotMatchStatsResult> {
    const shots = await this.shotRepository.findAllByMatchId(matchId);
    const stats = this.shotStatsCalculator.compute(shots);
    return this.mapToResult(stats);
  }

  private mapToResult(stats: ShotMatchStats): ShotMatchStatsResult {
    return {
      homeXg: stats.homeXg,
      awayXg: stats.awayXg,
      homeGoals: stats.homeGoals,
      awayGoals: stats.awayGoals,
      playerStats: stats.playerStats.map(
        (p): PlayerShotStatsResult => ({
          playerName: p.playerName,
          playerShortName: p.playerShortName,
          isHome: p.isHome,
          shots: p.shots,
          goals: p.goals,
          totalXg: p.totalXg,
          totalXgot: p.totalXgot,
        })
      ),
      goalkeeperStats: stats.goalkeeperStats.map(
        (gk): GoalkeeperShotStatsResult => ({
          goalkeeperName: gk.goalkeeperName,
          goalkeeperShortName: gk.goalkeeperShortName,
          isHome: gk.isHome,
          xgotFaced: gk.xgotFaced,
          goalsConceded: gk.goalsConceded,
          saves: gk.saves,
        })
      ),
    };
  }
}
