// src/infrastructure/di-container.ts
import { FindMatchesByLeagueAndSeasonUseCase } from "@/application/use-cases/find-matches-by-league-and-season.use-case";
import { FindLeaguesUseCase } from "@/application/use-cases/find-leagues.use-case";
import { AddPlayersByShotsUseCase } from "@/application/use-cases/add-players-by-shots.use-case";
import { AddShotsByShotRawUseCase } from "@/application/use-cases/add-shots-by-shot-raw.use-case";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { InMemoryLeagueRepository } from "./repositories/inmemory-league.repository";
import { InMemoryMatchRepository } from "./repositories/inmemory-match.repository";
import { MongooseLeagueRepository } from "./repositories/mongoose-league.repository";
import { MongooseMatchRepository } from "./repositories/mongoose-match.repository";
import { MongoosePlayerRepository } from "./repositories/mongoose-player.repository";
import { MongooseShotRepository } from "./repositories/mongoose-shot.repository";
import { connectionManager } from "@/infrastructure/db/connection-manager";
import { FindMatchByIdUseCase } from "@/application/use-cases/find-match-by-id.use-case";

type RepositoryType = "inmemory" | "mongoose";

export class DIContainer {
  private static repositoryType: RepositoryType;

  private static leagueRepository: LeagueRepository;
  private static matchRepository: MatchRepository;
  private static playerRepository: PlayerRepository;
  private static shotRepository: ShotRepository;
  private static findMatchesByLeagueAndSeasonUseCase: FindMatchesByLeagueAndSeasonUseCase;
  private static findLeaguesUseCase: FindLeaguesUseCase;
  private static findMatchByIdUseCase: FindMatchByIdUseCase;
  private static addPlayersByShotsUseCase: AddPlayersByShotsUseCase;
  private static addShotsByShotRawUseCase: AddShotsByShotRawUseCase;

  static isInMemory(): boolean {
    if (!DIContainer.repositoryType) {
      DIContainer.repositoryType =
        (process.env.REPOSITORY_TYPE as RepositoryType) || "inmemory";
    }
    return DIContainer.repositoryType === "inmemory";
  }

  static async initializeDatabaseConnection(): Promise<void> {
    if (!DIContainer.isInMemory()) {
      await connectionManager.initialize();
    }
  }

  static getLeagueRepository(): LeagueRepository {
    if (!DIContainer.leagueRepository) {
      DIContainer.leagueRepository = DIContainer.isInMemory()
        ? new InMemoryLeagueRepository()
        : new MongooseLeagueRepository();
    }
    return DIContainer.leagueRepository;
  }

  static getMatchRepository(): MatchRepository {
    if (!DIContainer.matchRepository) {
      DIContainer.matchRepository = DIContainer.isInMemory()
        ? new InMemoryMatchRepository([])
        : new MongooseMatchRepository();
    }
    return DIContainer.matchRepository;
  }

  static getPlayerRepository(): PlayerRepository {
    if (!DIContainer.playerRepository) {
      DIContainer.playerRepository = new MongoosePlayerRepository();
    }
    return DIContainer.playerRepository;
  }

  static getShotRepository(): ShotRepository {
    if (!DIContainer.shotRepository) {
      DIContainer.shotRepository = new MongooseShotRepository();
    }
    return DIContainer.shotRepository;
  }

  static async getFindMatchesByLeagueAndSeasonUseCase(): Promise<FindMatchesByLeagueAndSeasonUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.findMatchesByLeagueAndSeasonUseCase) {
      // Si es InMemory, necesita inicializar con leagues
      if (DIContainer.isInMemory()) {
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

  static async getFindLeaguesUseCase(): Promise<FindLeaguesUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.findLeaguesUseCase) {
      DIContainer.findLeaguesUseCase = new FindLeaguesUseCase(
        DIContainer.getLeagueRepository()
      );
    }
    return DIContainer.findLeaguesUseCase;
  }

  static async getFindMatchByIdUseCase(): Promise<FindMatchByIdUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.findMatchByIdUseCase) {
      // Si es InMemory, necesita inicializar con leagues
      if (DIContainer.isInMemory()) {
        const leagues = await DIContainer.getLeagueRepository().getLeagues();
        DIContainer.matchRepository = new InMemoryMatchRepository(leagues);
      }

      DIContainer.findMatchByIdUseCase = new FindMatchByIdUseCase(
        DIContainer.getMatchRepository()
      );
    }
    return DIContainer.findMatchByIdUseCase;
  }

  static async getAddPlayersByShotsUseCase(): Promise<AddPlayersByShotsUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.addPlayersByShotsUseCase) {
      DIContainer.addPlayersByShotsUseCase = new AddPlayersByShotsUseCase(
        DIContainer.getPlayerRepository()
      );
    }
    return DIContainer.addPlayersByShotsUseCase;
  }

  static async getAddShotsByShotRawUseCase(): Promise<AddShotsByShotRawUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.addShotsByShotRawUseCase) {
      DIContainer.addShotsByShotRawUseCase = new AddShotsByShotRawUseCase(
        DIContainer.getPlayerRepository(),
        DIContainer.getMatchRepository(),
        DIContainer.getShotRepository()
      );
    }
    return DIContainer.addShotsByShotRawUseCase;
  }

  static reset(): void {
    DIContainer.leagueRepository = null as unknown as LeagueRepository;
    DIContainer.matchRepository = null as unknown as MatchRepository;
    DIContainer.playerRepository = null as unknown as PlayerRepository;
    DIContainer.shotRepository = null as unknown as ShotRepository;
    DIContainer.findMatchesByLeagueAndSeasonUseCase =
      null as unknown as FindMatchesByLeagueAndSeasonUseCase;
    DIContainer.findLeaguesUseCase = null as unknown as FindLeaguesUseCase;
    DIContainer.findMatchByIdUseCase = null as unknown as FindMatchByIdUseCase;
    DIContainer.addPlayersByShotsUseCase =
      null as unknown as AddPlayersByShotsUseCase;
    DIContainer.addShotsByShotRawUseCase =
      null as unknown as AddShotsByShotRawUseCase;
  }
}
