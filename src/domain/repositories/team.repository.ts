import { Team } from "../entities/team.entity";

export interface TeamRepository {
  findByExternalId(externalId: number): Promise<Team | null>;
  upsert(team: Team): Promise<void>;
  deleteAll(): Promise<void>;
}
