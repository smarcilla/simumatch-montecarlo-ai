import { FindMatchByIdUseCase } from "@/application/use-cases/find-match-by-id.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import { Types } from "mongoose";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
} from "@/tests/helpers/builders";

describe("FindMatchByIdUseCase", () => {
  let useCase: FindMatchByIdUseCase;

  beforeEach(async () => {
    useCase = await DIContainer.getFindMatchByIdUseCase();
  });

  it("should return a match with all expected fields", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    const match = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id
    );

    const result = await useCase.execute(match._id.toString());

    expect(result).not.toBeNull();
    expect(result!.id).toBe(match._id.toString());
    expect(result!.home).toBe(homeTeam.name);
    expect(result!.away).toBe(awayTeam.name);
    expect(result!.league).toBe(league._id.toString());
    expect(result!.season).toBe(season._id.toString());
    expect(result!).toHaveProperty("date");
    expect(result!).toHaveProperty("status");
    expect(result!).toHaveProperty("homeColorPrimary");
    expect(result!).toHaveProperty("homeColorSecondary");
    expect(result!).toHaveProperty("awayColorPrimary");
    expect(result!).toHaveProperty("awayColorSecondary");
    expect(result!).toHaveProperty("homeScore");
    expect(result!).toHaveProperty("awayScore");
  });

  it("should return null when match does not exist", async () => {
    const nonExistentId = new Types.ObjectId().toString();
    const result = await useCase.execute(nonExistentId);
    expect(result).toBeNull();
  });
});
