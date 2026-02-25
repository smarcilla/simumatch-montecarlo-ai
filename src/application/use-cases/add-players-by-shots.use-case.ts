import { Player } from "@/domain/entities/player.entity";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { AddPlayerByShotCommand } from "../commands/add-player-by-shot.command";

export class AddPlayersByShotsUseCase {
  private static readonly BATCH_SIZE = 10;

  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(commands: AddPlayerByShotCommand[]): Promise<void> {
    for (
      let i = 0;
      i < commands.length;
      i += AddPlayersByShotsUseCase.BATCH_SIZE
    ) {
      const batch = commands.slice(i, i + AddPlayersByShotsUseCase.BATCH_SIZE);
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
