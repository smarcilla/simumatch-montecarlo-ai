import { Simulation } from "../entities/simulation.entity";

export interface SimulationRepository {
  upsert(simulation: Simulation): Promise<void>;
  findByMatchId(matchId: string): Promise<Simulation | null>;
  deleteAll(): Promise<void>;
}
