import { ChronicleRepository } from "@/domain/repositories/chronicle.repository";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";
import { MatchModel } from "@/infrastructure/db/models/match.model";
import { PlayerModel } from "@/infrastructure/db/models/player.model";
import { SeasonModel } from "@/infrastructure/db/models/season.model";
import { ShotModel } from "@/infrastructure/db/models/shot.model";
import { TeamModel } from "@/infrastructure/db/models/team.model";
import { DIContainer } from "@/infrastructure/di-container";
import { clearFilteredDerivedCollections } from "@/infrastructure/scripts/reset-db.helpers";
import {
  buildChronicle,
  buildLeague,
  buildMatch,
  buildPlayer,
  buildSeason,
  buildShot,
  buildSimulation,
  buildTeam,
} from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("clearFilteredDerivedCollections", () => {
  let chronicleRepository: ChronicleRepository;
  let simulationRepository: SimulationRepository;

  beforeEach(() => {
    chronicleRepository = DIContainer.getChronicleRepository();
    simulationRepository = DIContainer.getSimulationRepository();
  });

  it("should preserve players and teams during a filtered clear", async () => {
    const league = await buildLeague({ externalId: "league-safe-delete" });
    const season = await buildSeason(league._id, { seasonYear: "2022" });
    const homeTeam = await buildTeam({ externalId: 1001 });
    const awayTeam = await buildTeam({ externalId: 1002 });
    const match = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id
    );
    const player = await buildPlayer({ externalId: 2001 });
    await buildShot(match._id, player._id);

    await clearFilteredDerivedCollections({
      league: String(league.externalId),
      seasons: [season.seasonYear],
    });

    expect(await PlayerModel.countDocuments({ _id: player._id })).toBe(1);
    expect(await TeamModel.countDocuments({ _id: homeTeam._id })).toBe(1);
    expect(await TeamModel.countDocuments({ _id: awayTeam._id })).toBe(1);
  });

  it("should delete only chronicles and simulations that belong to the requested league and season", async () => {
    const targetLeague = await buildLeague({ externalId: "league-target" });
    const targetSeason = await buildSeason(targetLeague._id, {
      seasonYear: "2022",
    });
    const otherLeague = await buildLeague({ externalId: "league-other" });
    const otherSeason = await buildSeason(otherLeague._id, {
      seasonYear: "2022",
    });
    const targetHome = await buildTeam({ externalId: 1101 });
    const targetAway = await buildTeam({ externalId: 1102 });
    const otherHome = await buildTeam({ externalId: 1103 });
    const otherAway = await buildTeam({ externalId: 1104 });
    const targetMatch = await buildMatch(
      targetLeague._id,
      targetSeason._id,
      targetHome._id,
      targetAway._id
    );
    const otherMatch = await buildMatch(
      otherLeague._id,
      otherSeason._id,
      otherHome._id,
      otherAway._id
    );
    const targetPlayer = await buildPlayer({ externalId: 2101 });
    const otherPlayer = await buildPlayer({ externalId: 2102 });
    await buildShot(targetMatch._id, targetPlayer._id);
    await buildShot(otherMatch._id, otherPlayer._id);
    await buildChronicle(targetMatch._id);
    await buildChronicle(otherMatch._id);
    await buildSimulation(targetMatch._id);
    await buildSimulation(otherMatch._id);

    await clearFilteredDerivedCollections({
      league: String(targetLeague.externalId),
      seasons: [targetSeason.seasonYear],
    });

    expect(
      await chronicleRepository.findByMatchId(targetMatch._id.toString())
    ).toBeNull();
    expect(
      await chronicleRepository.findByMatchId(otherMatch._id.toString())
    ).not.toBeNull();
    expect(
      await simulationRepository.findByMatchId(targetMatch._id.toString())
    ).toBeNull();
    expect(
      await simulationRepository.findByMatchId(otherMatch._id.toString())
    ).not.toBeNull();
    expect(await ShotModel.countDocuments({ matchId: targetMatch._id })).toBe(
      0
    );
    expect(await ShotModel.countDocuments({ matchId: otherMatch._id })).toBe(1);
    expect(await MatchModel.countDocuments({ _id: targetMatch._id })).toBe(0);
    expect(await MatchModel.countDocuments({ _id: otherMatch._id })).toBe(1);
    expect(await SeasonModel.countDocuments({ _id: targetSeason._id })).toBe(0);
    expect(await SeasonModel.countDocuments({ _id: otherSeason._id })).toBe(1);
  });

  it("should clear all targeted seasons for a league when no season filter is provided", async () => {
    const targetLeague = await buildLeague({
      externalId: "league-all-seasons",
    });
    const season2022 = await buildSeason(targetLeague._id, {
      seasonYear: "2022",
    });
    const season2026 = await buildSeason(targetLeague._id, {
      seasonYear: "2026",
    });
    const otherLeague = await buildLeague({ externalId: "league-unaffected" });
    const otherSeason = await buildSeason(otherLeague._id, {
      seasonYear: "2022",
    });
    const home = await buildTeam({ externalId: 1201 });
    const away = await buildTeam({ externalId: 1202 });
    const otherHome = await buildTeam({ externalId: 1203 });
    const otherAway = await buildTeam({ externalId: 1204 });
    const match2022 = await buildMatch(
      targetLeague._id,
      season2022._id,
      home._id,
      away._id
    );
    const match2026 = await buildMatch(
      targetLeague._id,
      season2026._id,
      home._id,
      away._id
    );
    const otherMatch = await buildMatch(
      otherLeague._id,
      otherSeason._id,
      otherHome._id,
      otherAway._id
    );
    await buildChronicle(match2022._id);
    await buildChronicle(match2026._id);
    await buildChronicle(otherMatch._id);
    await buildSimulation(match2022._id);
    await buildSimulation(match2026._id);
    await buildSimulation(otherMatch._id);

    await clearFilteredDerivedCollections({
      league: String(targetLeague.externalId),
      seasons: [],
    });

    expect(
      await chronicleRepository.findByMatchId(match2022._id.toString())
    ).toBeNull();
    expect(
      await chronicleRepository.findByMatchId(match2026._id.toString())
    ).toBeNull();
    expect(
      await chronicleRepository.findByMatchId(otherMatch._id.toString())
    ).not.toBeNull();
    expect(
      await simulationRepository.findByMatchId(match2022._id.toString())
    ).toBeNull();
    expect(
      await simulationRepository.findByMatchId(match2026._id.toString())
    ).toBeNull();
    expect(
      await simulationRepository.findByMatchId(otherMatch._id.toString())
    ).not.toBeNull();
  });

  it("should clear only the requested seasons when multiple seasons are provided", async () => {
    const league = await buildLeague({ externalId: "league-multi-season" });
    const season2022 = await buildSeason(league._id, { seasonYear: "2022" });
    const season2024 = await buildSeason(league._id, { seasonYear: "2024" });
    const season2026 = await buildSeason(league._id, { seasonYear: "2026" });
    const home = await buildTeam({ externalId: 1301 });
    const away = await buildTeam({ externalId: 1302 });
    const match2022 = await buildMatch(
      league._id,
      season2022._id,
      home._id,
      away._id
    );
    const match2024 = await buildMatch(
      league._id,
      season2024._id,
      home._id,
      away._id
    );
    const match2026 = await buildMatch(
      league._id,
      season2026._id,
      home._id,
      away._id
    );
    await buildChronicle(match2022._id);
    await buildChronicle(match2024._id);
    await buildChronicle(match2026._id);
    await buildSimulation(match2022._id);
    await buildSimulation(match2024._id);
    await buildSimulation(match2026._id);

    await clearFilteredDerivedCollections({
      league: String(league.externalId),
      seasons: [season2022.seasonYear, season2026.seasonYear],
    });

    expect(
      await chronicleRepository.findByMatchId(match2022._id.toString())
    ).toBeNull();
    expect(
      await chronicleRepository.findByMatchId(match2026._id.toString())
    ).toBeNull();
    expect(
      await chronicleRepository.findByMatchId(match2024._id.toString())
    ).not.toBeNull();
    expect(
      await simulationRepository.findByMatchId(match2022._id.toString())
    ).toBeNull();
    expect(
      await simulationRepository.findByMatchId(match2026._id.toString())
    ).toBeNull();
    expect(
      await simulationRepository.findByMatchId(match2024._id.toString())
    ).not.toBeNull();
  });
});
