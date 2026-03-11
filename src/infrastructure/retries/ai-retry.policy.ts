import { RetryPolicy } from "@/infrastructure/retries/execute-with-retry";

const BASE_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 8000;
const RETRYABLE_STATUS_CODES = new Set([429, 502, 503, 504]);
const RETRYABLE_ERROR_CODES = new Set([
  "429",
  "502",
  "503",
  "504",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_SOCKET",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getNestedValue(
  source: Record<string, unknown>,
  path: string[]
): unknown {
  let current: unknown = source;

  for (const segment of path) {
    if (!isRecord(current) || !(segment in current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

export function getAiErrorStatusCode(error: unknown): number | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  const candidates = [
    error.status,
    error.statusCode,
    getNestedValue(error, ["response", "status"]),
    getNestedValue(error, ["response", "statusCode"]),
    getNestedValue(error, ["cause", "status"]),
    getNestedValue(error, ["cause", "statusCode"]),
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isInteger(candidate)) {
      return candidate;
    }

    if (typeof candidate === "string") {
      const parsed = Number.parseInt(candidate, 10);

      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function getAiErrorCode(error: unknown): string | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  const candidates = [
    error.code,
    getNestedValue(error, ["cause", "code"]),
    getNestedValue(error, ["response", "data", "error", "status"]),
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.length > 0) {
      return candidate;
    }

    if (typeof candidate === "number") {
      return String(candidate);
    }
  }

  return undefined;
}

function getRetryAfterMilliseconds(error: unknown): number | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  const retryAfterHeader =
    getNestedValue(error, ["response", "headers", "retry-after"]) ??
    getNestedValue(error, ["headers", "retry-after"]);

  if (typeof retryAfterHeader === "number" && retryAfterHeader >= 0) {
    return retryAfterHeader * 1000;
  }

  if (typeof retryAfterHeader !== "string") {
    return undefined;
  }

  const asSeconds = Number.parseInt(retryAfterHeader, 10);

  if (!Number.isNaN(asSeconds)) {
    return asSeconds * 1000;
  }

  const retryDate = Date.parse(retryAfterHeader);

  if (Number.isNaN(retryDate)) {
    return undefined;
  }

  return Math.max(retryDate - Date.now(), 0);
}

function isRetryableAiError(error: unknown): boolean {
  const statusCode = getAiErrorStatusCode(error);

  if (statusCode && RETRYABLE_STATUS_CODES.has(statusCode)) {
    return true;
  }

  const errorCode = getAiErrorCode(error);

  return errorCode ? RETRYABLE_ERROR_CODES.has(errorCode) : false;
}

function computeRetryDelayMilliseconds(
  error: unknown,
  attempt: number
): number {
  const retryAfterMilliseconds = getRetryAfterMilliseconds(error);

  if (typeof retryAfterMilliseconds === "number") {
    return Math.min(retryAfterMilliseconds, MAX_RETRY_DELAY_MS);
  }

  const exponentialDelay = Math.min(
    BASE_RETRY_DELAY_MS * 2 ** (attempt - 1),
    MAX_RETRY_DELAY_MS
  );
  const jitter = Math.floor(Math.random() * 250);

  return exponentialDelay + jitter;
}

export function createAiRetryPolicy(maxAttempts = 3): RetryPolicy {
  return {
    maxAttempts,
    shouldRetry: (error) => isRetryableAiError(error),
    getDelayMilliseconds: (error, attempt) =>
      computeRetryDelayMilliseconds(error, attempt),
  };
}
