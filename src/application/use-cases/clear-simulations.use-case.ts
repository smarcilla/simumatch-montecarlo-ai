import { SimulationRepository } from "@/domain/repositories/simulation.repository";

export class ClearSimulationsUseCase {
  constructor(private readonly simulationRepository: SimulationRepository) {}

  async execute(): Promise<void> {
    await this.simulationRepository.deleteAll();
  }
}
