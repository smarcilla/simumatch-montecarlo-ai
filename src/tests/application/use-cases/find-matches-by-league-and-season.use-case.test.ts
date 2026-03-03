import { FindMatchesByLeagueAndSeasonUseCase } from "@/application/use-cases/find-matches-by-league-and-season.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
} from "@/tests/helpers/builders";

describe("FindMatchesByLeagueAndSeasonUseCase", () => {
  let useCase: FindMatchesByLeagueAndSeasonUseCase;

  beforeEach(async () => {
    useCase = await DIContainer.getFindMatchesByLeagueAndSeasonUseCase();
  });

  it("should return matches for a given league and season", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id);
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id);

    const result = await useCase.execute({
      leagueId: league._id.toString(),
      seasonId: season._id.toString(),
    });

    expect(result.results).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(0);
    result.results.forEach((match) => {
      expect(match).toHaveProperty("id");
      expect(match).toHaveProperty("home");
      expect(match).toHaveProperty("away");
      expect(match).toHaveProperty("status");
      expect(match.league).toBe(league._id.toString());
      expect(match.season).toBe(season._id.toString());
    });
  });

  it("should return empty results when no matches exist for the given league and season", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const otherLeague = await buildLeague();
    const otherSeason = await buildSeason(otherLeague._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id);

    const result = await useCase.execute({
      leagueId: otherLeague._id.toString(),
      seasonId: otherSeason._id.toString(),
    });

    expect(result.results).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("should paginate results correctly", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    for (let i = 0; i < 5; i++) {
      await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id);
    }

    const result = await useCase.execute({
      leagueId: league._id.toString(),
      seasonId: season._id.toString(),
      page: 0,
      pageSize: 3,
    });

    expect(result.total).toBe(5);
    expect(result.results).toHaveLength(3);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(2);
  });

  it("should filter matches by status", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id, {
      status: "finished",
    });
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id, {
      status: "simulated",
    });

    const result = await useCase.execute({
      leagueId: league._id.toString(),
      seasonId: season._id.toString(),
      statuses: ["finished"],
    });

    expect(result.total).toBe(1);
    expect(result.results[0]!.status).toBe("finished");
  });

  it("should filter matches by multiple statuses", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id, {
      status: "finished",
    });
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id, {
      status: "simulated",
    });

    const result = await useCase.execute({
      leagueId: league._id.toString(),
      seasonId: season._id.toString(),
      statuses: ["finished", "simulated"],
    });

    expect(result.total).toBe(2);
    const statuses = result.results.map((m) => m.status);
    expect(statuses).toContain("finished");
    expect(statuses).toContain("simulated");
  });

  it("should filter matches by date range", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id, {
      date: new Date("2023-01-01"),
    });
    const match2 = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id,
      {
        date: new Date("2023-02-01"),
      }
    );
    await buildMatch(league._id, season._id, homeTeam._id, awayTeam._id, {
      date: new Date("2023-03-01"),
    });

    const result = await useCase.execute({
      leagueId: league._id.toString(),
      seasonId: season._id.toString(),
      dateFrom: new Date("2023-01-15"),
      dateTo: new Date("2023-02-15"),
    });

    expect(result.total).toBe(1);
    expect(result.results[0]!.id).toBe(match2._id.toString());
  });
});
