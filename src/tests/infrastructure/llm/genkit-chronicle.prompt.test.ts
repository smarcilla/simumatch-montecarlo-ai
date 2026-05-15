import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

describe("GenkitChroniclePrompt configuration", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_GENAI_API_KEY;
    delete process.env.GENKIT_CHRONICLE_MODEL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns the default model name when GENKIT_CHRONICLE_MODEL is missing", async () => {
    const promptModule =
      await import("@/infrastructure/llm/genkit-chronicle.prompt");

    expect(promptModule.resolveChronicleModelName()).toBe(
      "gemini-3.1-flash-lite"
    );
  });

  it("uses GENKIT_CHRONICLE_MODEL when it is configured", async () => {
    process.env.GENKIT_CHRONICLE_MODEL = "gemini-3-flash-preview";
    const promptModule =
      await import("@/infrastructure/llm/genkit-chronicle.prompt");

    expect(promptModule.resolveChronicleModelName()).toBe(
      "gemini-3-flash-preview"
    );
  });

  it("prefers GOOGLE_API_KEY over fallback environment variables", async () => {
    process.env.GOOGLE_API_KEY = "google-key";
    process.env.GEMINI_API_KEY = "gemini-key";
    process.env.GOOGLE_GENAI_API_KEY = "google-genai-key";

    const promptModule =
      await import("@/infrastructure/llm/genkit-chronicle.prompt");

    expect(promptModule.resolveChronicleApiKey()).toBe("google-key");
  });

  it("falls back to GEMINI_API_KEY when GOOGLE_API_KEY is absent", async () => {
    process.env.GEMINI_API_KEY = "gemini-key";
    process.env.GOOGLE_GENAI_API_KEY = "google-genai-key";

    const promptModule =
      await import("@/infrastructure/llm/genkit-chronicle.prompt");

    expect(promptModule.resolveChronicleApiKey()).toBe("gemini-key");
  });

  it("falls back to GOOGLE_GENAI_API_KEY when no other key is set", async () => {
    process.env.GOOGLE_GENAI_API_KEY = "google-genai-key";

    const promptModule =
      await import("@/infrastructure/llm/genkit-chronicle.prompt");

    expect(promptModule.resolveChronicleApiKey()).toBe("google-genai-key");
  });
});
