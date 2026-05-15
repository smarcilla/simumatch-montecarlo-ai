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

export const CHRONICLE_DEFAULT_MODEL = "gemini-3.1-flash-lite";

export function resolveChronicleApiKey(): string | false {
  return (
    process.env.GOOGLE_API_KEY ??
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_GENAI_API_KEY ??
    false
  );
}

export function resolveChronicleModelName(): string {
  return process.env.GENKIT_CHRONICLE_MODEL ?? CHRONICLE_DEFAULT_MODEL;
}

const ai = genkit({
  plugins: [googleAI({ apiKey: resolveChronicleApiKey() })],
  model: googleAI.model(resolveChronicleModelName(), {
    temperature: 0.8,
  }),
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
