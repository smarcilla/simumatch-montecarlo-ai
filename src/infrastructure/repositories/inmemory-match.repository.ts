// src/infrastructure/repositories/inmemory-match.repository.ts
import { Match } from "@/domain/entities/match.entity";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { League } from "@/domain/entities/league.entity";
import { getTeamsByLeague } from "./fixtures/teams.fixture";
import { getSeasons } from "./fixtures/seasons.fixture";
import { generateMatchesForLeagueAndSeason } from "./fixtures/matches.fixture";
import { PaginationOptions } from "@/application/options/pagination.options";
import { PaginatedResult } from "@/application/results/paginated.result";

export class InMemoryMatchRepository implements MatchRepository {
  private readonly matches: Match[] = [];

  constructor(leagues: League[]) {
    this.seedMatches(leagues);
  }

  private seedMatches(leagues: League[]): void {
    leagues.forEach((league) => {
      const teams = getTeamsByLeague(league.name);
      const seasons = getSeasons();

      seasons.forEach((season) => {
        const matches = generateMatchesForLeagueAndSeason(
          league,
          season,
          teams,
          6
        );
        this.matches.push(...matches);
      });
    });

    console.log(`✅ Seeded ${this.matches.length} matches in memory`);
  }

  async findByLeagueAndSeason(
    leagueId: string,
    seasonId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Match>> {
    const filteredMatches = this.matches.filter(
      (match) => match.league.id === leagueId && match.season.id === seasonId
    );

    const paginationOptions = {
      page: options?.page ?? 0,
      pageSize: options?.pageSize ?? 12,
    };
    const start = paginationOptions.page * paginationOptions.pageSize;
    const end = start + paginationOptions.pageSize;
    const results = filteredMatches.slice(start, end);

    const totalPages = Math.ceil(
      filteredMatches.length / paginationOptions.pageSize
    );

    return {
      results,
      total: filteredMatches.length,
      page: paginationOptions.page,
      pageSize: paginationOptions.pageSize,
      totalPages,
      hasNextPage: paginationOptions.page < totalPages - 1,
      hasPreviousPage: paginationOptions.page > 0,
    };
  }
}
