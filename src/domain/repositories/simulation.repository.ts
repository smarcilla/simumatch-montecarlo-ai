import { Simulation } from "../entities/simulation.entity";

export interface SimulationRepository {
  save(simulation: Simulation): Promise<void>;
  findByMatchId(matchId: string): Promise<Simulation | null>;
}
