import { ChronicleGenerator } from "@/application/ports/chronicle-generator.port";
import {
  Chronicle,
  ChronicleGeneratedContent,
  ChronicleGenerationContext,
} from "@/domain/entities/chronicle.entity";
import { ChronicleGenerationError } from "@/infrastructure/errors/chronicle-generation.error";
import { RetryOperationError } from "@/infrastructure/errors/retry-operation.error";
import { invokeChroniclePrompt } from "@/infrastructure/llm/genkit-chronicle.prompt";
import {
  getAiErrorStatusCode,
  createAiRetryPolicy,
} from "@/infrastructure/retries/ai-retry.policy";
import { executeWithRetry } from "@/infrastructure/retries/execute-with-retry";

function ensureChronicleOutput(
  output: ChronicleGeneratedContent | null | undefined
): ChronicleGeneratedContent {
  if (!output) {
    throw new Error("The model did not return a chronicle payload.");
  }

  return output;
}

export class GenkitChronicleGenerator implements ChronicleGenerator {
  async generate(input: ChronicleGenerationContext): Promise<Chronicle> {
    try {
      const output = await executeWithRetry(
        async () => ensureChronicleOutput(await invokeChroniclePrompt(input)),
        createAiRetryPolicy()
      );

      return Chronicle.createGenerated(input, output);
    } catch (error) {
      if (error instanceof RetryOperationError) {
        throw new ChronicleGenerationError(
          "Failed to generate chronicle with the configured AI provider.",
          error.attempts,
          getAiErrorStatusCode(error.cause),
          { cause: error.cause }
        );
      }

      throw new ChronicleGenerationError(
        "Failed to generate chronicle with the configured AI provider.",
        1,
        getAiErrorStatusCode(error),
        { cause: error }
      );
    }
  }
}
