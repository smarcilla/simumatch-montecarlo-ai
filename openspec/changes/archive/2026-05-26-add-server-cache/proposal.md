## Why

The application has a Real Experience Score of 57/100 on Vercel Speed Insights, with LCP at 5.7s and FCP at 3s. Every page request hits MongoDB with no caching layer whatsoever — leagues, seasons, and match listings are re-fetched from the database on each visit, even though most of this data rarely or never changes.

## What Changes

- Wrap `getLeagues()` server action with `unstable_cache` (24h TTL) — league and season data is near-static.
- Wrap `getMatchesByLeagueAndSeason()` server action with `unstable_cache` (5 min TTL) when no date filters are active; bypass cache and query MongoDB directly when date filters are present.
- Cache key for matches includes: `leagueId`, `seasonId`, `page`, `pageSize`, and `statusesRaw` — all low-cardinality parameters. Date filter parameters are intentionally excluded from caching.
- Wrap `getMatchById()` with `unstable_cache` (5 min TTL) keyed by match ID.
- Keep `getMatchById()` TTL at 5 minutes and add targeted invalidation with `updateTag` for that specific match after status-changing actions (`simulateMatch`, `writeChronicle`).
- Wrap `getShotStatsByMatch()` with `unstable_cache` (1h TTL) keyed by match ID — shot stats for a finished match never change.

## Capabilities

### New Capabilities

- `server-cache`: Server-side data cache layer for read-heavy queries using Next.js `unstable_cache`. Covers league listing, match listing (without date filters), match detail, and shot statistics.

### Modified Capabilities

- `team-flag`: No requirement changes — implementation only.

## Impact

- `src/infrastructure/actions/match.actions.ts` — primary change point, wraps existing functions.
- `src/infrastructure/actions/league.actions.ts` — wraps `getLeagues`.
- No changes to repositories, use cases, domain, or UI components.
- No breaking changes to any public API or component interface.
- Vercel Data Cache is used as the storage backend (built into Next.js, no new dependencies).
