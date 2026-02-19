import { MatchStatusValue } from "@/domain/value-objects/match-status.value";

export interface MatchFilterOptions {
  statuses?: MatchStatusValue[] | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
}
