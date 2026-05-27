import { TeamSuggestionResult } from "@/application/results/find-team-suggestions.result";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { TeamRepository } from "@/domain/repositories/team.repository";

export class FindTeamSuggestionsUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly teamRepository: TeamRepository
  ) {}

  async execute(
    pattern: string,
    leagueId: string,
    seasonId: string
  ): Promise<TeamSuggestionResult[]> {
    const normalizedPattern = pattern.trim();

    if (normalizedPattern.length < 3) {
      return [];
    }

    const teamIds = await this.matchRepository.findDistinctTeamIds(
      leagueId,
      seasonId
    );

    if (teamIds.length === 0) {
      return [];
    }

    const teams = await this.teamRepository.findByNamePattern(
      normalizedPattern,
      teamIds
    );

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      slug: team.slug,
      ...(team.flagUrl ? { flagUrl: team.flagUrl } : {}),
    }));
  }
}
