import { ClearSeasonsUseCase } from "@/application/use-cases/clear-seasons.use-case";
import { SeasonRepository } from "@/domain/repositories/season.repository";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { buildLeague, buildSeason } from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearSeasonsUseCase", () => {
  let useCase: ClearSeasonsUseCase;
  let seasonRepository: SeasonRepository;
  let leagueRepository: LeagueRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearSeasonsUseCase();
    seasonRepository = DIContainer.getSeasonRepository();
    leagueRepository = DIContainer.getLeagueRepository();
  });

  it("should delete all seasons", async () => {
    const league = await buildLeague();
    await buildSeason(league._id, { externalId: 60001 });
    await buildSeason(league._id, { externalId: 60002 });

    expect(await seasonRepository.findByExternalId(60001)).not.toBeNull();
    expect(await seasonRepository.findByExternalId(60002)).not.toBeNull();

    await useCase.execute();

    expect(await seasonRepository.findByExternalId(60001)).toBeNull();
    expect(await seasonRepository.findByExternalId(60002)).toBeNull();
  });

  it("should not affect leagues collection", async () => {
    const league = await buildLeague({ numericExternalId: 50001 });
    await buildSeason(league._id);

    await useCase.execute();

    expect(
      await leagueRepository.findByNumericExternalId(50001)
    ).not.toBeNull();
  });
});
