import { beforeEach, describe, expect, it } from "vitest";
import { GenerateChronicleUseCase } from "@/application/use-cases/generate-chronicle.use-case";
import { ChronicleGenerator } from "@/application/ports/chronicle-generator.port";
import {
  Chronicle,
  ChronicleGeneratedContent,
  ChronicleGenerationContext,
} from "@/domain/entities/chronicle.entity";
import { DIContainer } from "@/infrastructure/di-container";
import { ChronicleModel } from "@/infrastructure/db/models/chronicle.model";
import {
  buildGeneratedChronicle,
  buildGeneratedChronicleContent,
  buildLeague,
  buildMatch,
  buildSeason,
  buildSimulation,
  buildTeam,
} from "@/tests/helpers/builders";

class FakeChronicleGenerator implements ChronicleGenerator {
  lastInput: ChronicleGenerationContext | null = null;

  constructor(private generatedContent: ChronicleGeneratedContent) {}

  async generate(input: ChronicleGenerationContext): Promise<Chronicle> {
    this.lastInput = input;
    return buildGeneratedChronicle(input, this.generatedContent);
  }

  setGeneratedContent(generatedContent: ChronicleGeneratedContent): void {
    this.generatedContent = generatedContent;
  }
}

describe("GenerateChronicleUseCase", () => {
  let useCase: GenerateChronicleUseCase;
  let chronicleGenerator: FakeChronicleGenerator;
  let matchId: string;
  let homeTeamName: string;
  let awayTeamName: string;

  beforeEach(async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam({ name: "Athletic Test" });
    const awayTeam = await buildTeam({ name: "Valencia Test" });
    const match = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id,
      {
        status: "simulated",
        homeScore: 2,
        awayScore: 1,
      }
    );

    await buildSimulation(match._id, {
      homeWinProbability: 0.52,
      drawProbability: 0.24,
      awayWinProbability: 0.24,
      xPtsHome: 1.8,
      xPtsAway: 0.96,
      scoreDistribution: [{ home: 2, away: 1, count: 940, percentage: 9.4 }],
      playerStats: [
        {
          playerId: homeTeam._id.toString(),
          playerName: "Athletic Finisher",
          playerShortName: "A. Finisher",
          isHome: true,
          goalProbability: 34,
          sga: 0.42,
        },
      ],
      momentumTimeline: [
        {
          minute: 13,
          homeWinProbability: 0.44,
          drawProbability: 0.33,
          awayWinProbability: 0.23,
        },
        {
          minute: 57,
          homeWinProbability: 0.61,
          drawProbability: 0.23,
          awayWinProbability: 0.16,
        },
      ],
    });

    chronicleGenerator = new FakeChronicleGenerator(
      buildGeneratedChronicleContent()
    );
    useCase = new GenerateChronicleUseCase(
      DIContainer.getMatchRepository(),
      DIContainer.getSimulationRepository(),
      DIContainer.getChronicleRepository(),
      chronicleGenerator
    );
    matchId = match._id.toString();
    homeTeamName = homeTeam.name;
    awayTeamName = awayTeam.name;
  });

  it("should generate and persist a chronicle and update match status", async () => {
    const result = await useCase.execute(matchId);

    const saved =
      await DIContainer.getChronicleRepository().findByMatchId(matchId);
    const updatedMatch =
      await DIContainer.getMatchRepository().findById(matchId);

    expect(result?.matchId).toBe(matchId);
    expect(saved).not.toBeNull();
    expect(saved?.title).toBe("Crónica de control local");
    expect(updatedMatch?.statusValue).toBe("chronicle_generated");
  });

  it("should build generation input from match and simulation data", async () => {
    await useCase.execute(matchId);

    expect(chronicleGenerator.lastInput).not.toBeNull();
    expect(chronicleGenerator.lastInput?.matchId).toBe(matchId);
    expect(chronicleGenerator.lastInput?.relatedSimulation.homeTeam).toBe(
      homeTeamName
    );
    expect(chronicleGenerator.lastInput?.relatedSimulation.awayTeam).toBe(
      awayTeamName
    );
    expect(chronicleGenerator.lastInput?.relatedSimulation.homeScore).toBe(2);
    expect(chronicleGenerator.lastInput?.relatedSimulation.awayScore).toBe(1);
  });

  it("should upsert the chronicle for the same match", async () => {
    await useCase.execute(matchId);
    chronicleGenerator.setGeneratedContent(
      buildGeneratedChronicleContent({ title: "Nueva versión editorial" })
    );

    await useCase.execute(matchId);

    const saved =
      await DIContainer.getChronicleRepository().findByMatchId(matchId);
    const count = await ChronicleModel.countDocuments({ matchId });

    expect(saved?.title).toBe("Nueva versión editorial");
    expect(count).toBe(1);
  });

  it("should fail when the match does not exist", async () => {
    await expect(
      useCase.execute("507f1f77bcf86cd799439011")
    ).resolves.toBeNull();
  });

  it("should return null when the match is not simulated", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    const match = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id,
      {
        status: "finished",
      }
    );

    await buildSimulation(match._id);

    await expect(useCase.execute(match._id.toString())).resolves.toBeNull();
  });

  it("should fail when the simulation does not exist", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const homeTeam = await buildTeam();
    const awayTeam = await buildTeam();
    const match = await buildMatch(
      league._id,
      season._id,
      homeTeam._id,
      awayTeam._id,
      {
        status: "simulated",
      }
    );

    await expect(useCase.execute(match._id.toString())).resolves.toBeNull();
  });
});
