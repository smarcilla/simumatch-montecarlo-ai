"use server";

import { DIContainer } from "@/infrastructure/di-container";
import { FindLeagueResult } from "@/application/results/find-leagues.result";

export async function getLeagues(): Promise<FindLeagueResult[]> {
  const useCase = DIContainer.getFindLeaguesUseCase();
  return useCase.execute();
}
