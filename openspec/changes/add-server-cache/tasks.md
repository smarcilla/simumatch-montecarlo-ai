## 1. Cache for league data

- [ ] 1.1 In `league.actions.ts`, import `unstable_cache` from `next/cache`
- [ ] 1.2 Wrap the `leagueRepository.findAllWithSeasons()` call inside an `unstable_cache` function with key `['leagues-all']` and `revalidate: 86400`
- [ ] 1.3 Verify that the exported `getLeagues()` function signature and return type remain unchanged

## 2. Cache for match listing

- [ ] 2.1 In `match.actions.ts`, import `unstable_cache` from `next/cache`
- [ ] 2.2 Create a cached inner function for the match listing query with key parts `['matches', leagueId, seasonId, String(page), String(pageSize), statusesRaw ?? '']` and `revalidate: 300`
- [ ] 2.3 Add a guard clause in `getMatchesByLeagueAndSeason()`: if `dateFromRaw` or `dateToRaw` is non-empty, call MongoDB directly (bypass cache)
- [ ] 2.4 If no date filters are active, delegate to the cached function
- [ ] 2.5 Verify that the exported `getMatchesByLeagueAndSeason()` function signature and return type remain unchanged

## 3. Cache for match detail

- [ ] 3.1 Wrap the `getMatchById()` call inside an `unstable_cache` function with key `['match', id]` and `revalidate: 300`
- [ ] 3.2 Verify that the exported `getMatchById()` function signature and return type remain unchanged

## 4. Cache for shot statistics

- [ ] 4.1 Wrap the `getShotStatsByMatch()` call inside an `unstable_cache` function with key `['shot-stats', matchId]` and `revalidate: 3600`
- [ ] 4.2 Verify that the exported `getShotStatsByMatch()` function signature and return type remain unchanged

## 5. Validation

- [ ] 5.1 Run the E2E test suite (`pnpm exec playwright test`) and confirm all tests pass
- [ ] 5.2 Manually verify in the browser (dev mode) that the home page loads matches correctly with and without status filters
- [ ] 5.3 Manually verify that adding a date filter returns results (not an empty page or error)
- [ ] 5.4 Manually verify that the match detail page loads correctly
- [ ] 5.5 Run `pnpm build` and confirm no TypeScript or build errors
