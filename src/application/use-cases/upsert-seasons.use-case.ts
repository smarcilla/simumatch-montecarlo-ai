import { Season } from "@/domain/entities/season.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { SeasonRepository } from "@/domain/repositories/season.repository";
import { SeasonYear } from "@/domain/value-objects/season-year.value";
import {
  filterValidUpsertSeasonCommands,
  UpsertSeasonCommand,
} from "../commands/upsert-season.command";
import { BATCH_SIZE } from "../constants/batch.constants";

export class UpsertSeasonsUseCase {
  constructor(
    private readonly leagueRepository: LeagueRepository,
    private readonly seasonRepository: SeasonRepository
  ) {}

  async execute(commands: UpsertSeasonCommand[]): Promise<void> {
    const leagues = await this.leagueRepository.findAll();
    const leagueMap = new Map(
      leagues.map((league) => [league.externalId, league.id!])
    );

    const validCommands = filterValidUpsertSeasonCommands(commands, leagueMap);

    for (let i = 0; i < validCommands.length; i += BATCH_SIZE) {
      const batch = validCommands.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(
        batch.map((command) =>
          this.processCommand(command, leagueMap.get(command.leagueExternalId)!)
        )
      );
    }
  }

  private async processCommand(
    command: UpsertSeasonCommand,
    leagueId: string
  ): Promise<void> {
    const season = new Season(
      command.name,
      new SeasonYear(command.seasonYear),
      undefined,
      command.externalId
    );
    await this.seasonRepository.upsert(season, leagueId);
  }
}
