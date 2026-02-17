import { FindMatchesByLeagueAndSeasonUseCase } from "@/application/use-cases/find-matches-by-league-and-season.use-case";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { InMemoryLeagueRepository } from "@/infrastructure/repositories/inmemory-league.repository";
import { InMemoryMatchRepository } from "./repositories/inmemory-match.repository";
import { FindLeaguesUseCase } from "@/application/use-cases/find-leagues.use-case";

export class DIContainer {
  private static leagueRepository: LeagueRepository;

  private static findMatchesByLeagueAndSeasonUseCase: FindMatchesByLeagueAndSeasonUseCase;
  private static findLeaguesUseCase: FindLeaguesUseCase;

  static getLeagueRepository(): LeagueRepository {
    if (!DIContainer.leagueRepository) {
      DIContainer.leagueRepository = new InMemoryLeagueRepository();
    }
    return DIContainer.leagueRepository;
  }

  static async getFindMatchesByLeagueAndSeasonUseCase(): Promise<FindMatchesByLeagueAndSeasonUseCase> {
    if (!DIContainer.findMatchesByLeagueAndSeasonUseCase) {
      DIContainer.findMatchesByLeagueAndSeasonUseCase =
        new FindMatchesByLeagueAndSeasonUseCase(
          new InMemoryMatchRepository(
            await DIContainer.getLeagueRepository().getLeagues()
          )
        );
    }
    return DIContainer.findMatchesByLeagueAndSeasonUseCase;
  }

  static getFindLeaguesUseCase(): FindLeaguesUseCase {
    if (!DIContainer.findLeaguesUseCase) {
      DIContainer.findLeaguesUseCase = new FindLeaguesUseCase(
        DIContainer.getLeagueRepository()
      );
    }
    return DIContainer.findLeaguesUseCase;
  }
}
