import { FindLeaguesUseCase } from "@/application/use-cases/find-leagues.use-case";
import { DIContainer } from "@/infrastructure/di-container";

import { beforeAll, describe, expect, it } from "vitest";

describe("FindLeaguesUseCase", () => {
  let useCase: FindLeaguesUseCase;

  beforeAll(async () => {
    useCase = await DIContainer.getFindLeaguesUseCase();
  });

  it("should return a list of leagues", async () => {
    const leagues = await useCase.execute();

    expect(leagues).toBeDefined();
    expect(Array.isArray(leagues)).toBe(true);
    expect(leagues.length).toBeGreaterThan(0);
    leagues.forEach((league) => {
      expect(league).toHaveProperty("id");
      expect(league).toHaveProperty("name");
      expect(league).toHaveProperty("country");
      expect(league).toHaveProperty("seasons");
      expect(Array.isArray(league.seasons)).toBe(true);
      league.seasons.forEach((season) => {
        expect(season).toHaveProperty("id");
        expect(season).toHaveProperty("name");
        expect(season).toHaveProperty("year");
      });
    });
  });
});
