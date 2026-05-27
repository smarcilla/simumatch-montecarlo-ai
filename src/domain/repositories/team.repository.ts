import { Team } from "../entities/team.entity";

export interface TeamRepository {
  findByExternalId(externalId: number): Promise<Team | null>;
  findBySlug(slug: string): Promise<Team | null>;
  findByNamePattern(pattern: string, withinIds: string[]): Promise<Team[]>;
  upsert(team: Team): Promise<void>;
  deleteAll(): Promise<void>;
}
