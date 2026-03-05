import { Team } from "@/domain/entities/team.entity";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { Color } from "@/domain/value-objects/color.value";
import { UpsertTeamCommand } from "../commands/upsert-team.command";

export class UpsertTeamsUseCase {
  private static readonly BATCH_SIZE = 10;

  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(commands: UpsertTeamCommand[]): Promise<void> {
    for (let i = 0; i < commands.length; i += UpsertTeamsUseCase.BATCH_SIZE) {
      const batch = commands.slice(i, i + UpsertTeamsUseCase.BATCH_SIZE);
      await Promise.allSettled(
        batch.map((command) => this.processCommand(command))
      );
    }
  }

  private async processCommand(command: UpsertTeamCommand): Promise<void> {
    const team = new Team(
      "",
      command.externalId,
      command.name,
      command.slug,
      command.shortName,
      Color.create(command.primaryColor),
      Color.create(command.secondaryColor)
    );
    await this.teamRepository.upsert(team);
  }
}
