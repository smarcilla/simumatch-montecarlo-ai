"use server";

import { TeamSuggestionResult } from "@/application/results/find-team-suggestions.result";
import { Team } from "@/domain/entities/team.entity";
import { DIContainer } from "@/infrastructure/di-container";

export async function getTeamSuggestions(
  pattern: string,
  leagueId: string,
  seasonId: string
): Promise<TeamSuggestionResult[]> {
  const normalizedPattern = pattern.trim();

  if (normalizedPattern.length < 3) {
    return [];
  }

  const useCase = await DIContainer.getFindTeamSuggestionsUseCase();
  return useCase.execute(normalizedPattern, leagueId, seasonId);
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  const normalizedSlug = slug.trim();

  if (normalizedSlug.length === 0) {
    return null;
  }

  await DIContainer.initializeDatabaseConnection();
  return DIContainer.getTeamRepository().findBySlug(normalizedSlug);
}
