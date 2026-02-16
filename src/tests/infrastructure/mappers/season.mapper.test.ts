import { Season } from "@/domain/entities/season.entity";
import { SeasonYear } from "@/domain/value-objects/season-year.value";
import { SeasonMapper } from "@/infrastructure/mappers/season.mapper";
import { describe, expect, it } from "vitest";

describe("SeasonMapper", () => {
  it("should map Season to SeasonDTO correctly", () => {
    const season = new Season(
      "La Liga 2020/2021",
      new SeasonYear("20/21"),
      "season1-id",
      "external-season1-id"
    );

    const dto = SeasonMapper.toDTO(season);

    expect(dto).toEqual({
      name: "La Liga 2020/2021",
      year: "20/21",
      id: "season1-id",
      externalId: "external-season1-id",
    });
  });

  it("should map SeasonDTO to Season correctly", () => {
    const dto = {
      name: "La Liga 2020/2021",
      year: "20/21",
      id: "season1-id",
      externalId: "external-season1-id",
    };

    const season = SeasonMapper.toDomain(dto);

    expect(season.name).toBe("La Liga 2020/2021");
    expect(season.year.value).toBe("20/21");
    expect(season.id).toBe("season1-id");
    expect(season.externalId).toBe("external-season1-id");
  });

  it("should map a list of Seasons to a list of SeasonDTOs correctly", () => {
    const seasons = [
      new Season(
        "La Liga 2020/2021",
        new SeasonYear("20/21"),
        "season1-id",
        "external-season1-id"
      ),
      new Season(
        "La Liga 2021/2022",
        new SeasonYear("21/22"),
        "season2-id",
        "external-season2-id"
      ),
    ];

    const dtos = SeasonMapper.toDTOList(seasons);

    expect(dtos).toEqual([
      {
        name: "La Liga 2020/2021",
        year: "20/21",
        id: "season1-id",
        externalId: "external-season1-id",
      },
      {
        name: "La Liga 2021/2022",
        year: "21/22",
        id: "season2-id",
        externalId: "external-season2-id",
      },
    ]);
  });

  it("should map a list of SeasonDTOs to a list of Seasons correctly", () => {
    const dtos = [
      {
        name: "La Liga 2020/2021",
        year: "20/21",
        id: "season1-id",
        externalId: "external-season1-id",
      },
      {
        name: "La Liga 2021/2022",
        year: "21/22",
        id: "season2-id",
        externalId: "external-season2-id",
      },
    ];

    const seasons = SeasonMapper.toDomainList(dtos);
    expect(seasons).toEqual([
      new Season(
        "La Liga 2020/2021",
        new SeasonYear("20/21"),
        "season1-id",
        "external-season1-id"
      ),
      new Season(
        "La Liga 2021/2022",
        new SeasonYear("21/22"),
        "season2-id",
        "external-season2-id"
      ),
    ]);
  });
});
