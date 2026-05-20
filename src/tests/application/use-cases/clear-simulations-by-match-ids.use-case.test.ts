import { ClearSimulationsByMatchIdsUseCase } from "@/application/use-cases/clear-simulations-by-match-ids.use-case";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";
import { DIContainer } from "@/infrastructure/di-container";
import {
  buildLeague,
  buildMatch,
  buildSeason,
  buildSimulation,
  buildTeam,
} from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearSimulationsByMatchIdsUseCase", () => {
  let useCase: ClearSimulationsByMatchIdsUseCase;
  let simulationRepository: SimulationRepository;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearSimulationsByMatchIdsUseCase();
    simulationRepository = DIContainer.getSimulationRepository();
    matchRepository = DIContainer.getMatchRepository();
  });

  it("should delete only simulations that belong to the requested match ids", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match1 = await buildMatch(league._id, season._id, home._id, away._id);
    const match2 = await buildMatch(league._id, season._id, home._id, away._id);
    await buildSimulation(match1._id);
    await buildSimulation(match2._id);

    await useCase.execute([match1._id.toString()]);

    expect(
      await simulationRepository.findByMatchId(match1._id.toString())
    ).toBeNull();
    expect(
      await simulationRepository.findByMatchId(match2._id.toString())
    ).not.toBeNull();
  });

  it("should not affect matches when deleting simulations by match ids", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);
    await buildSimulation(match._id);

    await useCase.execute([match._id.toString()]);

    expect(await matchRepository.findById(match._id.toString())).not.toBeNull();
  });
});
