import { Simulation } from "@/domain/entities/simulation.entity";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { MonteCarloSimulatorService } from "@/domain/services/montecarlo-simulator.service";
import { SimulateMatchResult } from "../results/simulate-match.result";

export class SimulateMatchUseCase {
  constructor(
    private readonly shotRepository: ShotRepository,
    private readonly matchRepository: MatchRepository,
    private readonly simulationRepository: SimulationRepository,
    private readonly monteCarloSimulatorService: MonteCarloSimulatorService
  ) {}

  async execute(matchId: string): Promise<SimulateMatchResult> {
    const shots = await this.shotRepository.findAllByMatchId(matchId);
    const simulation = this.monteCarloSimulatorService.simulate(matchId, shots);

    await this.simulationRepository.save(simulation);
    await this.matchRepository.updateStatus(matchId, "simulated");

    return this.mapToResult(simulation);
  }

  private mapToResult(simulation: Simulation): SimulateMatchResult {
    return {
      id: simulation.id,
      matchId: simulation.matchId,
      homeWinProbability: simulation.homeWinProbability,
      drawProbability: simulation.drawProbability,
      awayWinProbability: simulation.awayWinProbability,
      xPtsHome: simulation.xPtsHome,
      xPtsAway: simulation.xPtsAway,
      scoreDistribution: simulation.scoreDistribution.map((s) => ({
        home: s.home,
        away: s.away,
        count: s.count,
        percentage: s.percentage,
      })),
      playerStats: simulation.playerStats,
      momentumTimeline: simulation.momentumTimeline.map((m) => ({
        minute: m.minute,
        homeWinProbability: m.homeWinProbability,
        drawProbability: m.drawProbability,
        awayWinProbability: m.awayWinProbability,
      })),
      createdAt: simulation.createdAt,
    };
  }
}
