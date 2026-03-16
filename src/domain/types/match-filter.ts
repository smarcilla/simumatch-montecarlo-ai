import { MatchStatusValue } from "../value-objects/match-status.value";

export interface MatchFilterOptions {
  statuses?: MatchStatusValue[];
  dateFrom?: Date;
  dateTo?: Date;
}
