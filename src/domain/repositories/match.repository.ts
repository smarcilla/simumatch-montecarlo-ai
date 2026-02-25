// src/domain/repositories/match.repository.ts
import { Match } from "../entities/match.entity";
import { PaginationOptions } from "@/application/options/pagination.options";
import { MatchFilterOptions } from "@/application/options/match-filter.options";
import { PaginatedResult } from "@/application/results/paginated.result";

export interface MatchRepository {
  findByLeagueAndSeason(
    leagueId: string,
    seasonId: string,
    options?: PaginationOptions,
    filters?: MatchFilterOptions
  ): Promise<PaginatedResult<Match>>;
  findById(id: string): Promise<Match | null>;
  findByExternalId(externalId: number): Promise<Match | null>;
}
