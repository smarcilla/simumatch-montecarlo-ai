import type { MatchFilterOptions } from "@/domain/types/match-filter";
import { MatchStatusValue } from "@/domain/value-objects/match-status.value";

export function createMatchFilterOptions(
  statuses?: MatchStatusValue[] | undefined,
  dateFrom?: Date | undefined,
  dateTo?: Date | undefined
): MatchFilterOptions {
  const filters: MatchFilterOptions = {};

  if (statuses && statuses.length > 0) {
    filters.statuses = statuses;
  }
  if (dateFrom) {
    filters.dateFrom = dateFrom;
  }
  if (dateTo) {
    filters.dateTo = dateTo;
  }

  return filters;
}
