## Context

The `reset:db` script supports granular resets via `--league` and `--season` filters. When filters are provided, `clearFilteredDerivedCollections` computes document IDs affected by that league+season and deletes them. The bug is two-fold:

1. **Chronicles and simulations** are deleted in their entirety (via `deleteAll()`) before even entering the filtered path. This wipes data from unrelated leagues/seasons.
2. **Players and teams** are deleted in the filtered path even though both entities are global (unique by `externalId`, no `leagueId`/`seasonId` field). A player who scored in FIFA World Cup 2022 may also have shots in other competitions — deleting them leaves orphaned shots elsewhere.

The full-reset path (no filters) is correct and must remain unchanged.

## Goals / Non-Goals

**Goals:**

- In a filtered reset, scope the deletion of `chronicles` and `simulations` to only those associated with the target `matchIds`.
- In a filtered reset, never delete `players` or `teams`.
- Keep the full-reset path (no filters) exactly as it is today.

**Non-Goals:**

- Adding orphan-detection logic (e.g. "delete player only if no other shots reference it"). That complexity is deferred.
- Changing the re-seed phase logic.
- Altering the CLI interface.

## Decisions

### 1. Add `deleteByMatchIds` to `ChronicleRepository` and `SimulationRepository`

The two domain interfaces currently only expose `deleteAll()`. We add a focused method to delete only what is needed for a filtered reset.

**Alternatives considered:**

- Deleting via the script directly using Mongoose models: rejected — violates the architecture rule of accessing the DB only through repositories.
- Passing a filter object to `deleteAll()`: rejected — overloading `deleteAll` conflates two distinct operations.

### 2. Two new use-cases: `ClearChroniclesByMatchIdsUseCase` and `ClearSimulationsByMatchIdsUseCase`

Follows the existing pattern (`ClearChroniclesUseCase`, `ClearShotsUseCase`, etc.). The use-case receives a `string[]` of match IDs and delegates to the repository method.

### 3. Restructure the clear phase in `reset-db.script.ts`

Current flow:

```
clearChronicles (all)        ← Bug: unconditional
clearSimulations (all)       ← Bug: unconditional
if (filtered):
  clearFilteredDerivedCollections()   ← deletes players/teams too
else:
  clearAll for shots, players, matches, teams, seasons
```

New flow:

```
if (filtered):
  resolve matchIds from league+season
  clearChroniclesByMatchIds(matchIds)
  clearSimulationsByMatchIds(matchIds)
  delete shots WHERE matchId IN matchIds
  delete matches WHERE leagueId+seasonId
  delete seasons WHERE leagueId+seasonYear
  (skip players and teams)
else:
  clearChronicles (all)
  clearSimulations (all)
  clearShots, clearPlayers, clearMatches, clearTeams, clearSeasons (all)
```

### 4. Remove `playerIds` and `teamIds` from `resolveDerivedTargets`

Since players and teams are no longer deleted in filtered resets, there is no need to resolve their IDs in `resolveDerivedTargets`. The function can be simplified accordingly.

## Risks / Trade-offs

- **Partial re-seed after filtered reset**: After resetting FIFA World Cup 2022, the re-seed creates players and teams again via upsert. Since `externalId` is unique and the upsert strategy is idempotent, this is safe — existing players from other leagues are untouched, new ones are created only if absent.
- **Season deletion**: `Season` has a `leagueId` but no cross-competition concern. Deleting a season scoped to a league+year remains correct.

## Open Questions

None. All decisions have been made.
