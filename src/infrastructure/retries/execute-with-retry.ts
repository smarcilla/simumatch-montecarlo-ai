import { RetryOperationError } from "@/infrastructure/errors/retry-operation.error";

export interface RetryPolicy {
  maxAttempts: number;
  shouldRetry(error: unknown, attempt: number): boolean;
  getDelayMilliseconds(error: unknown, attempt: number): number;
}

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  retryPolicy: RetryPolicy
): Promise<T> {
  for (let attempt = 1; attempt <= retryPolicy.maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const shouldRetry =
        attempt < retryPolicy.maxAttempts &&
        retryPolicy.shouldRetry(error, attempt);

      if (!shouldRetry) {
        throw new RetryOperationError(attempt, error);
      }

      await sleep(retryPolicy.getDelayMilliseconds(error, attempt));
    }
  }

  throw new RetryOperationError(
    retryPolicy.maxAttempts,
    new Error("Retry execution aborted unexpectedly.")
  );
}
