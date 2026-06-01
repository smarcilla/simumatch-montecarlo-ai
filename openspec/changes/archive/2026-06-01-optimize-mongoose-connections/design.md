## Context

The application runs on Vercel (serverless) and uses MongoDB Atlas with a 100-connection limit. The current connection client (`client.ts`) was designed for long-running Node.js processes. It uses module-level variables (`isConnecting`, `listenersRegistered`) that only protect against concurrent connections within a single process, not across Vercel function instances.

Next.js prefetching causes multiple serverless instances to spin up simultaneously on page load. Each instance runs its own process, initializes its own module-level state, and opens a connection pool of up to 20 connections. This leads to 55+ simultaneous connections in production.

The fix is to adopt the standard serverless MongoDB pattern: use `global` object storage to survive across requests within the same warm instance, and cache the in-flight connection promise to handle concurrent cold-start requests within a single instance.

Current files involved:

- `src/infrastructure/db/client.ts` — low-level connect/disconnect logic
- `src/infrastructure/db/connection-manager.ts` — thin lifecycle wrapper (`initialize` / `close`)
- `src/infrastructure/di-container.ts` — calls `connectionManager.initialize()` on every server action
- `src/infrastructure/scripts/seed-derived.script.ts` — uses full lifecycle (initialize + close)
- `src/tests/setup/vitest.setup.ts` — uses `connectionManager.initialize()` in `beforeAll`

## Goals / Non-Goals

**Goals:**

- Reduce connection count from ~55 to ~6 peak on Vercel
- Prevent permanently rejected promise cache on connection failure (allow retry)
- Merge `client.ts` into `connection-manager.ts` (single file, single responsibility)
- Preserve the `ConnectionManager` class API for scripts and tests
- Preserve `buildMongoDBUri` for `MONGODB_NAME` support
- Tune connection options for serverless (low pool, no autoIndex in prod)

**Non-Goals:**

- Changing how data is fetched (queries, repositories, use cases)
- Implementing connection pooling across instances (requires external proxy like Atlas Data API or connection pooler)
- Adding retry logic beyond resetting the cached promise
- Modifying the `DIContainer` API

## Decisions

### D1: Delete `client.ts`, merge into `connection-manager.ts`

`client.ts` and `connection-manager.ts` are tightly coupled — `connection-manager.ts` is a trivial wrapper that adds no logic beyond delegating to `client.ts`. Splitting them creates indirection with no benefit.

**Alternative considered**: Keep both files, only fix `client.ts`.
**Rejected**: Preserves the confusing split. The `ConnectionManager` class already owns the public API; the internal implementation should live with it.

### D2: Global cache pattern for serverless

```
global._mongooseCache = { conn: Mongoose | null, promise: Promise | null }
```

`global` in Node.js persists for the lifetime of the process. On Vercel, a warm instance reuses the same process across requests, so `global._mongooseCache.conn` survives between requests. A cold start gets a new process with an empty cache and connects once.

**Why not module-level variables (current approach)?**
Module-level state also persists within a process, but the current code adds unnecessary complexity (event listeners, `isConnecting` flag) that doesn't survive the freeze/thaw cycle cleanly. The global cache is the established pattern for Next.js + Mongoose on Vercel.

**Why `global` instead of module-level?**
In Next.js dev mode, hot module replacement can reset module-level variables. `global` survives HMR. In production this distinction doesn't matter, but the pattern is consistent.

### D3: Reset cached promise on failure

```typescript
cached.promise = mongoose.connect(...).catch(err => {
  cached.promise = null;
  throw err;
});
```

If the Atlas cluster is unreachable during a cold start, `mongoose.connect()` returns a rejected promise. Without resetting, the rejected promise stays cached and every subsequent request in that instance fails immediately without retrying — the instance becomes a zombie until Vercel recycles it.

Resetting `cached.promise = null` on failure allows the next request to attempt reconnection.

**Note**: `cached.conn` is only set after a successful connection, so no reset is needed there.

### D4: `maxPoolSize: 2` by default, configurable

With 2 connections per pool and an estimated 10 simultaneous warm Vercel instances under normal load, the maximum connection count is 20 — well under the 100-connection Atlas limit. The `MONGODB_MAX_POOL_SIZE` environment variable allows tuning without code changes.

**Alternatives considered**:

- `maxPoolSize: 5` (the suggested solution): 50 connections at 10 instances — acceptable but leaves less headroom
- `maxPoolSize: 10`: 100 connections at 10 instances — hits the limit exactly, no safety margin

### D5: `autoIndex` conditional on environment

```typescript
autoIndex: process.env.NODE_ENV !== "production";
```

`autoIndex: true` in development ensures index definitions on Mongoose models are synchronized on connect, catching missing-index bugs early. `autoIndex: false` in production avoids the overhead on every cold start and prevents unintended index mutations.

**Alternative considered**: Always `false` (the suggested solution).
**Rejected**: Hides index problems until production.

### D6: Remove process signal handlers

`SIGINT`, `SIGTERM`, and `SIGUSR2` handlers in `client.ts` are designed for long-running servers. Vercel serverless functions are terminated by the runtime without sending these signals. The handlers are dead code in production.

In development (local Next.js dev server), the graceful shutdown is handled by Next.js itself.

Scripts that need graceful shutdown already call `connectionManager.close()` explicitly.

### D7: Remove reconnect `setTimeout` timers

The `disconnected` event listener with a `setTimeout` retry was designed for persistent server processes. In serverless, an instance that loses its database connection is simply abandoned — the next request gets a new instance (or a warm one that retries via the global cache reset). The timer adds complexity with no benefit.

## Risks / Trade-offs

- **Cold start latency**: Every new Vercel instance pays the connection cost once. With `maxPoolSize: 2` the connection is faster than with 20, but it still adds ~100-300ms to cold starts. → No mitigation needed; this is inherent to serverless.

- **Low pool under burst traffic**: With `maxPoolSize: 2`, a single instance processing many concurrent requests queues them against 2 connections. For the current low-traffic scenario this is fine. → `MONGODB_MAX_POOL_SIZE` env var allows increasing it without code changes.

- **No cross-instance coordination**: 10 instances × 2 = 20 connections. As traffic grows and Vercel scales to more instances, connections grow linearly. → Long-term solution is a connection pooler (e.g., Atlas connection string with `?maxPoolSize=` at the cluster level, or PgBouncer-equivalent for Mongo). Out of scope for this change.

- **HMR in dev mode**: Hot module replacement in Next.js dev can cause multiple `mongoose.connect()` calls if the global cache is not initialized. The `global._mongooseCache` pattern handles this correctly — the cache persists across HMR.

## Open Questions

- None. All decisions are resolved based on the exploration session.
