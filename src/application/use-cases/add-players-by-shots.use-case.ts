import { Player } from "@/domain/entities/player.entity";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { AddPlayerByShotCommand } from "../commands/add-player-by-shot.command";
import { BATCH_SIZE } from "../constants/batch.constants";

export class AddPlayersByShotsUseCase {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(commands: AddPlayerByShotCommand[]): Promise<void> {
    for (let i = 0; i < commands.length; i += BATCH_SIZE) {
      const batch = commands.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(
        batch.map((command) => this.processCommand(command))
      );
    }
  }

  private async processCommand(command: AddPlayerByShotCommand): Promise<void> {
    const player = new Player(
      "",
      command.externalId,
      command.name,
      command.slug,
      command.shortName,
      command.position,
      command.jerseyNumber
    );
    await this.playerRepository.upsert(player);
  }
}
