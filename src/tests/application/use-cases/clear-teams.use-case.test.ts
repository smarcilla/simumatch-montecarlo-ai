import { ClearTeamsUseCase } from "@/application/use-cases/clear-teams.use-case";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { buildTeam, buildPlayer } from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearTeamsUseCase", () => {
  let useCase: ClearTeamsUseCase;
  let teamRepository: TeamRepository;
  let playerRepository: PlayerRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearTeamsUseCase();
    teamRepository = DIContainer.getTeamRepository();
    playerRepository = DIContainer.getPlayerRepository();
  });

  it("should delete all teams", async () => {
    const t1 = await buildTeam({ externalId: 90001 });
    const t2 = await buildTeam({ externalId: 90002 });
    const t3 = await buildTeam({ externalId: 90003 });

    expect(
      await teamRepository.findByExternalId(t1.externalId as number)
    ).not.toBeNull();
    expect(
      await teamRepository.findByExternalId(t2.externalId as number)
    ).not.toBeNull();
    expect(
      await teamRepository.findByExternalId(t3.externalId as number)
    ).not.toBeNull();

    await useCase.execute();

    expect(
      await teamRepository.findByExternalId(t1.externalId as number)
    ).toBeNull();
    expect(
      await teamRepository.findByExternalId(t2.externalId as number)
    ).toBeNull();
    expect(
      await teamRepository.findByExternalId(t3.externalId as number)
    ).toBeNull();
  });

  it("should not affect players collection", async () => {
    const player = await buildPlayer({ externalId: 88001 });

    await useCase.execute();

    expect(
      await playerRepository.findByExternalId(player.externalId as number)
    ).not.toBeNull();
  });
});
