import { TeamRepository } from "@/domain/repositories/team.repository";

export class ClearTeamsUseCase {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(): Promise<void> {
    await this.teamRepository.deleteAll();
  }
}
