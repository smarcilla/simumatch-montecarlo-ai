import { League } from "@/domain/entities/league.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";

export class InMemoryLeagueRepository implements LeagueRepository {
  private readonly leagues: League[] = [
    new League("La Liga", "Spain", [], "la-liga-id"),
    new League("Premier League", "England", [], "premier-league-id"),
    new League("Serie A", "Italy", [], "serie-a-id"),
    new League("Bundesliga", "Germany", [], "bundesliga-id"),
    new League("Ligue 1", "France", [], "ligue-1-id"),
  ];

  async getLeagues(): Promise<League[]> {
    return this.leagues;
  }
}
