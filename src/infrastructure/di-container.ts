// src/infrastructure/di-container.ts
import { FindMatchesByLeagueAndSeasonUseCase } from "@/application/use-cases/find-matches-by-league-and-season.use-case";
import { FindLeaguesUseCase } from "@/application/use-cases/find-leagues.use-case";
import { AddPlayersByShotsUseCase } from "@/application/use-cases/add-players-by-shots.use-case";
import { AddShotsByShotRawUseCase } from "@/application/use-cases/add-shots-by-shot-raw.use-case";
import { FindShotsByMatchUseCase } from "@/application/use-cases/find-shots-by-match.use-case";
import { FindShotStatsByMatchUseCase } from "@/application/use-cases/find-shot-stats-by-match.use-case";
import { FindSimulationByMatchIdUseCase } from "@/application/use-cases/find-simulation-by-match-id.use-case";
import { SimulateMatchUseCase } from "@/application/use-cases/simulate-match.use-case";
import { UpsertTeamsUseCase } from "@/application/use-cases/upsert-teams.use-case";
import { UpsertMatchesUseCase } from "@/application/use-cases/upsert-matches.use-case";
import { ClearSimulationsUseCase } from "@/application/use-cases/clear-simulations.use-case";
import { ClearShotsUseCase } from "@/application/use-cases/clear-shots.use-case";
import { ClearPlayersUseCase } from "@/application/use-cases/clear-players.use-case";
import { ClearMatchesUseCase } from "@/application/use-cases/clear-matches.use-case";
import { ClearTeamsUseCase } from "@/application/use-cases/clear-teams.use-case";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { MonteCarloSimulatorService } from "@/domain/services/montecarlo-simulator.service";

import { MongooseLeagueRepository } from "./repositories/mongoose-league.repository";
import { MongooseMatchRepository } from "./repositories/mongoose-match.repository";
import { MongoosePlayerRepository } from "./repositories/mongoose-player.repository";
import { MongooseShotRepository } from "./repositories/mongoose-shot.repository";
import { MongooseSimulationRepository } from "./repositories/mongoose-simulation.repository";
import { MongooseTeamRepository } from "./repositories/mongoose-team.repository";
import { connectionManager } from "@/infrastructure/db/connection-manager";
import { FindMatchByIdUseCase } from "@/application/use-cases/find-match-by-id.use-case";

export class DIContainer {
  private static leagueRepository: LeagueRepository;
  private static matchRepository: MatchRepository;
  private static playerRepository: PlayerRepository;
  private static shotRepository: ShotRepository;
  private static simulationRepository: SimulationRepository;
  private static teamRepository: TeamRepository;
  private static findMatchesByLeagueAndSeasonUseCase: FindMatchesByLeagueAndSeasonUseCase;
  private static findLeaguesUseCase: FindLeaguesUseCase;
  private static findMatchByIdUseCase: FindMatchByIdUseCase;
  private static addPlayersByShotsUseCase: AddPlayersByShotsUseCase;
  private static addShotsByShotRawUseCase: AddShotsByShotRawUseCase;
  private static findShotsByMatchUseCase: FindShotsByMatchUseCase;
  private static findShotStatsByMatchUseCase: FindShotStatsByMatchUseCase;
  private static simulateMatchUseCase: SimulateMatchUseCase;
  private static findSimulationByMatchIdUseCase: FindSimulationByMatchIdUseCase;
  private static upsertTeamsUseCase: UpsertTeamsUseCase;
  private static upsertMatchesUseCase: UpsertMatchesUseCase;
  private static clearSimulationsUseCase: ClearSimulationsUseCase;
  private static clearShotsUseCase: ClearShotsUseCase;
  private static clearPlayersUseCase: ClearPlayersUseCase;
  private static clearMatchesUseCase: ClearMatchesUseCase;
  private static clearTeamsUseCase: ClearTeamsUseCase;

  static async initializeDatabaseConnection(): Promise<void> {
    await connectionManager.initialize();
  }

  static getLeagueRepository(): LeagueRepository {
    if (!DIContainer.leagueRepository) {
      DIContainer.leagueRepository = new MongooseLeagueRepository();
    }
    return DIContainer.leagueRepository;
  }

  static getMatchRepository(): MatchRepository {
    if (!DIContainer.matchRepository) {
      DIContainer.matchRepository = new MongooseMatchRepository();
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

  static getSimulationRepository(): SimulationRepository {
    if (!DIContainer.simulationRepository) {
      DIContainer.simulationRepository = new MongooseSimulationRepository();
    }
    return DIContainer.simulationRepository;
  }

  static getTeamRepository(): TeamRepository {
    if (!DIContainer.teamRepository) {
      DIContainer.teamRepository = new MongooseTeamRepository();
    }
    return DIContainer.teamRepository;
  }

  static async getFindMatchesByLeagueAndSeasonUseCase(): Promise<FindMatchesByLeagueAndSeasonUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.findMatchesByLeagueAndSeasonUseCase) {
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

  static async getFindShotsByMatchUseCase(): Promise<FindShotsByMatchUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.findShotsByMatchUseCase) {
      DIContainer.findShotsByMatchUseCase = new FindShotsByMatchUseCase(
        DIContainer.getShotRepository()
      );
    }
    return DIContainer.findShotsByMatchUseCase;
  }

