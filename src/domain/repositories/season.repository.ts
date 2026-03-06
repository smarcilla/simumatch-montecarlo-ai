import { Season } from "../entities/season.entity";

export interface SeasonRepository {
  findByExternalId(externalId: number): Promise<Season | null>;
  upsert(season: Season, leagueId: string): Promise<void>;
  deleteAll(): Promise<void>;
}
