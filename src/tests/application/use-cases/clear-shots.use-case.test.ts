import { ClearShotsUseCase } from "@/application/use-cases/clear-shots.use-case";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { DIContainer } from "@/infrastructure/di-container";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
  buildPlayer,
  buildShot,
} from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearShotsUseCase", () => {
  let useCase: ClearShotsUseCase;
  let shotRepository: ShotRepository;
  let playerRepository: PlayerRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearShotsUseCase();
    shotRepository = DIContainer.getShotRepository();
    playerRepository = DIContainer.getPlayerRepository();
  });

  it("should delete all shots", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);
    const player = await buildPlayer();
    await buildShot(match._id, player._id, { externalId: 50001 });
    await buildShot(match._id, player._id, { externalId: 50002 });
    await buildShot(match._id, player._id, { externalId: 50003 });

    expect(
      await shotRepository.findAllByMatchId(match._id.toString())
    ).toHaveLength(3);

    await useCase.execute();

    expect(
      await shotRepository.findAllByMatchId(match._id.toString())
    ).toHaveLength(0);
  });

  it("should not affect players collection", async () => {
    const externalPlayerId = 50100;
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);
    const player = await buildPlayer({ externalId: externalPlayerId });
    await buildShot(match._id, player._id);

    await useCase.execute();

    const savedPlayer =
      await playerRepository.findByExternalId(externalPlayerId);

    expect(savedPlayer).not.toBeNull();
    expect(savedPlayer!.externalId).toBe(externalPlayerId);
  });
});
