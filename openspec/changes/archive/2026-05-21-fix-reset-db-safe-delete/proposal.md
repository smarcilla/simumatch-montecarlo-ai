## Why

The filtered `reset:db --league X --season Y` deletes ALL chronicles and simulations (not just those tied to the target matches), and also deletes players and teams that are global entities shared across leagues and seasons. This causes orphaned shots in other competitions and data loss beyond the intended scope.

## What Changes

- In a filtered reset, `chronicles` and `simulations` are deleted only WHERE their `matchId` belongs to the target league+season matches — not in their entirety.
- In a filtered reset, `players` are **not deleted**. Players are global entities identified by `externalId` and can participate in multiple competitions.
- In a filtered reset, `teams` are **not deleted**. Teams are global entities identified by `externalId` and can participate in multiple competitions.
- Full reset (no filters) behaviour is unchanged: all collections are cleared entirely.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `granular-reset`: The safe-delete rules for filtered resets change. Chronicles and simulations are now scoped to the target `matchIds`. Players and teams are never deleted in a filtered reset.

## Impact

- `src/domain/repositories/chronicle.repository.ts` — new method `deleteByMatchIds`
- `src/domain/repositories/simulation.repository.ts` — new method `deleteByMatchIds`
- `src/infrastructure/repositories/mongoose-chronicle.repository.ts` — implement `deleteByMatchIds`
- `src/infrastructure/repositories/mongoose-simulation.repository.ts` — implement `deleteByMatchIds`
- `src/application/use-cases/clear-chronicles-by-match-ids.use-case.ts` — new use-case
- `src/application/use-cases/clear-simulations-by-match-ids.use-case.ts` — new use-case
- `src/infrastructure/di-container.ts` — register new use-cases
- `src/infrastructure/scripts/reset-db.script.ts` — restructure clear phase for filtered resets
- `openspec/specs/granular-reset/spec.md` — update requirements for filtered reset behaviour
