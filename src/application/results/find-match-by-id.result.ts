import { MatchStatusValue } from "@/domain/value-objects/match-status.value";

export interface FindMatchByIdResult {
  id: string;
  home: string;
  away: string;
  date: string;
  homeColorPrimary: string;
  homeColorSecondary: string;
  awayColorPrimary: string;
  awayColorSecondary: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatusValue;
  league: string;
  season: string;
}
