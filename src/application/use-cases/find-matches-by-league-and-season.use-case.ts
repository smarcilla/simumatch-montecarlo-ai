import { Match } from "@/domain/entities/match.entity";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { FindMatchesByLeagueAndSeasonCommand } from "../commands/find-matches-by-league-and-season.comand";
import { FindMatchByLeagueAndSeasonResult } from "../results/find-matches-by-league-and-season.result";

export class FindMatchesByLeagueAndSeasonUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(
    command: FindMatchesByLeagueAndSeasonCommand
  ): Promise<FindMatchByLeagueAndSeasonResult[]> {
    const pagination =
      command.page !== undefined && command.pageSize !== undefined
        ? { page: command.page, pageSize: command.pageSize }
        : undefined;

    const matches = await this.matchRepository.findByLeagueAndSeason(
      command.leagueId,
      command.seasonId,
      pagination
    );

    return matches.map(this.mapToResult);
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
      league: match.league.id!,
      season: match.season.id!,
    };
  }
}
