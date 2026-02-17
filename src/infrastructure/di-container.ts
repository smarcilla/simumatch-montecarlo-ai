// src/infrastructure/di-container.ts
import { FindMatchesByLeagueAndSeasonUseCase } from "@/application/use-cases/find-matches-by-league-and-season.use-case";
import { FindLeaguesUseCase } from "@/application/use-cases/find-leagues.use-case";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { InMemoryLeagueRepository } from "./repositories/inmemory-league.repository";
import { InMemoryMatchRepository } from "./repositories/inmemory-match.repository";
import { MongooseLeagueRepository } from "./repositories/mongoose-league.repository";
import { MongooseMatchRepository } from "./repositories/mongoose-match.repository";

type RepositoryType = "inmemory" | "mongoose";

export class DIContainer {
  private static readonly repositoryType: RepositoryType =
    (process.env.REPOSITORY_TYPE as RepositoryType) || "inmemory";

  private static leagueRepository: LeagueRepository;
  private static matchRepository: MatchRepository;
  private static findMatchesByLeagueAndSeasonUseCase: FindMatchesByLeagueAndSeasonUseCase;
  private static findLeaguesUseCase: FindLeaguesUseCase;

  static getLeagueRepository(): LeagueRepository {
    if (!DIContainer.leagueRepository) {
      DIContainer.leagueRepository =
        DIContainer.repositoryType === "mongoose"
          ? new MongooseLeagueRepository()
          : new InMemoryLeagueRepository();
    }
    return DIContainer.leagueRepository;
  }

  static getMatchRepository(): MatchRepository {
    if (!DIContainer.matchRepository) {
      DIContainer.matchRepository =
        DIContainer.repositoryType === "mongoose"
          ? new MongooseMatchRepository()
          : new InMemoryMatchRepository([]);
    }
    return DIContainer.matchRepository;
  }

  static async getFindMatchesByLeagueAndSeasonUseCase(): Promise<FindMatchesByLeagueAndSeasonUseCase> {
    if (!DIContainer.findMatchesByLeagueAndSeasonUseCase) {
      // Si es InMemory, necesita inicializar con leagues
      if (DIContainer.repositoryType === "inmemory") {
        const leagues = await DIContainer.getLeagueRepository().getLeagues();
        DIContainer.matchRepository = new InMemoryMatchRepository(leagues);
      }

      DIContainer.findMatchesByLeagueAndSeasonUseCase =
        new FindMatchesByLeagueAndSeasonUseCase(
          DIContainer.getMatchRepository()
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

  // Método para resetear el contenedor (útil en tests)
  static reset(): void {
    DIContainer.leagueRepository = null as unknown as LeagueRepository;
    DIContainer.matchRepository = null as unknown as MatchRepository;
    DIContainer.findMatchesByLeagueAndSeasonUseCase =
      null as unknown as FindMatchesByLeagueAndSeasonUseCase;
    DIContainer.findLeaguesUseCase = null as unknown as FindLeaguesUseCase;
  }
}
