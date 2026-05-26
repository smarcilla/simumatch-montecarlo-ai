"use server";

import { unstable_cache } from "next/cache";
import { DIContainer } from "@/infrastructure/di-container";
import { FindMatchByLeagueAndSeasonResult } from "@/application/results/find-matches-by-league-and-season.result";
import { FindMatchByIdResult } from "@/application/results/find-match-by-id.result";
import { FindShotResult } from "@/application/results/find-shots-by-match.result";
import { ShotMatchStatsResult } from "@/application/results/shot-match-stats.result";

import { FindShotsByMatchCommand } from "@/application/commands/find-shots-by-match.command";
import { createFindMatchesByLeagueAndSeasonCommand } from "@/application/commands/find-matches-by-league-and-season.comand";
import { PaginatedResult } from "@/domain/types/pagination";

function getMatchCacheTag(id: string): string {
  return `match-${id}`;
}

async function findMatchesByLeagueAndSeason(
  leagueId: string,
  seasonId: string,
  page: number,
  pageSize: number,
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
  return useCase.execute(command);
}

export async function getMatchesByLeagueAndSeason(
  leagueId: string,
  seasonId: string,
  page: number = 0,
  pageSize: number = 12,
  statusesRaw?: string,
  dateFromRaw?: string,
  dateToRaw?: string
): Promise<PaginatedResult<FindMatchByLeagueAndSeasonResult>> {
  if ((dateFromRaw ?? "") !== "" || (dateToRaw ?? "") !== "") {
    return findMatchesByLeagueAndSeason(
      leagueId,
      seasonId,
      page,
      pageSize,
      statusesRaw,
      dateFromRaw,
      dateToRaw
    );
  }

  const getMatchesByLeagueAndSeasonCached = unstable_cache(
    async () =>
      findMatchesByLeagueAndSeason(
        leagueId,
        seasonId,
        page,
        pageSize,
        statusesRaw,
        dateFromRaw,
        dateToRaw
      ),
    [
      "matches",
      leagueId,
      seasonId,
      String(page),
      String(pageSize),
      statusesRaw ?? "",
    ],
    { revalidate: 300 }
  );

  return getMatchesByLeagueAndSeasonCached();
}

export async function getMatchById(
  id: string
): Promise<FindMatchByIdResult | null> {
  const getMatchByIdCached = unstable_cache(
    async () => {
      const useCase = await DIContainer.getFindMatchByIdUseCase();
      return useCase.execute(id);
    },
    ["match", id],
    { revalidate: 300, tags: [getMatchCacheTag(id)] }
  );

  return getMatchByIdCached();
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
  const getShotStatsByMatchCached = unstable_cache(
    async () => {
      const useCase = await DIContainer.getFindShotStatsByMatchUseCase();
      return useCase.execute(matchId);
    },
    ["shot-stats", matchId],
    { revalidate: 3600 }
  );

  return getShotStatsByMatchCached();
}
