## 1. Database Indexes

- [x] 1.1 Add index on `matches.homeTeamId` in `match.model.ts`
- [x] 1.2 Add index on `matches.awayTeamId` in `match.model.ts`
- [x] 1.3 Add index on `teams.name` in `team.model.ts`
- [x] 1.4 Add index on `teams.shortName` in `team.model.ts`

## 2. Domain Layer

- [x] 2.1 Add `teamIds?: string[]` field to `MatchFilterOptions` in `src/domain/types/match-filter.ts`
- [x] 2.2 Add `findDistinctTeamIds(leagueId: string, seasonId: string): Promise<string[]>` to `MatchRepository` interface
- [x] 2.3 Add `findBySlug(slug: string): Promise<Team | null>` to `TeamRepository` interface
- [x] 2.4 Add `findByNamePattern(pattern: string, withinIds: string[]): Promise<Team[]>` to `TeamRepository` interface

## 3. Application Layer

- [x] 3.1 Add `teamIds?: string[]` to `FindMatchesByLeagueAndSeasonCommand` interface
- [x] 3.2 Update `createFindMatchesByLeagueAndSeasonCommand` factory to accept and pass `teamIds`
- [x] 3.3 Update `createMatchFilterOptions` in `match-filter.options.ts` to handle `teamIds`
- [x] 3.4 Update `FindMatchesByLeagueAndSeasonUseCase.execute` to pass `teamIds` from command to filter options
- [x] 3.5 Create `FindTeamSuggestionsUseCase` in `src/application/use-cases/find-team-suggestions.use-case.ts` — orchestrates `MatchRepository.findDistinctTeamIds` + `TeamRepository.findByNamePattern`
- [x] 3.6 Create result type `TeamSuggestionResult` (id, name, slug, flagUrl?) in `src/application/results/find-team-suggestions.result.ts`

## 4. Infrastructure — Repositories

- [x] 4.1 Implement `findDistinctTeamIds(leagueId, seasonId)` in `MongooseMatchRepository` using `Match.distinct`
- [x] 4.2 Update `findByLeagueAndSeason` in `MongooseMatchRepository` to handle `teamIds` filter with `$or: [{ homeTeamId: {$in} }, { awayTeamId: {$in} }]`
- [x] 4.3 Implement `findBySlug(slug)` in `MongooseTeamRepository`
- [x] 4.4 Implement `findByNamePattern(pattern, withinIds)` in `MongooseTeamRepository` using regex on name/shortName

## 5. Infrastructure — DI Container and Actions

- [x] 5.1 Register `FindTeamSuggestionsUseCase` in `DIContainer` (requires `MatchRepository` + `TeamRepository`)
- [x] 5.2 Create `src/infrastructure/actions/team.actions.ts` with `getTeamSuggestions(pattern, leagueId, seasonId)` server action
- [x] 5.3 Add `getTeamBySlug(slug)` server action to `team.actions.ts`
- [x] 5.4 Update `match.actions.ts`: add `teamSlug?` param to `getMatchesByLeagueAndSeason`, resolve slug → teamId before calling use case, add `teamSlug` to cache key, remove `dateFrom`/`dateTo` cache-bypass logic

## 6. Infrastructure — UI Components

- [x] 6.1 Create `TeamSearchFilter` component in `src/infrastructure/ui/components/filters/TeamSearchFilter.tsx` — client component with debounced input, suggestions dropdown, clear button, initial value from `currentTeamName` prop
- [x] 6.2 Update `MatchFiltersBar` to remove `StatusFilter` and `DateRangeFilter`, add `TeamSearchFilter`; update props to accept `currentTeamSlug` and `currentTeamName`
- [x] 6.3 Update `SeasonSelector` to remove obsolete `params.delete('statuses')`, `params.delete('dateFrom')`, `params.delete('dateTo')` calls (team param is preserved naturally)
- [x] 6.4 Update `Pagination` component: replace `statusesRaw`/`dateFromRaw`/`dateToRaw` props with `teamSlug?`; update `buildUrl` accordingly
- [x] 6.5 Add CSS for `TeamSearchFilter` component (input wrapper, dropdown, suggestion items, clear button) to `globals.css`

## 7. Page and i18n

- [x] 7.1 Update `page.tsx`: read `teamSlug` from `searchParams`; add parallel `getTeamBySlug` call; pass `teamSlug` and resolved `currentTeamName` to `MatchFiltersBar`; pass `teamSlug` to `Pagination`; remove `statusesRaw`/`dateFromRaw`/`dateToRaw`; add contextual empty state when `teamSlug` is set and `result.total === 0`
- [x] 7.2 Add i18n keys to `en.json`: `filters.noTeamSuggestions`, `filters.clearTeam`, `match.teamNotInLeague` (with `{team}` interpolation)
- [x] 7.3 Add i18n keys to `es.json` with Spanish translations for the same keys

## 8. Tests

- [x] 8.1 Add unit tests for `FindTeamSuggestionsUseCase`
- [x] 8.2 Add unit tests for `MongooseMatchRepository.findDistinctTeamIds`
- [x] 8.3 Add unit tests for `MongooseTeamRepository.findBySlug` and `findByNamePattern`
- [x] 8.4 Update `FindMatchesByLeagueAndSeasonUseCase` tests to cover `teamIds` filter
- [x] 8.5 Update `MongooseMatchRepository.findByLeagueAndSeason` tests to cover `teamIds` filter
