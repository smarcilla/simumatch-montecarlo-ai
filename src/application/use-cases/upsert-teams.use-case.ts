import { Team } from "@/domain/entities/team.entity";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { Color } from "@/domain/value-objects/color.value";
import { UpsertTeamCommand } from "../commands/upsert-team.command";
import { BATCH_SIZE } from "../constants/batch.constants";

export class UpsertTeamsUseCase {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(commands: UpsertTeamCommand[]): Promise<void> {
    for (let i = 0; i < commands.length; i += BATCH_SIZE) {
      const batch = commands.slice(i, i + BATCH_SIZE);
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
