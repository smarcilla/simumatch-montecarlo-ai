import { MatchStatusValue } from "@/domain/value-objects/match-status.value";

export interface UpsertMatchCommand {
  externalId: number;
  homeTeamExternalId: number;
  awayTeamExternalId: number;
  leagueExternalId: string;
  seasonExternalId: number;
  tournamentSlug?: string;
  matchSlug?: string;
  date: number;
  homeScore: number;
  awayScore: number;
  status: MatchStatusValue;
}
