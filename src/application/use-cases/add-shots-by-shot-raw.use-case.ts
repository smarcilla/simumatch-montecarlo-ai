import { Match } from "@/domain/entities/match.entity";
import { Player } from "@/domain/entities/player.entity";
import { Shot } from "@/domain/entities/shot.entity";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { BodyPart } from "@/domain/value-objects/body-part.value";
import { ShotSituation } from "@/domain/value-objects/shot-situation.value";
import { ShotType } from "@/domain/value-objects/shot-type.value";
import { AddShotByShotRawCommand } from "../commands/add-shot-by-shot-raw.command";

export class AddShotsByShotRawUseCase {
  private static readonly BATCH_SIZE = 10;

  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly matchRepository: MatchRepository,
    private readonly shotRepository: ShotRepository
  ) {}

  async execute(commands: AddShotByShotRawCommand[]): Promise<void> {
    const playerCache = new Map<number, Promise<Player | null>>();
    const matchCache = new Map<number, Promise<Match | null>>();

    for (
      let i = 0;
      i < commands.length;
      i += AddShotsByShotRawUseCase.BATCH_SIZE
    ) {
      const batch = commands.slice(i, i + AddShotsByShotRawUseCase.BATCH_SIZE);
      await Promise.allSettled(
        batch.map((command) =>
          this.processCommand(command, playerCache, matchCache)
        )
      );
    }
  }

  private getCachedPlayer(
    externalId: number,
    cache: Map<number, Promise<Player | null>>
  ): Promise<Player | null> {
    if (!cache.has(externalId)) {
      cache.set(externalId, this.playerRepository.findByExternalId(externalId));
    }
    return cache.get(externalId)!;
  }

  private getCachedMatch(
    externalId: number,
    cache: Map<number, Promise<Match | null>>
  ): Promise<Match | null> {
    if (!cache.has(externalId)) {
      cache.set(externalId, this.matchRepository.findByExternalId(externalId));
    }
    return cache.get(externalId)!;
  }

  private async processCommand(
    command: AddShotByShotRawCommand,
    playerCache: Map<number, Promise<Player | null>>,
    matchCache: Map<number, Promise<Match | null>>
  ): Promise<void> {
    try {
      const player = await this.getCachedPlayer(
        command.playerExternalId,
        playerCache
      );
      if (!player) {
        console.warn(
          `Player not found for externalId: ${command.playerExternalId}, skipping shot ${command.externalId}`
        );
        return;
      }

      let goalkeeper = null;
      if (command.goalkeeperExternalId !== null) {
        goalkeeper = await this.getCachedPlayer(
          command.goalkeeperExternalId,
          playerCache
        );
        if (!goalkeeper) {
          console.warn(
            `Goalkeeper not found for externalId: ${command.goalkeeperExternalId}, shot ${command.externalId}`
          );
        }
      }

      const match = await this.getCachedMatch(
        command.matchExternalId,
        matchCache
      );
      if (!match) {
        console.warn(
          `Match not found for externalId: ${command.matchExternalId}, skipping shot ${command.externalId}`
        );
        return;
      }

      let shotType: ShotType;
      let situation: ShotSituation;
      let bodyPart: BodyPart;
      try {
        shotType = ShotType.create(command.shotType);
        situation = ShotSituation.create(command.situation);
        bodyPart = BodyPart.create(command.bodyPart);
      } catch (err) {
        console.warn(
          `Invalid shot values for shot ${command.externalId}: ${err}`
        );
        return;
      }

      const shot = new Shot(
        "",
        command.externalId,
        Number.isNaN(command.xg) ? 0 : command.xg,
        Number.isNaN(command.xgot) ? 0 : command.xgot,
        command.isHome,
        shotType,
        situation,
        bodyPart,
        command.timeSeconds,
        player,
        goalkeeper,
        match.id
      );

      await this.shotRepository.upsert(shot);
    } catch (err) {
      console.error(`Error processing shot ${command.externalId}: ${err}`);
    }
  }
}
