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
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((match) => {
      expect(match).toHaveProperty("home");
      expect(match).toHaveProperty("away");
      expect(match).toHaveProperty("date");
      expect(match).toHaveProperty("homeColorPrimary");
      expect(match).toHaveProperty("homeColorSecondary");
      expect(match).toHaveProperty("awayColorPrimary");
      expect(match).toHaveProperty("awayColorSecondary");
      expect(match).toHaveProperty("homeScore");
      expect(match).toHaveProperty("awayScore");
      expect(match).toHaveProperty("league");
      expect(match).toHaveProperty("season");
      expect(match.league).toBe("la-liga-id");
      expect(match.season).toBe("season-23-24");
    });
  });

  it("should return an empty array if no matches are found for the given league and season", async () => {
    const command = {
      leagueId: "non-existent-league-id",
      seasonId: "non-existent-season-id",
    };

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
