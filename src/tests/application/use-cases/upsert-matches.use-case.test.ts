import { UpsertMatchesUseCase } from "@/application/use-cases/upsert-matches.use-case";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { buildLeague, buildSeason, buildTeam } from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("UpsertMatchesUseCase", () => {
  let useCase: UpsertMatchesUseCase;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getUpsertMatchesUseCase();
    matchRepository = DIContainer.getMatchRepository();
  });

  it("should insert a new match resolving externalIds correctly", async () => {
    const league = await buildLeague({ externalId: "league-ext-1" });
    const season = await buildSeason(league._id, { externalId: 1001 });
    const homeTeam = await buildTeam({ externalId: 2001 });
    const awayTeam = await buildTeam({ externalId: 2002 });

    await useCase.execute([
      {
        externalId: 9001,
        homeTeamExternalId: homeTeam.externalId as number,
        awayTeamExternalId: awayTeam.externalId as number,
        leagueExternalId: league.externalId as string,
        seasonExternalId: season.externalId as number,
        date: new Date("2024-01-15").getTime(),
        homeScore: 2,
        awayScore: 1,
        status: "finished",
      },
    ]);

    const match = await matchRepository.findByExternalId(9001);
    expect(match).not.toBeNull();
    expect(match!.homeTeam.id).toBe(homeTeam._id.toString());
    expect(match!.awayTeam.id).toBe(awayTeam._id.toString());
    expect(match!.league.id).toBe(league._id.toString());
    expect(match!.season.id).toBe(season._id.toString());
    expect(match!.score.home).toBe(2);
    expect(match!.score.away).toBe(1);
    expect(match!.statusValue).toBe("finished");
  });

  it("should update an existing match when executed again with same externalId", async () => {
    const league = await buildLeague({ externalId: "league-ext-2" });
    const season = await buildSeason(league._id, { externalId: 1002 });
    const homeTeam = await buildTeam({ externalId: 3001 });
    const awayTeam = await buildTeam({ externalId: 3002 });

    const command = {
      externalId: 9002,
      homeTeamExternalId: homeTeam.externalId as number,
      awayTeamExternalId: awayTeam.externalId as number,
      leagueExternalId: league.externalId as string,
      seasonExternalId: season.externalId as number,
      date: new Date("2024-02-10").getTime(),
      homeScore: 0,
      awayScore: 0,
      status: "finished" as const,
    };

    await useCase.execute([command]);
    await useCase.execute([{ ...command, homeScore: 3, awayScore: 2 }]);

    const match = await matchRepository.findByExternalId(9002);
    expect(match).not.toBeNull();
    expect(match!.score.home).toBe(3);
    expect(match!.score.away).toBe(2);
  });

  it("should skip a match when home team externalId is not found", async () => {
    const league = await buildLeague({ externalId: "league-ext-3" });
    const season = await buildSeason(league._id, { externalId: 1003 });
    const awayTeam = await buildTeam({ externalId: 4002 });

    await useCase.execute([
      {
        externalId: 9003,
        homeTeamExternalId: 99999,
        awayTeamExternalId: awayTeam.externalId as number,
        leagueExternalId: league.externalId as string,
        seasonExternalId: season.externalId as number,
        date: Date.now(),
        homeScore: 1,
        awayScore: 0,
        status: "finished",
      },
    ]);

    expect(await matchRepository.findByExternalId(9003)).toBeNull();
  });

  it("should persist tournamentSlug and matchSlug and preserve them across repeated syncs", async () => {
    const league = await buildLeague({ externalId: "league-ext-4" });
    const season = await buildSeason(league._id, { externalId: 1004 });
    const homeTeam = await buildTeam({ externalId: 5001 });
    const awayTeam = await buildTeam({ externalId: 5002 });

    const command = {
      externalId: 9004,
      homeTeamExternalId: homeTeam.externalId as number,
      awayTeamExternalId: awayTeam.externalId as number,
      leagueExternalId: league.externalId as string,
      seasonExternalId: season.externalId as number,
      tournamentSlug: "tournament-slug-4",
      matchSlug: "match-slug-4",
      date: new Date("2024-03-10").getTime(),
      homeScore: 4,
      awayScore: 2,
      status: "finished" as const,
    };

    await useCase.execute([command]);

    let match = await matchRepository.findByExternalId(9004);
    expect(match).not.toBeNull();
    expect(match!.tournamentSlug).toBe("tournament-slug-4");
    expect(match!.matchSlug).toBe("match-slug-4");

    await useCase.execute([
      {
        ...command,
        homeScore: 5,
        awayScore: 3,
      },
    ]);

    match = await matchRepository.findByExternalId(9004);
    expect(match).not.toBeNull();
    expect(match!.tournamentSlug).toBe("tournament-slug-4");
    expect(match!.matchSlug).toBe("match-slug-4");
    expect(match!.score.home).toBe(5);
    expect(match!.score.away).toBe(3);
  });
});
