import { Match } from "../entities/match.entity";
import { PaginationOptions } from "@/application/options/pagination.options";

export interface MatchRepository {
  findByLeagueAndSeason(
    leagueId: string,
    seasonId: string,
    options?: PaginationOptions
  ): Promise<Match[]>;
}
