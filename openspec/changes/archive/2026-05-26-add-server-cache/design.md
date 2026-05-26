## Context

Every request to the application triggers direct MongoDB queries with no caching layer. The two highest-frequency read paths are:

1. `getLeagues()` — called on every page render (both by `page.tsx` when params are present and by the `Sidebar` server component independently).
2. `getMatchesByLeagueAndSeason()` — called on every home page render with league+season params.

Neither function is wrapped with any cache. League and season data changes on the order of months. Match listings for past seasons never change. Match listings for active seasons change occasionally (new matches played or simulated).

Next.js provides `unstable_cache` from `next/cache`, which stores results in the Vercel Data Cache (or in-memory in development). It is the standard, zero-dependency caching primitive for App Router server-side data.

## Goals / Non-Goals

**Goals:**

- Eliminate redundant MongoDB round-trips for stable data (leagues, past season matches).
- Reduce TTFB for the home page and match detail page on cache hits.
- Keep the implementation entirely within the actions layer — no changes to repositories, use cases, domain, or UI.
- Maintain correct behavior for date-filtered queries (always fresh from DB).

**Non-Goals:**

- Caching simulation or chronicle data (low-frequency reads, not a measured bottleneck).
- Broad on-demand cache invalidation beyond match detail entries.
- Caching paginated shot listings (user-driven, filters vary, not a measured bottleneck).
- Solving the structural double-fetch of leagues (page.tsx + Sidebar) — the cache makes both calls free after the first hit, so structural refactoring is deferred.

## Decisions

### Decision 1: Use `unstable_cache` at the actions layer, not the repository layer

**Chosen:** Wrap the server action functions in `match.actions.ts` and `league.actions.ts`.

**Alternatives considered:**

- Wrapping at the repository level (inside `MongooseLeagueRepository.findAllWithSeasons`) — rejected because it would couple caching infrastructure to the domain persistence layer, and the DIContainer singleton pattern would make cache key management harder to reason about.
- Wrapping at the use case level — rejected for the same reason; use cases should not know about HTTP-level caching concerns.

The actions layer is the correct boundary: it is the public interface between the Next.js server and the application layer, and it is already the place where `"use server"` is declared.

### Decision 2: Cache key strategy — include all low-cardinality params, exclude date filters

**For `getLeagues()`:** Single fixed key `['leagues-all']`. No parameters, no variation.

**For `getMatchesByLeagueAndSeason()`:**

- Cache key: `['matches', leagueId, seasonId, String(page), String(pageSize), statusesRaw ?? '']`
- Date filter parameters (`dateFromRaw`, `dateToRaw`) are intentionally excluded.
- When either date parameter is non-empty, the cache is bypassed entirely and the query goes directly to MongoDB.

**Rationale:** Date filter values are free-form strings with near-infinite cardinality. Including them in the key would create cache entries that are never reused (each user's date combination is unique). The expected usage pattern is that most users browse without date filters; date-filtered queries are exploratory and benefit less from caching. Bypassing cache for date filters avoids cache pollution and ensures users always see accurate results when filtering by date.

**For `getMatchById()`:** Key `['match', id]`. One entry per match.

**For `getShotStatsByMatch()`:** Key `['shot-stats', matchId]`. One entry per match. Shot stats for a finished match are immutable.

### Decision 3: TTL values based on data volatility

| Function                        | TTL          | Rationale                                          |
| ------------------------------- | ------------ | -------------------------------------------------- |
| `getLeagues()`                  | 86400s (24h) | Leagues and seasons are effectively static         |
| `getMatchesByLeagueAndSeason()` | 300s (5 min) | Active season listings may update                  |
| `getMatchById()`                | 300s (5 min) | Match status can change after simulate/chronicle   |
| `getShotStatsByMatch()`         | 3600s (1h)   | Shot data for a match does not change after import |

### Decision 4: Wrapping pattern — create cached inner function, export wrapper

`unstable_cache` wraps an async function reference. The cleanest pattern is to define the cached function once and call it from the exported action:

```ts
// Conceptual structure only — not implementation
const cachedGetLeagues = unstable_cache(
  async () => {
    /* DB call */
  },
  ["leagues-all"],
  { revalidate: 86400 }
);

export async function getLeagues() {
  return cachedGetLeagues();
}
```

This keeps the exported function signature unchanged so no callers need to be updated.

### Decision 5: Keep TTL and add targeted invalidation for match detail

**Chosen:** Keep `getMatchById()` at `revalidate: 300`, add tag `match-${id}` to each cached entry, and invalidate that tag after `simulateMatch` and `writeChronicle` complete.

**Alternatives considered:**

- Lowering TTL globally for match detail (for example 60s) — rejected because it increases database load for all match detail traffic while still allowing stale windows.
- Disabling cache for match detail — rejected because it would remove a meaningful performance gain on a high-frequency read path.

This approach keeps the performance benefit while eliminating the stale-status window right after user-triggered state transitions for the affected match.

## Risks / Trade-offs

**[Risk] Cache tag invalidation could be skipped on failed mutation** → If a status-changing action fails before completion, invalidation should not run. Mitigation: invalidation is executed only after successful completion of `simulateMatch` and `writeChronicle`; TTL remains as fallback behavior.

**[Risk] Date-bypass logic adds a conditional branch** → The `getMatchesByLeagueAndSeason` function must check for date params and route accordingly. This is a small but real increase in complexity. Mitigation: the logic is a single guard clause at the top of the function, clearly documented.

**[Risk] Development cache behavior differs from production** → In development, `unstable_cache` stores in memory per-process and does not persist between restarts. Tests and local debugging will always see fresh data. Mitigation: this is expected and desirable for development.

**[Risk] Cache does not help the structural double-fetch** → Leagues are still fetched twice per request on the first call (cold cache). On subsequent requests both calls hit the cache and cost nothing. Mitigation: acceptable; structural refactoring is out of scope.

## Migration Plan

1. Deploy the changes to Vercel — no database migrations, no schema changes.
2. On first deploy, all cache entries are cold. The first request per cache key hits MongoDB as today; subsequent requests are served from cache.
3. Rollback: simply revert the changes to the actions files. No persistent state is created that needs cleanup.

## Open Questions

- Should `getMatchById` TTL be configurable through environment variables for operational tuning without code changes?
