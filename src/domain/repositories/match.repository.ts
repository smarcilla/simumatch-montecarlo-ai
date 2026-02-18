// src/domain/repositories/match.repository.ts
import { Match } from "../entities/match.entity";
import { PaginationOptions } from "@/application/options/pagination.options";
import { PaginatedResult } from "@/application/results/paginated.result";

export interface MatchRepository {
  findByLeagueAndSeason(
    leagueId: string,
    seasonId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Match>>;
}
