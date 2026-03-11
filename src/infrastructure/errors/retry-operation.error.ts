export class RetryOperationError extends Error {
  constructor(
    readonly attempts: number,
    override readonly cause: unknown
  ) {
    super("The retried operation failed.", { cause });
    this.name = "RetryOperationError";
  }
}
