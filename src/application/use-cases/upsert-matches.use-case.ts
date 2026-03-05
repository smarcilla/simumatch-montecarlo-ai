import { Match } from "@/domain/entities/match.entity";
import { Team } from "@/domain/entities/team.entity";
import { League } from "@/domain/entities/league.entity";
import { Season } from "@/domain/entities/season.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { MatchDate } from "@/domain/value-objects/match-date.value";
import { MatchStatus } from "@/domain/value-objects/match-status.value";
import { Score } from "@/domain/value-objects/score.value";
import { UpsertMatchCommand } from "../commands/upsert-match.command";

export class UpsertMatchesUseCase {
  private readonly teamCache = new Map<number, Team>();
  private leagueMap = new Map<string, League>();
  private seasonMap = new Map<number, Season>();

  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly leagueRepository: LeagueRepository,
    private readonly matchRepository: MatchRepository
  ) {}

  async execute(commands: UpsertMatchCommand[]): Promise<void> {
    await this.loadLeaguesAndSeasons();
    for (const command of commands) {
      await this.processCommand(command);
    }
  }

  private async loadLeaguesAndSeasons(): Promise<void> {
    const leagues = await this.leagueRepository.getLeagues();
    this.leagueMap = new Map(
      leagues
        .filter((l) => l.externalId !== undefined)
        .map((l) => [l.externalId!, l])
    );
    this.seasonMap = new Map();
    for (const league of leagues) {
      for (const season of league.seasons) {
        if (season.externalId !== undefined) {
          this.seasonMap.set(season.externalId, season);
        }
      }
    }
  }

  private async processCommand(command: UpsertMatchCommand): Promise<void> {
    const homeTeam = await this.getTeam(command.homeTeamExternalId);
    const awayTeam = await this.getTeam(command.awayTeamExternalId);
    const league = this.leagueMap.get(command.leagueExternalId);
    const season = this.seasonMap.get(command.seasonExternalId);

    if (!homeTeam) {
      console.warn(
        `Home team not found for externalId ${command.homeTeamExternalId}, skipping match ${command.externalId}`
      );
      return;
    }

    if (!awayTeam) {
      console.warn(
        `Away team not found for externalId ${command.awayTeamExternalId}, skipping match ${command.externalId}`
      );
      return;
    }

    if (!league) {
      console.warn(
        `League not found for externalId ${command.leagueExternalId}, skipping match ${command.externalId}`
      );
      return;
    }

    if (!season) {
      console.warn(
        `Season not found for externalId ${command.seasonExternalId}, skipping match ${command.externalId}`
      );
      return;
    }

    const match = new Match(
      "",
      command.externalId,
      league,
      season,
      MatchDate.create(command.date),
      Score.create(command.homeScore, command.awayScore),
      MatchStatus.create(command.status),
      homeTeam,
      awayTeam
    );

    await this.matchRepository.upsert(match);
  }

  private async getTeam(externalId: number): Promise<Team | null> {
    if (!this.teamCache.has(externalId)) {
      const team = await this.teamRepository.findByExternalId(externalId);
      if (team) this.teamCache.set(externalId, team);
    }
    return this.teamCache.get(externalId) ?? null;
  }
}
