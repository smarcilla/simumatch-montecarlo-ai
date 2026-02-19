import { FindMatchesByLeagueAndSeasonUseCase } from "@/application/use-cases/find-matches-by-league-and-season.use-case";
import { DIContainer } from "@/infrastructure/di-container";

import { beforeAll, describe, expect, it } from "vitest";

describe("FindMatchesByLeagueAndSeasonUseCase", () => {
  let useCase: FindMatchesByLeagueAndSeasonUseCase;

  beforeAll(async () => {
    useCase = await DIContainer.getFindMatchesByLeagueAndSeasonUseCase();
  });
  it("should return matches for a given league and season", async () => {
    const command = {
      leagueId: "la-liga-id",
      seasonId: "season-23-24",
    };

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(result.results).toBeDefined();
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.page).toBe(0);
    expect(result.pageSize).toBe(12);
    expect(result.total).toBe(4);
    expect(result.totalPages).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    result.results.forEach((match) => {
      expect(match).toHaveProperty("home");
      expect(match).toHaveProperty("away");
      expect(match).toHaveProperty("date");
      expect(match).toHaveProperty("homeColorPrimary");
      expect(match).toHaveProperty("homeColorSecondary");
      expect(match).toHaveProperty("awayColorPrimary");
      expect(match).toHaveProperty("awayColorSecondary");
      expect(match).toHaveProperty("homeScore");
      expect(match).toHaveProperty("awayScore");
      expect(match).toHaveProperty("status");
      expect(match).toHaveProperty("league");
      expect(match).toHaveProperty("season");
      expect(match.league).toBe("la-liga-id");
      expect(match.season).toBe("season-23-24");
      expect(["finished", "simulated", "chronicle_generated"]).toContain(
        match.status
      );
    });
  });

  it("should return an empty array if no matches are found for the given league and season", async () => {
    const command = {
      leagueId: "non-existent-league-id",
      seasonId: "non-existent-season-id",
    };

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(result.results).toBeDefined();
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results.length).toBe(0);
    expect(result.page).toBe(0);
    expect(result.pageSize).toBe(12);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });
});
