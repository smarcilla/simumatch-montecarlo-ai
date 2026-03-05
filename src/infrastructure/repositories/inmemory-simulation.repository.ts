import { Simulation } from "@/domain/entities/simulation.entity";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";

export class InMemorySimulationRepository implements SimulationRepository {
  private readonly simulations: Simulation[] = [];

  async save(simulation: Simulation): Promise<void> {
    const idx = this.simulations.findIndex(
      (s) => s.matchId === simulation.matchId
    );
    if (idx === -1) {
      this.simulations.push(simulation);
    } else {
      this.simulations[idx] = simulation;
    }
  }

  async findByMatchId(matchId: string): Promise<Simulation | null> {
    return this.simulations.find((s) => s.matchId === matchId) ?? null;
  }

  async deleteAll(): Promise<void> {
    this.simulations.splice(0, this.simulations.length);
  }
}
