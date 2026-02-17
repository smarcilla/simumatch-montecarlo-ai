export interface FindMatchByLeagueAndSeasonResult {
  id: string;
  home: string;
  away: string;
  date: string;
  homeColorPrimary: string;
  homeColorSecondary: string;
  awayColorPrimary: string;
  awayColorSecondary: string;
  homeScore: number;
  awayScore: number;
  league: string;
  season: string;
}
