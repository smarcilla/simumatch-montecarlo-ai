import { Match } from "@/domain/entities/match.entity";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { FindMatchesByLeagueAndSeasonCommand } from "../commands/find-matches-by-league-and-season.comand";
import { FindMatchByLeagueAndSeasonResult } from "../results/find-matches-by-league-and-season.result";
import { PaginatedResult } from "../results/paginated.result";
import { MatchFilterOptions } from "../options/match-filter.options";

export class FindMatchesByLeagueAndSeasonUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(
    command: FindMatchesByLeagueAndSeasonCommand
  ): Promise<PaginatedResult<FindMatchByLeagueAndSeasonResult>> {
    const filters: MatchFilterOptions = {};

    if (command.statuses && command.statuses.length > 0) {
      filters.statuses = command.statuses;
    }
    if (command.dateFrom) {
      filters.dateFrom = command.dateFrom;
    }
    if (command.dateTo) {
      filters.dateTo = command.dateTo;
    }

    const result = await this.matchRepository.findByLeagueAndSeason(
      command.leagueId,
      command.seasonId,
      { page: command.page ?? 0, pageSize: command.pageSize ?? 12 },
      filters
    );

    return {
      ...result,
      results: result.results.map((match) => this.mapToResult(match)),
    };
  }

  mapToResult(match: Match): FindMatchByLeagueAndSeasonResult {
    return {
      id: match.id,
      home: match.homeTeam.name,
      away: match.awayTeam.name,
      date: match.date.date.toISOString(),
      homeColorPrimary: match.homeTeam.primaryColor.hex,
      homeColorSecondary: match.homeTeam.secondaryColor.hex,
      awayColorPrimary: match.awayTeam.primaryColor.hex,
      awayColorSecondary: match.awayTeam.secondaryColor.hex,
      homeScore: match.score.home,
      awayScore: match.score.away,
      status: match.status.value,
      league: match.league.id!,
      season: match.season.id!,
    };
  }
}
