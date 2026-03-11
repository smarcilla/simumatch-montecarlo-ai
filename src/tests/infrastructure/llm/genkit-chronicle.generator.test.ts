import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildGeneratedChronicleContent,
  buildLeague,
  buildMatch,
  buildSeason,
  buildSimulation,
  buildTeam,
} from "@/tests/helpers/builders";

const promptModule = vi.hoisted(() => ({
  invokeChroniclePrompt: vi.fn(),
}));

vi.mock("@/infrastructure/llm/genkit-chronicle.prompt", () => promptModule);

import { ChronicleGenerationContext } from "@/domain/entities/chronicle.entity";
import type { GenkitChronicleGenerator } from "@/infrastructure/llm/genkit-chronicle.generator";

describe("GenkitChronicleGenerator", () => {
  let generator: GenkitChronicleGenerator;
  let generationContext: ChronicleGenerationContext;

  beforeEach(async () => {
    vi.resetModules();
    promptModule.invokeChroniclePrompt.mockReset();

    const [{ DIContainer }, { GenkitChronicleGenerator }] = await Promise.all([
      import("@/infrastructure/di-container"),
      import("@/infrastructure/llm/genkit-chronicle.generator"),
    ]);

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
      homeWinProbability: 0.55,
      drawProbability: 0.2,
      awayWinProbability: 0.25,
      xPtsHome: 1.9,
      xPtsAway: 0.8,
    });

    const matchEntity = await DIContainer.getMatchRepository().findById(
      match._id.toString()
    );
    const simulationEntity =
      await DIContainer.getSimulationRepository().findByMatchId(
        match._id.toString()
      );

    if (!matchEntity || !simulationEntity) {
      throw new Error("Failed to create generator test fixtures.");
    }

    generationContext = ChronicleGenerationContext.create(
      matchEntity,
      simulationEntity
    );
    generator = new GenkitChronicleGenerator();
  });

  it("should return a chronicle built from the prompt payload", async () => {
    promptModule.invokeChroniclePrompt.mockResolvedValue(
      buildGeneratedChronicleContent({ title: "Crónica generada" })
    );

    const result = await generator.generate(generationContext);

    expect(result.matchId).toBe(generationContext.matchId);
    expect(result.title).toBe("Crónica generada");
    expect(result.relatedSimulation.homeTeam).toBe(
      generationContext.relatedSimulation.homeTeam
    );
  });

  it("should retry transient provider failures and eventually succeed", async () => {
    promptModule.invokeChroniclePrompt
      .mockRejectedValueOnce({
        status: 503,
        response: { headers: { "retry-after": "0" } },
      })
      .mockResolvedValueOnce(buildGeneratedChronicleContent());

    const result = await generator.generate(generationContext);

    expect(result.title).toBe("Crónica de control local");
    expect(promptModule.invokeChroniclePrompt).toHaveBeenCalledTimes(2);
  });

  it("should stop immediately on non-retryable failures", async () => {
    promptModule.invokeChroniclePrompt.mockRejectedValue({ status: 400 });

    await expect(generator.generate(generationContext)).rejects.toMatchObject({
      name: "ChronicleGenerationError",
      attempts: 1,
      statusCode: 400,
    });
    expect(promptModule.invokeChroniclePrompt).toHaveBeenCalledTimes(1);
  });

  it("should wrap exhausted retries with infrastructure context", async () => {
    promptModule.invokeChroniclePrompt.mockRejectedValue({
      status: 503,
      response: { headers: { "retry-after": "0" } },
    });

    await expect(generator.generate(generationContext)).rejects.toMatchObject({
      attempts: 3,
      statusCode: 503,
      name: "ChronicleGenerationError",
    });
  });
});
