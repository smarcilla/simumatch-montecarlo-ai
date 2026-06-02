"use server";

import { cacheTag, unstable_cache } from "next/cache";
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
  teamSlug?: string
): Promise<PaginatedResult<FindMatchByLeagueAndSeasonResult>> {
  await DIContainer.initializeDatabaseConnection();

  const normalizedTeamSlug = teamSlug?.trim() ?? "";
  const team =
    normalizedTeamSlug.length > 0
      ? await DIContainer.getTeamRepository().findBySlug(normalizedTeamSlug)
      : null;

  let teamIds: string[] | undefined;

  if (normalizedTeamSlug.length > 0) {
    teamIds = team ? [team.id] : [];
  }

  const command = createFindMatchesByLeagueAndSeasonCommand(
    leagueId,
    seasonId,
    page,
    pageSize,
    teamIds
  );

  const useCase = await DIContainer.getFindMatchesByLeagueAndSeasonUseCase();
  return useCase.execute(command);
}

export async function getMatchesByLeagueAndSeason(
  leagueId: string,
  seasonId: string,
  page: number = 0,
  pageSize: number = 12,
  teamSlug?: string
): Promise<PaginatedResult<FindMatchByLeagueAndSeasonResult>> {
  const getMatchesByLeagueAndSeasonCached = unstable_cache(
    async () =>
      findMatchesByLeagueAndSeason(
        leagueId,
        seasonId,
        page,
        pageSize,
        teamSlug
      ),
    [
      "matches",
      leagueId,
      seasonId,
      String(page),
      String(pageSize),
      teamSlug ?? "",
    ],
    { revalidate: 300 }
  );

  return getMatchesByLeagueAndSeasonCached();
}

export async function getMatchById(
  id: string
): Promise<FindMatchByIdResult | null> {
  "use cache";
  cacheTag("match", `match-${id}`);

  console.log(`Fetching match ${id} from database`);

  const useCase = await DIContainer.getFindMatchByIdUseCase();
  const result = await useCase.execute(id);

  console.log(`Fetched match ${id} from database`);

  return result;
}

export async function getShotsByMatch(
  command: FindShotsByMatchCommand
): Promise<PaginatedResult<FindShotResult>> {
  "use cache";
  cacheTag("shots", getMatchCacheTag(command.matchId));

  console.log(`Fetching shots for match ${command.matchId} from database`);

  const useCase = await DIContainer.getFindShotsByMatchUseCase();
  const result = await useCase.execute(command);

  console.log(`Fetched shots for match ${command.matchId} from database`);

  return result;
}

export async function getShotStatsByMatch(
  matchId: string
): Promise<ShotMatchStatsResult> {
  "use cache";
  cacheTag("shot-stats", getMatchCacheTag(matchId));

  console.log(`Fetching shot stats for match ${matchId} from database`);

  const useCase = await DIContainer.getFindShotStatsByMatchUseCase();
  const result = await useCase.execute(matchId);

  console.log(`Fetched shot stats for match ${matchId} from database`);

  return result;
}
