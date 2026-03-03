import { FindShotsByMatchUseCase } from "@/application/use-cases/find-shots-by-match.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import { Types } from "mongoose";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
  buildPlayer,
  buildShot,
  buildShots,
} from "@/tests/helpers/builders";

describe("FindShotsByMatchUseCase", () => {
  let useCase: FindShotsByMatchUseCase;

  beforeEach(async () => {
    useCase = await DIContainer.getFindShotsByMatchUseCase();
  });

  it("should return a paginated list of shots for a match", async () => {
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
    await buildShots(match._id, 5);

    const result = await useCase.execute({ matchId: match._id.toString() });

    expect(result.total).toBe(5);
    expect(result.results).toHaveLength(5);
    expect(result.page).toBe(0);
  });

  it("should return shots with the expected fields", async () => {
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
    await buildShots(match._id, 1);

    const result = await useCase.execute({ matchId: match._id.toString() });
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

  it("should filter by situation", async () => {
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
    const p1 = await buildPlayer();
    const p2 = await buildPlayer();
    await buildShot(match._id, p1._id, { situation: "penalty" });
    await buildShot(match._id, p2._id, { situation: "regular" });

    const result = await useCase.execute({
      matchId: match._id.toString(),
      situations: ["penalty"],
    });

    expect(result.total).toBe(1);
    expect(result.results[0]!.situation).toBe("penalty");
  });

  it("should filter by shotType", async () => {
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
    const p1 = await buildPlayer();
    const p2 = await buildPlayer();
    await buildShot(match._id, p1._id, { shotType: "goal" });
    await buildShot(match._id, p2._id, { shotType: "save" });

    const result = await useCase.execute({
      matchId: match._id.toString(),
      shotTypes: ["goal"],
    });

    expect(result.total).toBe(1);
    expect(result.results[0]!.shotType).toBe("goal");
  });

  it("should filter by isHome", async () => {
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
    const p1 = await buildPlayer();
    const p2 = await buildPlayer();
    await buildShot(match._id, p1._id, { isHome: true });
    await buildShot(match._id, p2._id, { isHome: false });

    const result = await useCase.execute({
      matchId: match._id.toString(),
      isHome: true,
    });

    expect(result.total).toBe(1);
    expect(result.results[0]!.isHome).toBe(true);
  });

  it("should sort by xg descending", async () => {
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
    const p1 = await buildPlayer();
    const p2 = await buildPlayer();
    const p3 = await buildPlayer();
    await buildShot(match._id, p1._id, { xg: 0.3 });
    await buildShot(match._id, p2._id, { xg: 0.1 });
    await buildShot(match._id, p3._id, { xg: 0.5 });

    const result = await useCase.execute({
      matchId: match._id.toString(),
      sortBy: "xg",
      sortOrder: "desc",
    });

    const xgValues = result.results.map((s) => s.xg);
    const sorted = [...xgValues].sort((a, b) => b - a);
    expect(xgValues).toEqual(sorted);
  });

  it("should paginate results correctly", async () => {
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
    await buildShots(match._id, 6);

    const page0 = await useCase.execute({
      matchId: match._id.toString(),
      page: 0,
      pageSize: 4,
    });
    const page1 = await useCase.execute({
      matchId: match._id.toString(),
      page: 1,
      pageSize: 4,
    });

    expect(page0.results).toHaveLength(4);
    expect(page1.results).toHaveLength(2);
    const ids0 = new Set(page0.results.map((s) => s.id));
    expect(page1.results.every((s) => !ids0.has(s.id))).toBe(true);
  });

  it("should return empty results for an unknown match", async () => {
    const result = await useCase.execute({
      matchId: new Types.ObjectId().toString(),
    });
    expect(result.results).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
