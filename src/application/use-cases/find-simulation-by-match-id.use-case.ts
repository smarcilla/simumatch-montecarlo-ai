import { Simulation } from "@/domain/entities/simulation.entity";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";
import { SimulateMatchResult } from "../results/simulate-match.result";

export class FindSimulationByMatchIdUseCase {
  constructor(private readonly simulationRepository: SimulationRepository) {}

  async execute(matchId: string): Promise<SimulateMatchResult | null> {
    const simulation = await this.simulationRepository.findByMatchId(matchId);
    if (!simulation) return null;
    return this.mapToResult(simulation);
  }

  private mapToResult(simulation: Simulation): SimulateMatchResult {
    return {
      ...simulation,
      scoreDistribution: simulation.scoreDistribution.map((s) => ({
        home: s.home,
        away: s.away,
        count: s.count,
        percentage: s.percentage,
      })),
      momentumTimeline: simulation.momentumTimeline.map((m) => ({
        minute: m.minute,
        homeWinProbability: m.homeWinProbability,
        drawProbability: m.drawProbability,
        awayWinProbability: m.awayWinProbability,
      })),
    };
  }
}
