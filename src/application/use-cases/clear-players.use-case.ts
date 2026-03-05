import { PlayerRepository } from "@/domain/repositories/player.repository";

export class ClearPlayersUseCase {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(): Promise<void> {
    await this.playerRepository.deleteAll();
  }
}
