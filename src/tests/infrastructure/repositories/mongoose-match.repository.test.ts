import { MongooseMatchRepository } from "@/infrastructure/repositories/mongoose-match.repository";
import { beforeEach, describe, expect, it } from "vitest";
import {
  buildLeague,
  buildMatch,
  buildSeason,
  buildTeam,
} from "@/tests/helpers/builders";

describe("MongooseMatchRepository", () => {
  let repository: MongooseMatchRepository;

  beforeEach(() => {
    repository = new MongooseMatchRepository();
  });

  it("should return distinct team ids for a league and season", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const otherLeague = await buildLeague();
    const otherSeason = await buildSeason(otherLeague._id);

    const teamA = await buildTeam();
    const teamB = await buildTeam();
    const teamC = await buildTeam();

    await buildMatch(league._id, season._id, teamA._id, teamB._id);
    await buildMatch(league._id, season._id, teamB._id, teamA._id);
    await buildMatch(otherLeague._id, otherSeason._id, teamC._id, teamA._id);

    const result = await repository.findDistinctTeamIds(
      league._id.toString(),
      season._id.toString()
    );

    expect(result).toHaveLength(2);
    expect(result).toContain(teamA._id.toString());
    expect(result).toContain(teamB._id.toString());
    expect(result).not.toContain(teamC._id.toString());
  });

  it("should filter matches by team ids as home or away", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);

    const teamA = await buildTeam();
    const teamB = await buildTeam();
    const teamC = await buildTeam();

    const match1 = await buildMatch(
      league._id,
      season._id,
      teamA._id,
      teamB._id
    );
    const match2 = await buildMatch(
      league._id,
      season._id,
      teamC._id,
      teamA._id
    );
    await buildMatch(league._id, season._id, teamB._id, teamC._id);

    const result = await repository.findByLeagueAndSeason(
      league._id.toString(),
      season._id.toString(),
      { page: 0, pageSize: 10 },
      { teamIds: [teamA._id.toString()] }
    );

    const matchIds = result.results.map((match) => match.id);

    expect(result.total).toBe(2);
    expect(matchIds).toContain(match1._id.toString());
    expect(matchIds).toContain(match2._id.toString());
  });
});
