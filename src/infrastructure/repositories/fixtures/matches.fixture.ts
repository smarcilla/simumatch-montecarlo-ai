// src/infrastructure/repositories/fixtures/matches.fixture.ts
import { Match } from "@/domain/entities/match.entity";
import { League } from "@/domain/entities/league.entity";
import { Season } from "@/domain/entities/season.entity";
import { Team } from "@/domain/entities/team.entity";
import { MatchDate } from "@/domain/value-objects/match-date.value";
import { MatchStatus } from "@/domain/value-objects/match-status.value";
import { Score } from "@/domain/value-objects/score.value";

export function generateMatchesForLeagueAndSeason(
  league: League,
  season: Season,
  teams: Team[],
  matchesCount: number = 6
): Match[] {
  const matches: Match[] = [];
  const baseDate = new Date("2026-02-10").getTime();

  for (let i = 0; i < matchesCount && i * 2 + 1 < teams.length; i++) {
    const homeTeam = teams[i * 2];
    const awayTeam = teams[i * 2 + 1];
    const matchDate = baseDate + i * 24 * 60 * 60 * 1000; // Un día de diferencia

    matches.push(
      new Match(
        `match-${league.id}-${season.id}-${i}`,
        1000 + i,
        league,
        season,
        MatchDate.create(matchDate),
        new Score(
          Math.floor(Math.random() * 4), // 0-3 goles local
          Math.floor(Math.random() * 4) // 0-3 goles visitante
        ),
        MatchStatus.finished(),
        homeTeam!,
        awayTeam!
      )
    );
  }

  return matches;
}
