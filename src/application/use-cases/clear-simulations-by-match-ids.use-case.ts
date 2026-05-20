import { SimulationRepository } from "@/domain/repositories/simulation.repository";

export class ClearSimulationsByMatchIdsUseCase {
  constructor(private readonly simulationRepository: SimulationRepository) {}

  async execute(matchIds: string[]): Promise<void> {
    await this.simulationRepository.deleteByMatchIds(matchIds);
  }
}
