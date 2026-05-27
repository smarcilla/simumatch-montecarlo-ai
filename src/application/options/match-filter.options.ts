import type { MatchFilterOptions } from "@/domain/types/match-filter";

export function createMatchFilterOptions(
  teamIds?: string[] | undefined
): MatchFilterOptions {
  const filters: MatchFilterOptions = {};

  if (teamIds && teamIds.length > 0) {
    filters.teamIds = teamIds;
  }

  return filters;
}
