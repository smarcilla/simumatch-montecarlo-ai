import { ClearLeaguesUseCase } from "@/application/use-cases/clear-leagues.use-case";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { SeasonRepository } from "@/domain/repositories/season.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { buildLeague, buildSeason } from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearLeaguesUseCase", () => {
  let useCase: ClearLeaguesUseCase;
  let leagueRepository: LeagueRepository;
  let seasonRepository: SeasonRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearLeaguesUseCase();
    leagueRepository = DIContainer.getLeagueRepository();
    seasonRepository = DIContainer.getSeasonRepository();
  });

  it("should delete all leagues", async () => {
    await buildLeague({ numericExternalId: 90001 });
    await buildLeague({ numericExternalId: 90002 });

    expect(
      await leagueRepository.findByNumericExternalId(90001)
    ).not.toBeNull();
    expect(
      await leagueRepository.findByNumericExternalId(90002)
    ).not.toBeNull();

    await useCase.execute();

    expect(await leagueRepository.findByNumericExternalId(90001)).toBeNull();
    expect(await leagueRepository.findByNumericExternalId(90002)).toBeNull();
  });

  it("should not affect seasons collection", async () => {
    const league = await buildLeague();
    await buildSeason(league._id, { externalId: 70001 });

    await useCase.execute();

    expect(await seasonRepository.findByExternalId(70001)).not.toBeNull();
  });
});
