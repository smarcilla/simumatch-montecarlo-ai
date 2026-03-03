import { FindLeaguesUseCase } from "@/application/use-cases/find-leagues.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import { buildLeague, buildSeason } from "@/tests/helpers/builders";

describe("FindLeaguesUseCase", () => {
  let useCase: FindLeaguesUseCase;

  beforeEach(async () => {
    useCase = await DIContainer.getFindLeaguesUseCase();
  });

  it("should return only leagues that have at least one season", async () => {
    const l1 = await buildLeague({ name: "La Liga", country: "Spain" });
    const l2 = await buildLeague({
      name: "Premier League",
      country: "England",
    });
    await buildLeague({ name: "Orphan League", country: "France" });
    await buildSeason(l1._id);
    await buildSeason(l2._id);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    const names = result.map((l) => l.name);
    expect(names).toContain("La Liga");
    expect(names).toContain("Premier League");
    expect(names).not.toContain("Orphan League");
  });

  it("should return leagues with their seasons", async () => {
    const league = await buildLeague();
    await buildSeason(league._id, {
      seasonYear: "24/25",
      name: "Season 24/25",
    });
    await buildSeason(league._id, {
      seasonYear: "23/24",
      name: "Season 23/24",
    });

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    const first = result[0]!;
    expect(first.seasons).toHaveLength(2);
    first.seasons.forEach((s) => {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("name");
      expect(s).toHaveProperty("year");
    });
  });

  it("should return an empty array when no leagues exist", async () => {
    const result = await useCase.execute();
    expect(result).toHaveLength(0);
  });
});
