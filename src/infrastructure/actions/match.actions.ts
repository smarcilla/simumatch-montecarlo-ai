// src/application/actions/match.actions.ts
"use server";

import { DIContainer } from "@/infrastructure/di-container";
import { FindMatchByLeagueAndSeasonResult } from "@/application/results/find-matches-by-league-and-season.result";
import { PaginatedResult } from "@/application/results/paginated.result";

export async function getMatchesByLeagueAndSeason(
  leagueId: string,
  seasonId: string,
  page: number = 0,
  pageSize: number = 12
): Promise<PaginatedResult<FindMatchByLeagueAndSeasonResult>> {
  const useCase = await DIContainer.getFindMatchesByLeagueAndSeasonUseCase();
  const result = await useCase.execute({ leagueId, seasonId, page, pageSize });
  return result;
}
