## 1. Cache for league data

- [x] 1.1 In `league.actions.ts`, import `unstable_cache` from `next/cache`
- [x] 1.2 Wrap the `leagueRepository.findAllWithSeasons()` call inside an `unstable_cache` function with key `['leagues-all']` and `revalidate: 86400`
- [x] 1.3 Verify that the exported `getLeagues()` function signature and return type remain unchanged

## 2. Cache for match listing

- [x] 2.1 In `match.actions.ts`, import `unstable_cache` from `next/cache`
- [x] 2.2 Create a cached inner function for the match listing query with key parts `['matches', leagueId, seasonId, String(page), String(pageSize), statusesRaw ?? '']` and `revalidate: 300`
- [x] 2.3 Add a guard clause in `getMatchesByLeagueAndSeason()`: if `dateFromRaw` or `dateToRaw` is non-empty, call MongoDB directly (bypass cache)
- [x] 2.4 If no date filters are active, delegate to the cached function
- [x] 2.5 Verify that the exported `getMatchesByLeagueAndSeason()` function signature and return type remain unchanged

## 3. Cache for match detail

- [x] 3.1 Wrap the `getMatchById()` call inside an `unstable_cache` function with key `['match', id]` and `revalidate: 300`
- [x] 3.2 Verify that the exported `getMatchById()` function signature and return type remain unchanged

## 4. Cache for shot statistics

- [x] 4.1 Wrap the `getShotStatsByMatch()` call inside an `unstable_cache` function with key `['shot-stats', matchId]` and `revalidate: 3600`
- [x] 4.2 Verify that the exported `getShotStatsByMatch()` function signature and return type remain unchanged

## 5. Validation

- [x] 5.1 Run the E2E test suite (`pnpm exec playwright test`) and confirm all tests pass
- [x] 5.2 Manually verify in the browser (dev mode) that the home page loads matches correctly with and without status filters
- [x] 5.3 Manually verify that adding a date filter returns results (not an empty page or error)
- [x] 5.4 Manually verify that the match detail page loads correctly
- [x] 5.5 Run `pnpm build` and confirm no TypeScript or build errors

## 6. Iteration: invalidate match detail cache on state changes

- [x] 6.1 In `match.actions.ts`, add a cache tag for each match detail entry while keeping `revalidate: 300`
- [x] 6.2 In `simulation.actions.ts`, invalidate that match tag after `simulateMatch()` and `writeChronicle()`
- [x] 6.3 Validate that the code compiles and tests pass for the touched behavior