  static async getFindShotStatsByMatchUseCase(): Promise<FindShotStatsByMatchUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.findShotStatsByMatchUseCase) {
      DIContainer.findShotStatsByMatchUseCase = new FindShotStatsByMatchUseCase(
        DIContainer.getShotRepository()
      );
    }
    return DIContainer.findShotStatsByMatchUseCase;
  }

  static async getSimulateMatchUseCase(): Promise<SimulateMatchUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.simulateMatchUseCase) {
      DIContainer.simulateMatchUseCase = new SimulateMatchUseCase(
        DIContainer.getShotRepository(),
        DIContainer.getMatchRepository(),
        DIContainer.getSimulationRepository(),
        new MonteCarloSimulatorService()
      );
    }
    return DIContainer.simulateMatchUseCase;
  }

  static async getFindSimulationByMatchIdUseCase(): Promise<FindSimulationByMatchIdUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.findSimulationByMatchIdUseCase) {
      DIContainer.findSimulationByMatchIdUseCase =
        new FindSimulationByMatchIdUseCase(
          DIContainer.getSimulationRepository()
        );
    }
    return DIContainer.findSimulationByMatchIdUseCase;
  }

  static async getUpsertTeamsUseCase(): Promise<UpsertTeamsUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.upsertTeamsUseCase) {
      DIContainer.upsertTeamsUseCase = new UpsertTeamsUseCase(
        DIContainer.getTeamRepository()
      );
    }
    return DIContainer.upsertTeamsUseCase;
  }

  static async getUpsertMatchesUseCase(): Promise<UpsertMatchesUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.upsertMatchesUseCase) {
      DIContainer.upsertMatchesUseCase = new UpsertMatchesUseCase(
        DIContainer.getTeamRepository(),
        DIContainer.getLeagueRepository(),
        DIContainer.getMatchRepository()
      );
    }
    return DIContainer.upsertMatchesUseCase;
  }

  static async getClearSimulationsUseCase(): Promise<ClearSimulationsUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.clearSimulationsUseCase) {
      DIContainer.clearSimulationsUseCase = new ClearSimulationsUseCase(
        DIContainer.getSimulationRepository()
      );
    }
    return DIContainer.clearSimulationsUseCase;
  }

  static async getClearShotsUseCase(): Promise<ClearShotsUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.clearShotsUseCase) {
      DIContainer.clearShotsUseCase = new ClearShotsUseCase(
        DIContainer.getShotRepository()
      );
    }
    return DIContainer.clearShotsUseCase;
  }

  static async getClearPlayersUseCase(): Promise<ClearPlayersUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.clearPlayersUseCase) {
      DIContainer.clearPlayersUseCase = new ClearPlayersUseCase(
        DIContainer.getPlayerRepository()
      );
    }
    return DIContainer.clearPlayersUseCase;
  }

  static async getClearMatchesUseCase(): Promise<ClearMatchesUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.clearMatchesUseCase) {
      DIContainer.clearMatchesUseCase = new ClearMatchesUseCase(
        DIContainer.getMatchRepository()
      );
    }
    return DIContainer.clearMatchesUseCase;
  }

  static async getClearTeamsUseCase(): Promise<ClearTeamsUseCase> {
    await DIContainer.initializeDatabaseConnection();
    if (!DIContainer.clearTeamsUseCase) {
      DIContainer.clearTeamsUseCase = new ClearTeamsUseCase(
        DIContainer.getTeamRepository()
      );
    }
    return DIContainer.clearTeamsUseCase;
  }

  static reset(): void {
    DIContainer.leagueRepository = null as unknown as LeagueRepository;
    DIContainer.matchRepository = null as unknown as MatchRepository;
    DIContainer.playerRepository = null as unknown as PlayerRepository;
    DIContainer.shotRepository = null as unknown as ShotRepository;
    DIContainer.simulationRepository = null as unknown as SimulationRepository;
    DIContainer.teamRepository = null as unknown as TeamRepository;
    DIContainer.findMatchesByLeagueAndSeasonUseCase =
      null as unknown as FindMatchesByLeagueAndSeasonUseCase;
    DIContainer.findLeaguesUseCase = null as unknown as FindLeaguesUseCase;
    DIContainer.findMatchByIdUseCase = null as unknown as FindMatchByIdUseCase;
    DIContainer.addPlayersByShotsUseCase =
      null as unknown as AddPlayersByShotsUseCase;
    DIContainer.addShotsByShotRawUseCase =
      null as unknown as AddShotsByShotRawUseCase;
    DIContainer.findShotsByMatchUseCase =
      null as unknown as FindShotsByMatchUseCase;
    DIContainer.findShotStatsByMatchUseCase =
      null as unknown as FindShotStatsByMatchUseCase;
    DIContainer.simulateMatchUseCase = null as unknown as SimulateMatchUseCase;
    DIContainer.findSimulationByMatchIdUseCase =
      null as unknown as FindSimulationByMatchIdUseCase;
    DIContainer.upsertTeamsUseCase = null as unknown as UpsertTeamsUseCase;
    DIContainer.upsertMatchesUseCase = null as unknown as UpsertMatchesUseCase;
    DIContainer.clearSimulationsUseCase =
      null as unknown as ClearSimulationsUseCase;
    DIContainer.clearShotsUseCase = null as unknown as ClearShotsUseCase;
    DIContainer.clearPlayersUseCase = null as unknown as ClearPlayersUseCase;
    DIContainer.clearMatchesUseCase = null as unknown as ClearMatchesUseCase;
    DIContainer.clearTeamsUseCase = null as unknown as ClearTeamsUseCase;
  }
}
