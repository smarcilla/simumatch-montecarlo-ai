import {
  MatchStatus,
  MatchStatusValue,
} from "@/domain/value-objects/match-status.value";

export interface FindMatchesByLeagueAndSeasonCommand {
  leagueId: string;
  seasonId: string;
  page?: number | undefined;
  pageSize?: number | undefined;
  statuses?: MatchStatusValue[] | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
}

export function createFindMatchesByLeagueAndSeasonCommand(
  leagueId: string,
  seasonId: string,
  page?: number,
  pageSize?: number,
  statusesRaw?: string,
  dateFromRaw?: string,
  dateToRaw?: string
): FindMatchesByLeagueAndSeasonCommand {
  const statuses =
    (statusesRaw
      ?.split(",")
      .map((s) => s.trim())
      .filter((s) => MatchStatus.isMatchStatus(s)) as MatchStatusValue[]) ?? [];

  const dateFrom = dateFromRaw ? new Date(dateFromRaw) : undefined;
  const dateTo = dateToRaw ? new Date(`${dateToRaw}T23:59:59.999Z`) : undefined;

  return {
    leagueId,
    seasonId,
    page,
    pageSize,
    statuses: statuses.length > 0 ? statuses : undefined,
    dateFrom,
    dateTo,
  };
}
