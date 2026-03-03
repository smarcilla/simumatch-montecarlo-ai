import { Simulation } from "../entities/simulation.entity";
import { Shot } from "../entities/shot.entity";
import { SimulationPlayerStat } from "../entities/simulation.types";
import { ScoreDistributionItem } from "../value-objects/score-distribution-item.value";
import { MomentumPoint } from "../value-objects/momentum-point.value";

const ITERATIONS = 10_000;

interface IterationResult {
  homeGoals: number;
  awayGoals: number;
  scoringPlayerIds: Set<string>;
}

interface Probabilities {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
}

export class MonteCarloSimulatorService {
  simulate(matchId: string, shots: Shot[]): Simulation {
    const { homeWins, draws, awayWins, scoreMap, playerGoalCounts } =
      this.runGlobalSimulation(shots);

    const homeWinProbability = homeWins / ITERATIONS;
    const drawProbability = draws / ITERATIONS;
    const awayWinProbability = awayWins / ITERATIONS;

    const xPtsHome = Simulation.computeXPts(
      homeWinProbability,
      drawProbability
    );
    const xPtsAway = Simulation.computeXPts(
      awayWinProbability,
      drawProbability
    );

    const sortedShots = [...shots].sort(
      (a, b) => a.timeSeconds - b.timeSeconds
    );

    return new Simulation(
      crypto.randomUUID(),
      matchId,
      homeWinProbability,
      drawProbability,
      awayWinProbability,
      xPtsHome,
      xPtsAway,
      this.computeScoreDistribution(scoreMap),
      this.computePlayerStats(shots, playerGoalCounts),
      this.runMomentumSimulation(sortedShots),
      new Date()
    );
  }

  private shotIsGoal(shot: Shot): boolean {
    return Math.random() <= shot.xg;
  }

  private simulateOneIteration(shots: Shot[]): IterationResult {
    let homeGoals = 0;
    let awayGoals = 0;
    const scoringPlayerIds = new Set<string>();

    for (const shot of shots) {
      if (this.shotIsGoal(shot)) {
        if (shot.isHome) homeGoals++;
        else awayGoals++;
        scoringPlayerIds.add(shot.player.id);
      }
    }

    return { homeGoals, awayGoals, scoringPlayerIds };
  }

  private simulateProbabilities(shots: Shot[]): Probabilities {
    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;

    for (let i = 0; i < ITERATIONS; i++) {
      const { homeGoals, awayGoals } = this.simulateOneIteration(shots);
      ({ homeWins, draws, awayWins } = this.incrementMatchStats(
        homeGoals,
        awayGoals,
        homeWins,
        draws,
        awayWins
      ));
    }

    return {
      homeWinProbability: homeWins / ITERATIONS,
      drawProbability: draws / ITERATIONS,
      awayWinProbability: awayWins / ITERATIONS,
    };
  }

  private incrementMatchStats(
    homeGoals: number,
    awayGoals: number,
    homeWins: number,
    draws: number,
    awayWins: number
  ) {
    if (homeGoals > awayGoals) homeWins++;
    else if (homeGoals === awayGoals) draws++;
    else awayWins++;
    return { homeWins, draws, awayWins };
  }

  private runGlobalSimulation(shots: Shot[]): {
    homeWins: number;
    draws: number;
    awayWins: number;
    scoreMap: Map<string, number>;
    playerGoalCounts: Map<string, number>;
  } {
    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;
    const scoreMap = new Map<string, number>();
    const playerGoalCounts = new Map<string, number>();

    for (let i = 0; i < ITERATIONS; i++) {
      const { homeGoals, awayGoals, scoringPlayerIds } =
        this.simulateOneIteration(shots);

      ({ homeWins, draws, awayWins } = this.incrementMatchStats(
        homeGoals,
        awayGoals,
        homeWins,
        draws,
        awayWins
      ));

      const scoreKey = `${homeGoals}-${awayGoals}`;
      scoreMap.set(scoreKey, (scoreMap.get(scoreKey) ?? 0) + 1);

      for (const playerId of scoringPlayerIds) {
        playerGoalCounts.set(
          playerId,
          (playerGoalCounts.get(playerId) ?? 0) + 1
        );
      }
    }

    return { homeWins, draws, awayWins, scoreMap, playerGoalCounts };
  }

  private computeScoreDistribution(
    scoreMap: Map<string, number>
  ): ScoreDistributionItem[] {
    return Array.from(scoreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => {
        const parts = key.split("-");
        const home = Number.parseInt(parts[0] ?? "0", 10);
        const away = Number.parseInt(parts[1] ?? "0", 10);
        return ScoreDistributionItem.create(
          home,
          away,
          count,
          (count / ITERATIONS) * 100
        );
      });
  }

  private computePlayerStats(
    shots: Shot[],
    playerGoalCounts: Map<string, number>
  ): SimulationPlayerStat[] {
    const playerMap = new Map<
      string,
      {
        playerName: string;
        playerShortName: string;
        totalXg: number;
        totalXgot: number;
      }
    >();

    for (const shot of shots) {
      const id = shot.player.id;
      if (!playerMap.has(id)) {
        playerMap.set(id, {
          playerName: shot.player.name,
          playerShortName: shot.player.shortName,
          totalXg: 0,
          totalXgot: 0,
        });
      }
      const entry = playerMap.get(id)!;
      playerMap.set(id, {
        ...entry,
        totalXg: entry.totalXg + shot.xg,
        totalXgot: entry.totalXgot + shot.xgot,
      });
    }

    return Array.from(playerMap.entries()).map(([playerId, data]) => ({
      playerId,
      playerName: data.playerName,
      playerShortName: data.playerShortName,
      goalProbability:
        ((playerGoalCounts.get(playerId) ?? 0) / ITERATIONS) * 100,
      sga: data.totalXgot - data.totalXg,
    }));
  }

  private runMomentumSimulation(sortedShots: Shot[]): MomentumPoint[] {
    return sortedShots.map((shot, index) => {
      const shotsUpToNow = sortedShots.slice(0, index + 1);
      const probabilities = this.simulateProbabilities(shotsUpToNow);
      return MomentumPoint.create(
        Math.floor(shot.timeSeconds / 60),
        probabilities.homeWinProbability,
        probabilities.drawProbability,
        probabilities.awayWinProbability
      );
    });
  }
}
