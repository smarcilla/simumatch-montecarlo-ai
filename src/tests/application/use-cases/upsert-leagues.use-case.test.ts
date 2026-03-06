import { UpsertLeaguesUseCase } from "@/application/use-cases/upsert-leagues.use-case";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";

describe("UpsertLeaguesUseCase", () => {
  let useCase: UpsertLeaguesUseCase;
  let leagueRepository: LeagueRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getUpsertLeaguesUseCase();
    leagueRepository = DIContainer.getLeagueRepository();
  });

  it("should insert a new league when it does not exist", async () => {
    await useCase.execute([
      {
        name: "La Liga",
        country: "Spain",
        externalId: "Spain La Liga",
        numericExternalId: 8,
      },
    ]);

    const league = await leagueRepository.findByNumericExternalId(8);
    expect(league).not.toBeNull();
    expect(league!.name).toBe("La Liga");
    expect(league!.country).toBe("Spain");
    expect(league!.externalId).toBe("Spain La Liga");
    expect(league!.numericExternalId).toBe(8);
  });

  it("should update an existing league when executed again with same numericExternalId", async () => {
    await useCase.execute([
      {
        name: "Old Name",
        country: "Spain",
        externalId: "Spain Old",
        numericExternalId: 100,
      },
    ]);

    await useCase.execute([
      {
        name: "New Name",
        country: "Spain",
        externalId: "Spain New",
        numericExternalId: 100,
      },
    ]);

    const league = await leagueRepository.findByNumericExternalId(100);
    expect(league).not.toBeNull();
    expect(league!.name).toBe("New Name");
    expect(league!.externalId).toBe("Spain New");
  });

  it("should insert multiple leagues from a single execute call", async () => {
    await useCase.execute([
      {
        name: "Premier League",
        country: "England",
        externalId: "England Premier League",
        numericExternalId: 17,
      },
      {
        name: "Serie A",
        country: "Italy",
        externalId: "Italy Serie A",
        numericExternalId: 23,
      },
    ]);

    expect(await leagueRepository.findByNumericExternalId(17)).not.toBeNull();
    expect(await leagueRepository.findByNumericExternalId(23)).not.toBeNull();
  });
});
