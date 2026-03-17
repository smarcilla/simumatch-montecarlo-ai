import { League } from "../entities/league.entity";

export interface LeagueRepository {
  findAllWithSeasons(): Promise<League[]>;
  findAll(): Promise<League[]>;
  findByNumericExternalId(numericExternalId: number): Promise<League | null>;
  upsert(league: League): Promise<void>;
  deleteAll(): Promise<void>;
}
