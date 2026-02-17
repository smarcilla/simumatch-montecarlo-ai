import { Match } from "../entities/match.entity";

export interface MatchRepository {
  findByLeagueAndSeason(leagueId: string, seasonId: string): Promise<Match[]>;
}
