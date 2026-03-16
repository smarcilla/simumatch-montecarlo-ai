"use server";

import { DIContainer } from "@/infrastructure/di-container";
import { FindMatchByLeagueAndSeasonResult } from "@/application/results/find-matches-by-league-and-season.result";
import { FindMatchByIdResult } from "@/application/results/find-match-by-id.result";
import { FindShotResult } from "@/application/results/find-shots-by-match.result";
import { ShotMatchStatsResult } from "@/application/results/shot-match-stats.result";

import { FindShotsByMatchCommand } from "@/application/commands/find-shots-by-match.command";
import { createFindMatchesByLeagueAndSeasonCommand } from "@/application/commands/find-matches-by-league-and-season.comand";
import { PaginatedResult } from "@/domain/types/pagination";

export async function getMatchesByLeagueAndSeason(
  leagueId: string,
  seasonId: string,
  page: number = 0,
  pageSize: number = 12,
  statusesRaw?: string,
  dateFromRaw?: string,
  dateToRaw?: string
): Promise<PaginatedResult<FindMatchByLeagueAndSeasonResult>> {
  const command = createFindMatchesByLeagueAndSeasonCommand(
    leagueId,
    seasonId,
    page,
    pageSize,
    statusesRaw,
    dateFromRaw,
    dateToRaw
  );

  const useCase = await DIContainer.getFindMatchesByLeagueAndSeasonUseCase();
  const result = await useCase.execute(command);

  return result;
}

export async function getMatchById(
  id: string
): Promise<FindMatchByIdResult | null> {
  const useCase = await DIContainer.getFindMatchByIdUseCase();
  return useCase.execute(id);
}

export async function getShotsByMatch(
  command: FindShotsByMatchCommand
): Promise<PaginatedResult<FindShotResult>> {
  const useCase = await DIContainer.getFindShotsByMatchUseCase();
  return useCase.execute(command);
}

export async function getShotStatsByMatch(
  matchId: string
): Promise<ShotMatchStatsResult> {
  const useCase = await DIContainer.getFindShotStatsByMatchUseCase();
  return useCase.execute(matchId);
}
