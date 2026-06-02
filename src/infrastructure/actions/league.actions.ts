"use server";

import { cacheTag } from "next/cache";
import { DIContainer } from "@/infrastructure/di-container";
import { FindLeagueResult } from "@/application/results/find-leagues.result";

export async function getLeagues(): Promise<FindLeagueResult[]> {
  "use cache";
  cacheTag("leagues-all");

  console.log("Fetching leagues from database");

  const useCase = await DIContainer.getFindLeaguesUseCase();
  const result = await useCase.execute();

  console.log("Fetched leagues from database");
  return result;
}
