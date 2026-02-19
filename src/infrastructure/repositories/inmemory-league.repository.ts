import { League } from "@/domain/entities/league.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { getSeasons } from "./fixtures/seasons.fixture";

export class InMemoryLeagueRepository implements LeagueRepository {
  private readonly leagues: League[];

  constructor() {
    const seasons = getSeasons();
    this.leagues = [
      new League("La Liga", "Spain", seasons, "la-liga-id"),
      new League("Premier League", "England", seasons, "premier-league-id"),
      new League("Serie A", "Italy", seasons, "serie-a-id"),
      new League("Bundesliga", "Germany", seasons, "bundesliga-id"),
      new League("Ligue 1", "France", seasons, "ligue-1-id"),
    ];
  }

  async getLeagues(): Promise<League[]> {
    return this.leagues;
  }
}
