// src/domain/repositories/match.repository.ts
import { Match } from "../entities/match.entity";
import { PaginationOptions, PaginatedResult } from "@/domain/types/pagination";
import { MatchFilterOptions } from "@/domain/types/match-filter";

export interface MatchRepository {
  findByLeagueAndSeason(
    leagueId: string,
    seasonId: string,
    options?: PaginationOptions,
    filters?: MatchFilterOptions
  ): Promise<PaginatedResult<Match>>;
  findById(id: string): Promise<Match | null>;
  findByExternalId(externalId: number): Promise<Match | null>;
  upsert(match: Match): Promise<void>;
  deleteAll(): Promise<void>;
}
