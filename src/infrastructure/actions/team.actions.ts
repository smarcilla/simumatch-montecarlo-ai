"use server";

import { TeamSuggestionResult } from "@/application/results/find-team-suggestions.result";
import { Team } from "@/domain/entities/team.entity";
import { DIContainer } from "@/infrastructure/di-container";
import { cacheTag } from "next/cache";

export async function getTeamSuggestions(
  pattern: string,
  leagueId: string,
  seasonId: string
): Promise<TeamSuggestionResult[]> {
  "use cache";

  const normalizedPattern = pattern.trim();

  if (normalizedPattern.length < 3) {
    return [];
  }

  cacheTag(
    "team-suggestions",
    `league-${leagueId}-season-${seasonId}-pattern-${normalizedPattern}`
  );

  console.log(
    `Fetching team suggestions for pattern "${normalizedPattern}" in league ${leagueId} and season ${seasonId} from database`
  );

  const useCase = await DIContainer.getFindTeamSuggestionsUseCase();
  const result = await useCase.execute(normalizedPattern, leagueId, seasonId);

  console.log(
    `Fetched team suggestions for pattern "${normalizedPattern}" in league ${leagueId} and season ${seasonId} from database`
  );

  return result;
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  const normalizedSlug = slug.trim();

  if (normalizedSlug.length === 0) {
    return null;
  }

  await DIContainer.initializeDatabaseConnection();
  return DIContainer.getTeamRepository().findBySlug(normalizedSlug);
}
