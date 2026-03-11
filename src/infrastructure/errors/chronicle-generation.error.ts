export class ChronicleGenerationError extends Error {
  constructor(
    message: string,
    readonly attempts: number,
    readonly statusCode?: number,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = "ChronicleGenerationError";
  }
}
