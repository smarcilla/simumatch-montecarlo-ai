import { League } from "@/domain/entities/league.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";

export class InMemoryLeagueRepository implements LeagueRepository {
  private readonly leagues: League[] = [
    new League("La Liga", "Spain", []),
    new League("Premier League", "England", []),
    new League("Serie A", "Italy", []),
    new League("Bundesliga", "Germany", []),
    new League("Ligue 1", "France", []),
  ];

  async getLeagues(): Promise<League[]> {
    return this.leagues;
  }
}
