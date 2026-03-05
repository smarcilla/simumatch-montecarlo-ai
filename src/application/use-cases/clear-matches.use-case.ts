import { MatchRepository } from "@/domain/repositories/match.repository";

export class ClearMatchesUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(): Promise<void> {
    await this.matchRepository.deleteAll();
  }
}
