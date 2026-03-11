import { Chronicle } from "../entities/chronicle.entity";

export interface ChronicleRepository {
  upsert(chronicle: Chronicle): Promise<void>;
  findByMatchId(matchId: string): Promise<Chronicle | null>;
  deleteAll(): Promise<void>;
}
