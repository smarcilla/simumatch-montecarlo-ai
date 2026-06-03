import { Match } from "@/domain/entities/match.entity";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { FindMatchesByLeagueAndSeasonCommand } from "../commands/find-matches-by-league-and-season.comand";
import { FindMatchByLeagueAndSeasonResult } from "../results/find-matches-by-league-and-season.result";

import { createMatchFilterOptions } from "../options/match-filter.options";
import { createPaginationOptions } from "../options/pagination.options";
import { PaginatedResult } from "@/domain/types/pagination";

export class FindMatchesByLeagueAndSeasonUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(
    command: FindMatchesByLeagueAndSeasonCommand
  ): Promise<PaginatedResult<FindMatchByLeagueAndSeasonResult>> {
    const filters = createMatchFilterOptions(command.teamIds);

    const options = createPaginationOptions(command.page, command.pageSize);

    const result = await this.matchRepository.findByLeagueAndSeason(
      command.leagueId,
      command.seasonId,
      options,
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
      homeShortName: match.homeTeam.shortName,
      away: match.awayTeam.name,
      awayShortName: match.awayTeam.shortName,
      date: match.date.date.toISOString(),
      homeColorPrimary: match.homeTeam.primaryColor.hex,
      homeColorSecondary: match.homeTeam.secondaryColor.hex,
      awayColorPrimary: match.awayTeam.primaryColor.hex,
      awayColorSecondary: match.awayTeam.secondaryColor.hex,
      homeFlag: match.homeTeam.flagUrl,
      awayFlag: match.awayTeam.flagUrl,
      homeScore: match.score.home,
      awayScore: match.score.away,
      status: match.statusValue,
      league: match.league.id!,
      season: match.season.id!,
      tournamentSlug: match.tournamentSlug,
      matchSlug: match.matchSlug,
    };
  }
}
