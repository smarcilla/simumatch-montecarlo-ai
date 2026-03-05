import { ClearSimulationsUseCase } from "@/application/use-cases/clear-simulations.use-case";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { DIContainer } from "@/infrastructure/di-container";
import {
  buildLeague,
  buildSeason,
  buildTeam,
  buildMatch,
  buildSimulation,
} from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClearSimulationsUseCase", () => {
  let useCase: ClearSimulationsUseCase;
  let simulationRepository: SimulationRepository;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getClearSimulationsUseCase();
    simulationRepository = DIContainer.getSimulationRepository();
    matchRepository = DIContainer.getMatchRepository();
  });

  it("should delete all simulations", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match1 = await buildMatch(league._id, season._id, home._id, away._id);
    const match2 = await buildMatch(league._id, season._id, home._id, away._id);
    await buildSimulation(match1._id);
    await buildSimulation(match2._id);

    expect(
      await simulationRepository.findByMatchId(match1._id.toString())
    ).not.toBeNull();
    expect(
      await simulationRepository.findByMatchId(match2._id.toString())
    ).not.toBeNull();

    await useCase.execute();

    expect(
      await simulationRepository.findByMatchId(match1._id.toString())
    ).toBeNull();
    expect(
      await simulationRepository.findByMatchId(match2._id.toString())
    ).toBeNull();
  });

  it("should not affect other collections", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const home = await buildTeam();
    const away = await buildTeam();
    const match = await buildMatch(league._id, season._id, home._id, away._id);
    await buildSimulation(match._id);

    await useCase.execute();

    expect(await matchRepository.findById(match._id.toString())).not.toBeNull();
  });
});
