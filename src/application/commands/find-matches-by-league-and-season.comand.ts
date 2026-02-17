export interface FindMatchesByLeagueAndSeasonCommand {
  leagueId: string;
  seasonId: string;
  page?: number; // 0-indexed
  pageSize?: number; // items per page
}
