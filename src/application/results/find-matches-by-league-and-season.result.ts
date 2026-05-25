import { MatchStatusValue } from "@/domain/value-objects/match-status.value";

export interface FindMatchByLeagueAndSeasonResult {
  id: string;
  home: string;
  away: string;
  date: string;
  homeColorPrimary: string;
  homeColorSecondary: string;
  awayColorPrimary: string;
  awayColorSecondary: string;
  homeFlag: string | undefined;
  awayFlag: string | undefined;
  homeScore: number;
  awayScore: number;
  status: MatchStatusValue;
  league: string;
  season: string;
}
