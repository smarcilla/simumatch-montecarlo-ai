import path from "node:path";
import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";
import {
  ChronicleGeneratedContent,
  ChronicleGenerationContext,
} from "@/domain/entities/chronicle.entity";
import {
  ChronicleInputSchema,
  GeneratedChronicleSchema,
} from "@/infrastructure/llm/chronicle.schemas";

const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model(
    process.env.GENKIT_CHRONICLE_MODEL ?? "gemini-3.1-flash-lite-preview",
    {
      temperature: 0.8,
    }
  ),
  promptDir: path.resolve(process.cwd(), "src/infrastructure/llm/prompts"),
});

ai.defineSchema("ChronicleInputSchema", ChronicleInputSchema);
ai.defineSchema("GeneratedChronicleSchema", GeneratedChronicleSchema);

const chroniclePrompt = ai.prompt("chronicle");

function mapPromptInput(input: ChronicleGenerationContext) {
  return {
    matchId: input.matchId,
    relatedSimulation: {
      homeWinProbability: input.relatedSimulation.homeWinProbability,
      drawProbability: input.relatedSimulation.drawProbability,
      awayWinProbability: input.relatedSimulation.awayWinProbability,
      momentumTimeline: input.relatedSimulation.momentumTimeline,
      playerStats: input.relatedSimulation.playerStats,
      scoreDistribution: input.relatedSimulation.scoreDistribution,
      xPtsHome: input.relatedSimulation.xPtsHome,
      xPtsAway: input.relatedSimulation.xPtsAway,
      homeTeam: input.relatedSimulation.homeTeam,
      awayTeam: input.relatedSimulation.awayTeam,
      homeScore: input.relatedSimulation.homeScore,
      awayScore: input.relatedSimulation.awayScore,
    },
  };
}

export async function invokeChroniclePrompt(
  input: ChronicleGenerationContext
): Promise<ChronicleGeneratedContent | null | undefined> {
  const { output } = await chroniclePrompt(mapPromptInput(input));

  return output as ChronicleGeneratedContent | null | undefined;
}
