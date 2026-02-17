import { League } from "@/domain/entities/league.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { FindLeagueResult } from "../results/find-leagues.result";

export class FindLeaguesUseCase {
  constructor(private readonly leagueRepository: LeagueRepository) {}

  async execute(): Promise<FindLeagueResult[]> {
    const leagues = await this.leagueRepository.getLeagues();
    return leagues.map(this.mapToResult);
  }

  mapToResult(league: League): FindLeagueResult {
    return {
      name: league.name,
      country: league.country,
      id: league.id,
      externalId: league.externalId,
      numericExternalId: league.numericExternalId,
      seasons: league.seasons.map((season) => ({
        name: season.name,
        year: season.year.value,
        id: season.id,
        externalId: season.externalId,
      })),
    };
  }
}
