import { ClearMatchesUseCase } from "@/application/use-cases/clear-matches.use-case";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { DIContainer } from "@/infrastructure/di-container";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
} from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearMatchesUseCase", () => {
  let useCase: ClearMatchesUseCase;
  let matchRepository: MatchRepository;
  let teamRepository: TeamRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearMatchesUseCase();
    matchRepository = DIContainer.getMatchRepository();
    teamRepository = DIContainer.getTeamRepository();
  });

  it("should delete all matches", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const m1 = await buildMatch(league._id, season._id, home._id, away._id);
    const m2 = await buildMatch(league._id, season._id, home._id, away._id);

    expect(await matchRepository.findById(m1._id.toString())).not.toBeNull();
    expect(await matchRepository.findById(m2._id.toString())).not.toBeNull();

    await useCase.execute();

    expect(await matchRepository.findById(m1._id.toString())).toBeNull();
    expect(await matchRepository.findById(m2._id.toString())).toBeNull();
  });

  it("should not affect teams collection", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam({ externalId: 80001 });
    const away = await buildTeam({ externalId: 80002 });
    await buildMatch(league._id, season._id, home._id, away._id);

    await useCase.execute();

    expect(await teamRepository.findByExternalId(80001)).not.toBeNull();
    expect(await teamRepository.findByExternalId(80002)).not.toBeNull();
  });
});
