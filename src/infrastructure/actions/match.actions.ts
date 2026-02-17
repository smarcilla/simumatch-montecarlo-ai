// src/application/actions/match.actions.ts
"use server";

import { DIContainer } from "@/infrastructure/di-container";
import { FindMatchByLeagueAndSeasonResult } from "@/application/results/find-matches-by-league-and-season.result";

export async function getMatchesByLeagueAndSeason(
  leagueId: string,
  seasonId: string
): Promise<FindMatchByLeagueAndSeasonResult[]> {
  const useCase = await DIContainer.getFindMatchesByLeagueAndSeasonUseCase();
  const matches = await useCase.execute({ leagueId, seasonId });
  return matches;
}
