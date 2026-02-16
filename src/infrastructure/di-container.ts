import { LeagueRepository } from "@/domain/repositories/league.repository";
import { InMemoryLeagueRepository } from "@/infrastructure/repositories/inmemory-league.repository";

export class DIContainer {
  private static leagueRepository: LeagueRepository;

  static getLeagueRepository(): LeagueRepository {
    if (!this.leagueRepository) {
      this.leagueRepository = new InMemoryLeagueRepository();
    }
    return this.leagueRepository;
  }
}
