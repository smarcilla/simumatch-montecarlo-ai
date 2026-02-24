"use server";

import { DIContainer } from "@/infrastructure/di-container";
import { FindMatchByLeagueAndSeasonResult } from "@/application/results/find-matches-by-league-and-season.result";
import { FindMatchByIdResult } from "@/application/results/find-match-by-id.result";
import { PaginatedResult } from "@/application/results/paginated.result";
import { MatchStatusValue } from "@/domain/value-objects/match-status.value";

const VALID_STATUSES: Set<MatchStatusValue> = new Set([
  "finished",
  "simulated",
  "chronicle_generated",
]);

export async function getMatchesByLeagueAndSeason(
  leagueId: string,
  seasonId: string,
  page: number = 0,
  pageSize: number = 12,
  statusesRaw?: string,
  dateFromRaw?: string,
  dateToRaw?: string
): Promise<PaginatedResult<FindMatchByLeagueAndSeasonResult>> {
  const statuses =
    statusesRaw
      ?.split(",")
      .map((s) => s.trim())
      .filter((s): s is MatchStatusValue =>
        VALID_STATUSES.has(s as MatchStatusValue)
      ) ?? [];

  const dateFrom = dateFromRaw ? new Date(dateFromRaw) : undefined;
  const dateTo = dateToRaw ? new Date(`${dateToRaw}T23:59:59.999Z`) : undefined;

  const useCase = await DIContainer.getFindMatchesByLeagueAndSeasonUseCase();
  const result = await useCase.execute({
    leagueId,
    seasonId,
    page,
    pageSize,
    statuses: statuses.length > 0 ? statuses : undefined,
    dateFrom,
    dateTo,
  });
  return result;
}

export async function getMatchById(
  id: string
): Promise<FindMatchByIdResult | null> {
  const useCase = await DIContainer.getFindMatchByIdUseCase();
  return useCase.execute(id);
}
