## Context

The matches list currently supports filtering by league, season, status, and date range. The status and date range filters are being removed entirely. In their place, a team search with autocomplete is being added. The search must be scoped to the active league/season to avoid surfacing irrelevant teams.

The key structural constraint is that `Match` documents store team references as `ObjectId` foreign keys — team names are not denormalized. This means team-name filtering requires a join: first resolve name → teamId(s), then filter matches. Additionally, no indexes exist on `matches.homeTeamId`, `matches.awayTeamId`, `teams.name`, or `teams.shortName`, so they must be added.

## Goals / Non-Goals

**Goals:**

- Team autocomplete scoped to teams that actually appear in the current league/season
- URL-driven state via team slug (`?team=fc-barcelona`) — shareable and bookmarkable
- Specific empty state when the active team has 0 matches in the current context
- Remove status and date range filtering from the UI
- Correct MongoDB indexes for efficient team lookups

**Non-Goals:**

- Global team search across leagues
- A dedicated team page or team-specific route
- Fuzzy/phonetic matching — regex case-insensitive on `name` and `shortName` is sufficient
- Flag display bugs fix — deferred to a separate spec

## Decisions

### D1: Scoped vs. global autocomplete suggestions

**Decision**: Autocomplete suggestions are scoped to teams that play in the current league/season.

**Rationale**: Showing a global team list would surface "FC Barcelona" as a suggestion inside Bundesliga, creating a misleading flow. With scoped suggestions, the dropdown only shows teams that have matches in the current context, making the empty state ("team not found") unreachable via the UI — and reachable only via direct URL manipulation, which is handled gracefully.

**Alternative considered**: Global search — simpler backend, but confusing UX. Rejected.

### D2: Two-step lookup over aggregation pipeline

**Decision**: Implement team filtering as two sequential queries:

1. `Match.distinct('homeTeamId', { leagueId, seasonId })` ∪ `Match.distinct('awayTeamId', { leagueId, seasonId })` → set of teamIds in context
2. `Team.find({ _id: { $in: teamIds }, $or: [{ name: /pat/i }, { shortName: /pat/i }] })` → suggestions

And for match filtering:

1. `Team.find({ slug: teamSlug })` → teamId
2. `Match.find({ leagueId, seasonId, $or: [{ homeTeamId: teamId }, { awayTeamId: teamId }] })`

**Rationale**: Simple, readable, easy to test. The collections are small enough that two round-trips are negligible. Aggregation pipelines with `$lookup` are harder to paginate, harder to cache, and harder to debug.

**Alternative considered**: Single aggregation pipeline — rejected for complexity and minimal performance gain.

### D3: Slug in URL (not ObjectId)

**Decision**: The URL param is `?team=fc-barcelona` (slug field), not `?team=65f3a1b2...` (ObjectId).

**Rationale**: Slugs are human-readable, shareable, and stable across environments. The Team entity already has a `slug` field. Resolution cost (slug → teamId) is a single indexed query on page load.

### D4: New `FindTeamSuggestionsUseCase` for autocomplete

**Decision**: Create a new use case that orchestrates `MatchRepository.findDistinctTeamIds()` and `TeamRepository.findByNamePattern()`.

**Rationale**: Consistent with the existing architecture pattern (use cases coordinate repositories). Avoids leaking match-collection logic into TeamRepository or vice versa.

### D5: Season change preserves team filter; league change clears it

**Decision**: `SeasonSelector` keeps the `?team` param when navigating to a different season. `SidebarClient.handleLeagueClick` already builds the URL from scratch with only `league` and `season`, so the team param is naturally cleared on league change — no extra code needed.

**Rationale**: When switching seasons within the same league, the user likely wants to explore the same team across seasons. If the team doesn't play in the new season, the empty state message explains why.

### D6: Simplify caching — always cache team-filtered results

**Decision**: Remove the `dateFrom`/`dateTo` cache bypass logic from `match.actions.ts`. With team search, all queries are cacheable with `{ teamSlug, leagueId, seasonId, page, pageSize }` as the cache key.

**Rationale**: Date range was unbounded (infinite combinations), so it bypassed cache. Team slug is finite and low-cardinality per league/season — caching is safe.

## Risks / Trade-offs

- **[Risk] `distinct` on large collections can be slow** → Mitigated by the existing `{ leagueId: 1, seasonId: 1 }` compound index on matches and the new indexes on `homeTeamId`/`awayTeamId`.
- **[Risk] Regex search without a text index does a collection scan on teams** → Mitigated by adding a regular index on `teams.name` and `teams.shortName`. A full-text index is not needed at current data scale.
- **[Risk] Stale suggestions if team data changes** → The `getTeamSuggestions` server action uses no cache (autocomplete must be real-time). Match query results are cached with `revalidate: 300`.
- **[Trade-off] Two round-trips for suggestions** → Acceptable. The teams-in-context step returns a small ID array (~20-40 teams per league/season), and the second query uses an index.
- **[Trade-off] Removing status and date filters breaks existing bookmarked URLs** → Accepted. No active users yet.

## Migration Plan

1. Add MongoDB indexes (non-blocking, can run online)
2. Deploy new code — old `statuses`/`dateFrom`/`dateTo` URL params are silently ignored once removed from `page.tsx`
3. No data migration required

## Open Questions

- None. All decisions resolved during exploration.
