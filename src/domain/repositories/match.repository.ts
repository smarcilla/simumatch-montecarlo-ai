// src/domain/repositories/match.repository.ts
import { Match } from "../entities/match.entity";
import { PaginationOptions, PaginatedResult } from "@/domain/types/pagination";
import { MatchFilterOptions } from "@/domain/types/match-filter";
import { MatchSlug } from "../types/match-slug";

export interface MatchRepository {
  findByLeagueAndSeason(
    leagueId: string,
    seasonId: string,
    options?: PaginationOptions,
    filters?: MatchFilterOptions
  ): Promise<PaginatedResult<Match>>;
  findDistinctTeamIds(leagueId: string, seasonId: string): Promise<string[]>;
  findById(id: string): Promise<Match | null>;
  findByExternalId(externalId: number): Promise<Match | null>;
  upsert(match: Match): Promise<void>;
  deleteAll(): Promise<void>;
  findByLeagueAndSeasonOnlyMatches(
    leagueId: string,
    seasonId: string
  ): Promise<MatchSlug[]>;
}
