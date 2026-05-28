## Why

The matches list currently has no way to find matches for a specific team. Users must scroll through all matches in a league/season to find a particular team, which becomes impractical as data grows. Adding team search within the active league/season context makes the app significantly more useful for exploring a team's results.

## What Changes

- Add a team search input to the matches filter bar, replacing the existing status and date range filters
- The search input autocompletes with teams that play in the current league/season (scoped suggestions, ≥3 chars, debounced 300ms)
- Pressing Enter with no suggestion selected is a no-op; pressing Enter with suggestions takes the first one
- Selecting a team filters the matches list to only show that team's matches
- When a team is active in the filter and returns 0 results, a specific i18n message is shown: "X does not play in this league / season"
- The selected team persists in the URL as a slug: `?team=fc-barcelona`
- Changing league clears the team filter (naturally, sidebar rebuilds URL from scratch)
- Changing season preserves the team filter (user may want to compare across seasons)
- **BREAKING**: Remove `StatusFilter` and `DateRangeFilter` components from the matches filter bar
- **BREAKING**: Remove `statusesRaw`, `dateFromRaw`, `dateToRaw` from `Pagination` props and `match.actions.ts`; add `teamSlug`
- Add MongoDB indexes on `matches.homeTeamId`, `matches.awayTeamId`, `teams.name`, `teams.shortName`

## Capabilities

### New Capabilities

- `team-search`: Team autocomplete search scoped to the active league/season, with URL-driven state via team slug and a contextual empty state when the team has no matches in the current context

### Modified Capabilities

- `match-filter`: The matches filter bar changes from {season + status + dateRange} to {season + team search}. The `match-filter` capability's requirements change: status and date filtering are removed; team filtering is added.

## Impact

- **Domain**: `MatchFilterOptions`, `MatchRepository`, `TeamRepository` — new methods and fields
- **Application**: New `FindTeamSuggestionsUseCase`; updated `FindMatchesByLeagueAndSeasonUseCase` and command
- **Infrastructure**: `MongooseMatchRepository`, `MongooseTeamRepository`, new `team.actions.ts`, updated `match.actions.ts`
- **UI**: New `TeamSearchFilter` component; `MatchFiltersBar`, `SeasonSelector`, `Pagination`, `page.tsx` updated
- **i18n**: 4 new keys in `en.json` and `es.json`
- **DB**: 4 new indexes (homeTeamId, awayTeamId on matches; name, shortName on teams)
