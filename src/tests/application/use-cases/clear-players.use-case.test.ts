import { ClearPlayersUseCase } from "@/application/use-cases/clear-players.use-case";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { DIContainer } from "@/infrastructure/di-container";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
  buildPlayer,
} from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearPlayersUseCase", () => {
  let useCase: ClearPlayersUseCase;
  let playerRepository: PlayerRepository;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearPlayersUseCase();
    playerRepository = DIContainer.getPlayerRepository();
    matchRepository = DIContainer.getMatchRepository();
  });

  it("should delete all players", async () => {
    const p1 = await buildPlayer({ externalId: 70001 });
    const p2 = await buildPlayer({ externalId: 70002 });
    const p3 = await buildPlayer({ externalId: 70003 });

    expect(
      await playerRepository.findByExternalId(p1.externalId as number)
    ).not.toBeNull();
    expect(
      await playerRepository.findByExternalId(p2.externalId as number)
    ).not.toBeNull();
    expect(
      await playerRepository.findByExternalId(p3.externalId as number)
    ).not.toBeNull();

    await useCase.execute();

    expect(
      await playerRepository.findByExternalId(p1.externalId as number)
    ).toBeNull();
    expect(
      await playerRepository.findByExternalId(p2.externalId as number)
    ).toBeNull();
    expect(
      await playerRepository.findByExternalId(p3.externalId as number)
    ).toBeNull();
  });

  it("should not affect matches collection", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);

    await useCase.execute();

    expect(await matchRepository.findById(match._id.toString())).not.toBeNull();
  });
});
