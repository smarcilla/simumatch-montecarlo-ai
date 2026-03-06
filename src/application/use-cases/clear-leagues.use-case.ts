import { LeagueRepository } from "@/domain/repositories/league.repository";

export class ClearLeaguesUseCase {
  constructor(private readonly leagueRepository: LeagueRepository) {}

  async execute(): Promise<void> {
    await this.leagueRepository.deleteAll();
  }
}
