## Why

The current MongoDB connection client is designed for long-running server processes, not serverless environments. When deployed to Vercel, Next.js prefetching triggers multiple concurrent function instances, each opening up to 20 connections, resulting in 55+ simultaneous connections against a 100-connection Atlas limit. The connection logic must be rearchitected to be serverless-safe.

## What Changes

- **BREAKING**: Delete `src/infrastructure/db/client.ts` entirely
- Rewrite `src/infrastructure/db/connection-manager.ts` to absorb all connection logic from `client.ts`
- Introduce a `global` cache object that survives between requests within the same Vercel instance (warm starts), preventing redundant reconnections
- Cache the in-flight connection promise to prevent concurrent double-connects on cold starts
- Reset the cached promise on connection failure to allow retry on the next request (instead of leaving a permanently rejected promise)
- Set `maxPoolSize` to `2` by default (configurable via `MONGODB_MAX_POOL_SIZE` env var)
- Set `autoIndex` conditionally: `true` in development, `false` in production
- Remove `SIGINT`, `SIGTERM`, and `SIGUSR2` process signal handlers (irrelevant in serverless; scripts manage their own lifecycle via `connectionManager.close()`)
- Remove reconnect `setTimeout` timers (incompatible with serverless freeze/thaw lifecycle)
- Preserve `buildMongoDBUri` logic (combining `MONGODB_URI` + `MONGODB_NAME` env vars)
- Preserve `ConnectionManager` class with `initialize()` / `close()` / `isConnected()` for scripts and tests

## Capabilities

### New Capabilities

- `serverless-db-connection`: Serverless-safe MongoDB connection management using a global promise cache with failure recovery, environment-aware configuration, and a unified connection module

### Modified Capabilities

## Impact

- `src/infrastructure/db/client.ts` — deleted
- `src/infrastructure/db/connection-manager.ts` — full rewrite
- `src/infrastructure/di-container.ts` — import path updated (removes `client.ts` reference if any)
- `src/infrastructure/scripts/seed-derived.script.ts` — import unaffected (uses `connectionManager`)
- `src/tests/setup/vitest.setup.ts` — import unaffected (uses `connectionManager`)
- MongoDB Atlas connection count: from ~55 peak to ~6 peak (3 instances × 2 pool)
