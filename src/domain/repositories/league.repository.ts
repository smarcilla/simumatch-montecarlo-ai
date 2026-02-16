import { League } from "../entities/league.entity";

export interface LeagueRepository {
  getLeagues(): Promise<League[]>;
}
