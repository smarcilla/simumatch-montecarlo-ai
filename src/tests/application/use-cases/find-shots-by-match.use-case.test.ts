import { FindShotsByMatchUseCase } from "@/application/use-cases/find-shots-by-match.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeAll, describe, expect, it } from "vitest";

const MATCH_ID = "match-la-liga-id-season-22-23-0";

describe("FindShotsByMatchUseCase", () => {
  let useCase: FindShotsByMatchUseCase;

  beforeAll(async () => {
    useCase = await DIContainer.getFindShotsByMatchUseCase();
  });

  it("should return a paginated list of shots for a match", async () => {
    const result = await useCase.execute({ matchId: MATCH_ID });
    expect(result).toBeDefined();
    expect(result.results).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThan(0);
    expect(result.page).toBe(0);
  });

  it("should return shots with the expected fields", async () => {
    const result = await useCase.execute({ matchId: MATCH_ID });
    const shot = result.results[0];
    expect(shot).toHaveProperty("id");
    expect(shot).toHaveProperty("xg");
    expect(shot).toHaveProperty("xgot");
    expect(shot).toHaveProperty("isHome");
    expect(shot).toHaveProperty("shotType");
    expect(shot).toHaveProperty("situation");
    expect(shot).toHaveProperty("bodyPart");
    expect(shot).toHaveProperty("timeSeconds");
    expect(shot).toHaveProperty("playerName");
    expect(shot).toHaveProperty("playerShortName");
    expect(shot).toHaveProperty("goalkeeperName");
  });

  it("should filter by situation (penalty)", async () => {
    const result = await useCase.execute({
      matchId: MATCH_ID,
      situations: ["penalty"],
    });
    expect(result.results.every((s) => s.situation === "penalty")).toBe(true);
  });

  it("should filter by shotType (goal)", async () => {
    const result = await useCase.execute({
      matchId: MATCH_ID,
      shotTypes: ["goal"],
    });
    expect(result.results.every((s) => s.shotType === "goal")).toBe(true);
  });

  it("should filter by isHome (home team only)", async () => {
    const result = await useCase.execute({
      matchId: MATCH_ID,
      isHome: true,
    });
    expect(result.results.every((s) => s.isHome === true)).toBe(true);
  });

  it("should sort by xg descending", async () => {
    const result = await useCase.execute({
      matchId: MATCH_ID,
      sortBy: "xg",
      sortOrder: "desc",
    });
    const xgValues = result.results.map((s) => s.xg);
    const sorted = [...xgValues].sort((a, b) => b - a);
    expect(xgValues).toEqual(sorted);
  });

  it("should respect pagination", async () => {
    const page0 = await useCase.execute({
      matchId: MATCH_ID,
      page: 0,
      pageSize: 3,
    });
    const page1 = await useCase.execute({
      matchId: MATCH_ID,
      page: 1,
      pageSize: 3,
    });
    expect(page0.page).toBe(0);
    expect(page1.page).toBe(1);
    const ids0 = page0.results.map((s) => s.id);
    const ids1 = new Set(page1.results.map((s) => s.id));
    expect(ids0.some((id) => ids1.has(id))).toBe(false);
  });

  it("should return empty results for unknown match", async () => {
    const result = await useCase.execute({ matchId: "non-existent-match" });
    expect(result.results).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
