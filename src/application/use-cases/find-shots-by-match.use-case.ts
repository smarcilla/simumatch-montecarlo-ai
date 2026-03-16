import { Shot } from "@/domain/entities/shot.entity";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { FindShotsByMatchCommand } from "../commands/find-shots-by-match.command";
import { FindShotResult } from "../results/find-shots-by-match.result";

import { createShotFilterOptions } from "../options/shot-filter.options";
import { createPaginationOptions } from "../options/pagination.options";
import { PaginatedResult } from "@/domain/types/pagination";

export class FindShotsByMatchUseCase {
  constructor(private readonly shotRepository: ShotRepository) {}

  async execute(
    command: FindShotsByMatchCommand
  ): Promise<PaginatedResult<FindShotResult>> {
    const options = createPaginationOptions(command.page, command.pageSize);

    const filters = createShotFilterOptions(
      command.shotTypes,
      command.situations,
      command.isHome,
      command.sortBy,
      command.sortOrder
    );

    const result = await this.shotRepository.findByMatchId(
      command.matchId,
      options,
      filters
    );

    return {
      ...result,
      results: result.results.map((shot) => this.mapToResult(shot)),
    };
  }

  private mapToResult(shot: Shot): FindShotResult {
    return {
      id: shot.id,
      xg: shot.xg,
      xgot: shot.xgot,
      isHome: shot.isHome,
      shotType: shot.shotType.value,
      situation: shot.situation.value,
      bodyPart: shot.bodyPart.value,
      timeSeconds: shot.timeSeconds,
      playerName: shot.player.name,
      playerShortName: shot.player.shortName,
      goalkeeperName: shot.goalkeeper?.name ?? null,
    };
  }
}
