import { FindMatchByIdUseCase } from "@/application/use-cases/find-match-by-id.use-case";
import { DIContainer } from "@/infrastructure/di-container";

import { beforeAll, describe, expect, it } from "vitest";

describe("FindMatchByIdUseCase", () => {
  let useCase: FindMatchByIdUseCase;

  beforeAll(async () => {
    useCase = await DIContainer.getFindMatchByIdUseCase();
  });

  it("should return a match by id", async () => {
    const matchId = "match-la-liga-id-season-22-23-0";
    const match = await useCase.execute(matchId);

    expect(match).toBeDefined();
    expect(match).toHaveProperty("id", matchId);
    expect(match).toHaveProperty("date");
    expect(match).toHaveProperty("status");
    expect(match).toHaveProperty("home");
    expect(match).toHaveProperty("away");
    expect(match).toHaveProperty("homeColorPrimary");
    expect(match).toHaveProperty("homeColorSecondary");
    expect(match).toHaveProperty("awayColorPrimary");
    expect(match).toHaveProperty("awayColorSecondary");
    expect(match).toHaveProperty("homeScore");
    expect(match).toHaveProperty("awayScore");
    expect(match).toHaveProperty("league");
    expect(match).toHaveProperty("season");
  });

  it("should return null if match not found", async () => {
    const matchId = "non-existent-match-id";
    const match = await useCase.execute(matchId);

    expect(match).toBeNull();
  });
});
