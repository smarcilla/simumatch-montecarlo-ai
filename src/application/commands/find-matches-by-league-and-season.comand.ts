export interface FindMatchesByLeagueAndSeasonCommand {
  leagueId: string;
  seasonId: string;
  page?: number | undefined;
  pageSize?: number | undefined;
  teamIds?: string[] | undefined;
}

export function createFindMatchesByLeagueAndSeasonCommand(
  leagueId: string,
  seasonId: string,
  page?: number,
  pageSize?: number,
  teamIds?: string[]
): FindMatchesByLeagueAndSeasonCommand {
  const normalizedTeamIds = teamIds?.filter((teamId) => teamId.length > 0);

  return {
    leagueId,
    seasonId,
    page,
    pageSize,
    teamIds:
      normalizedTeamIds && normalizedTeamIds.length > 0
        ? normalizedTeamIds
        : undefined,
  };
}
