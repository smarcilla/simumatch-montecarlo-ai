import { SeasonRepository } from "@/domain/repositories/season.repository";

export class ClearSeasonsUseCase {
  constructor(private readonly seasonRepository: SeasonRepository) {}

  async execute(): Promise<void> {
    await this.seasonRepository.deleteAll();
  }
}
