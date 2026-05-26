"use server";

import { unstable_cache } from "next/cache";
import { DIContainer } from "@/infrastructure/di-container";
import { FindLeagueResult } from "@/application/results/find-leagues.result";

const getLeaguesCached = unstable_cache(
  async (): Promise<FindLeagueResult[]> => {
    const useCase = await DIContainer.getFindLeaguesUseCase();
    return useCase.execute();
  },
  ["leagues-all"],
  { revalidate: 86400 }
);

export async function getLeagues(): Promise<FindLeagueResult[]> {
  return getLeaguesCached();
}
