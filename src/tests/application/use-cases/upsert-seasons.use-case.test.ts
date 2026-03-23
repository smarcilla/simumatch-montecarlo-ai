import { UpsertSeasonsUseCase } from "@/application/use-cases/upsert-seasons.use-case";
import { SeasonRepository } from "@/domain/repositories/season.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { buildLeague } from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("UpsertSeasonsUseCase", () => {
  let useCase: UpsertSeasonsUseCase;
  let seasonRepository: SeasonRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getUpsertSeasonsUseCase();
    seasonRepository = DIContainer.getSeasonRepository();
  });

  it("should insert a new season when it does not exist", async () => {
    await buildLeague({ externalId: "Spain La Liga", numericExternalId: 8 });

    await useCase.execute([
      {
        name: "Season 24/25",
        seasonYear: "24/25",
        leagueExternalId: "Spain La Liga",
        externalId: 40001,
      },
    ]);

    const season = await seasonRepository.findByExternalId(40001);
    expect(season).not.toBeNull();
    expect(season!.name).toBe("Season 24/25");
  });

  it("should update an existing season when executed again with same externalId", async () => {
    await buildLeague({ externalId: "Spain La Liga", numericExternalId: 9 });

    await useCase.execute([
      {
        name: "Old Season",
        seasonYear: "23/24",
        leagueExternalId: "Spain La Liga",
        externalId: 40002,
      },
    ]);

    await useCase.execute([
      {
        name: "New Season",
        seasonYear: "23/24",
        leagueExternalId: "Spain La Liga",
        externalId: 40002,
      },
    ]);

    const season = await seasonRepository.findByExternalId(40002);
    expect(season).not.toBeNull();
    expect(season!.name).toBe("New Season");
  });

  it("should skip commands for non-existent leagues", async () => {
    await useCase.execute([
      {
        name: "Orphan Season",
        seasonYear: "22/23",
        leagueExternalId: "NonExistent League",
        externalId: 40003,
      },
    ]);

    const season = await seasonRepository.findByExternalId(40003);
    expect(season).toBeNull();
  });

  it("should insert multiple seasons from a single execute call", async () => {
    await buildLeague({
      externalId: "England Premier League",
      numericExternalId: 17,
    });

    await useCase.execute([
      {
        name: "Season A",
        seasonYear: "24/25",
        leagueExternalId: "England Premier League",
        externalId: 40004,
      },
      {
        name: "Season B",
        seasonYear: "23/24",
        leagueExternalId: "England Premier League",
        externalId: 40005,
      },
    ]);

    expect(await seasonRepository.findByExternalId(40004)).not.toBeNull();
    expect(await seasonRepository.findByExternalId(40005)).not.toBeNull();
  });
});
