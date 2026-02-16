import { League } from "@/domain/entities/league.entity";
import { LeagueMapper } from "@/infrastructure/mappers/league.mapper";

import { describe, expect, it } from "vitest";

describe("LeagueMapper", () => {
  it("should map League to LeagueDTO correctly", () => {
    const league = new League(
      "La Liga",
      "Spain",
      [],
      "league1-id",
      "external-league1-id",
      123
    );

    const dto = LeagueMapper.toDTO(league);

    expect(dto).toEqual({
      name: "La Liga",
      country: "Spain",
      id: "league1-id",
      externalId: "external-league1-id",
      numericExternalId: 123,
      seasons: [],
    });
  });

  it("should map LeagueDTO to League correctly", () => {
    const dto = {
      name: "La Liga",
      country: "Spain",
      id: "league1-id",
      externalId: "external-league1-id",
      numericExternalId: 123,
      seasons: [],
    };

    const league = LeagueMapper.toDomain(dto);

    expect(league.name).toBe("La Liga");
    expect(league.country).toBe("Spain");
    expect(league.id).toBe("league1-id");
    expect(league.externalId).toBe("external-league1-id");
    expect(league.numericExternalId).toBe(123);
    expect(league.seasons).toEqual([]);
  });

  it("should map a list of Leagues to a list of LeagueDTOs correctly", () => {
    const leagues = [
      new League(
        "La Liga",
        "Spain",
        [],
        "league1-id",
        "external-league1-id",
        123
      ),
      new League(
        "Premier League",
        "England",
        [],
        "league2-id",
        "external-league2-id",
        456
      ),
    ];

    const dtos = LeagueMapper.toDTOList(leagues);

    expect(dtos).toEqual([
      {
        name: "La Liga",
        country: "Spain",
        id: "league1-id",
        externalId: "external-league1-id",
        numericExternalId: 123,
        seasons: [],
      },
      {
        name: "Premier League",
        country: "England",
        id: "league2-id",
        externalId: "external-league2-id",
        numericExternalId: 456,
        seasons: [],
      },
    ]);
  });

  it("should map a list of LeagueDTOs to a list of Leagues correctly", () => {
    const dtos = [
      {
        name: "La Liga",
        country: "Spain",
        id: "league1-id",
        externalId: "external-league1-id",
        numericExternalId: 123,
        seasons: [],
      },
      {
        name: "Premier League",
        country: "England",
        id: "league2-id",
        externalId: "external-league2-id",
        numericExternalId: 456,
        seasons: [],
      },
    ];

    const leagues = LeagueMapper.toDomainList(dtos);

    expect(leagues).toEqual([
      new League(
        "La Liga",
        "Spain",
        [],
        "league1-id",
        "external-league1-id",
        123
      ),
      new League(
        "Premier League",
        "England",
        [],
        "league2-id",
        "external-league2-id",
        456
      ),
    ]);
  });
});
