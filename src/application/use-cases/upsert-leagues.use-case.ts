import { League } from "@/domain/entities/league.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { UpsertLeagueCommand } from "../commands/upsert-league.command";
import { BATCH_SIZE } from "../constants/batch.constants";

export class UpsertLeaguesUseCase {
  constructor(private readonly leagueRepository: LeagueRepository) {}

  async execute(commands: UpsertLeagueCommand[]): Promise<void> {
    for (let i = 0; i < commands.length; i += BATCH_SIZE) {
      const batch = commands.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(
        batch.map((command) => this.processCommand(command))
      );
    }
  }

  private async processCommand(command: UpsertLeagueCommand): Promise<void> {
    const league = new League(
      command.name,
      command.country,
      [],
      undefined,
      command.externalId,
      command.numericExternalId
    );
    await this.leagueRepository.upsert(league);
  }
}
