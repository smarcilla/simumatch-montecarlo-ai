import { ClearChroniclesUseCase } from "@/application/use-cases/clear-chronicles.use-case";
import { ChronicleRepository } from "@/domain/repositories/chronicle.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { DIContainer } from "@/infrastructure/di-container";
import {
  buildChronicle,
  buildLeague,
  buildMatch,
  buildSeason,
  buildTeam,
} from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearChroniclesUseCase", () => {
  let useCase: ClearChroniclesUseCase;
  let chronicleRepository: ChronicleRepository;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearChroniclesUseCase();
    chronicleRepository = DIContainer.getChronicleRepository();
    matchRepository = DIContainer.getMatchRepository();
  });

  it("should delete all chronicles", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match1 = await buildMatch(league._id, season._id, home._id, away._id);
    const match2 = await buildMatch(league._id, season._id, home._id, away._id);
    await buildChronicle(match1._id);
    await buildChronicle(match2._id);

    expect(
      await chronicleRepository.findByMatchId(match1._id.toString())
    ).not.toBeNull();
    expect(
      await chronicleRepository.findByMatchId(match2._id.toString())
    ).not.toBeNull();

    await useCase.execute();

    expect(
      await chronicleRepository.findByMatchId(match1._id.toString())
    ).toBeNull();
    expect(
      await chronicleRepository.findByMatchId(match2._id.toString())
    ).toBeNull();
  });

  it("should not affect other collections", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);
    await buildChronicle(match._id);

    await useCase.execute();

    expect(await matchRepository.findById(match._id.toString())).not.toBeNull();
  });
});
