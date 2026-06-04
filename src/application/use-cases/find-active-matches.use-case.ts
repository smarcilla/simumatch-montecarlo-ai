import { League } from "@/domain/entities/league.entity";

import { LeagueRepository } from "@/domain/repositories/league.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { MatchSlug } from "@/domain/types/match-slug";

interface LeagueAndSeason {
  leagueId: string;
  seasonId: string;
}

//TODO: Implement unit tests for this use case.
export class FindActiveMatchesUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly leagueRepository: LeagueRepository
  ) {}

  async execute(): Promise<MatchSlug[]> {
    const activeLeagues = await this.leagueRepository.findAllWithSeasons();

    const leagueAndSeasonPairs = activeLeagues.flatMap((league) =>
      this.mapToLeagueAndSeason(league)
    );

    const matches = [];

    for (const { leagueId, seasonId } of leagueAndSeasonPairs) {
      const seasonMatches =
        await this.matchRepository.findByLeagueAndSeasonOnlyMatches(
          leagueId,
          seasonId
        );
      matches.push(...seasonMatches);
    }

    return matches;
  }

  private mapToLeagueAndSeason(league: League): LeagueAndSeason[] {
    return league.seasons.map((season) => ({
      leagueId: league.id!,
      seasonId: season.id!,
    }));
  }
}
