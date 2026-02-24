import { Match } from "@/domain/entities/match.entity";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { FindMatchByIdResult } from "../results/find-match-by-id.result";

export class FindMatchByIdUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(id: string): Promise<FindMatchByIdResult | null> {
    const match = await this.matchRepository.findById(id);
    if (!match) return null;
    return this.mapToResult(match);
  }

  private mapToResult(match: Match): FindMatchByIdResult {
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
