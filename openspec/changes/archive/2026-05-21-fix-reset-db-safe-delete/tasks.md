## 1. Domain — Extend repository interfaces

- [x] 1.1 Add `deleteByMatchIds(matchIds: string[]): Promise<void>` to `src/domain/repositories/chronicle.repository.ts`
- [x] 1.2 Add `deleteByMatchIds(matchIds: string[]): Promise<void>` to `src/domain/repositories/simulation.repository.ts`

## 2. Infrastructure — Implement repository methods

- [x] 2.1 Implement `deleteByMatchIds` in `src/infrastructure/repositories/mongoose-chronicle.repository.ts`
- [x] 2.2 Implement `deleteByMatchIds` in `src/infrastructure/repositories/mongoose-simulation.repository.ts`

## 3. Application — New use-cases

- [x] 3.1 Create `src/application/use-cases/clear-chronicles-by-match-ids.use-case.ts` following the pattern of `clear-chronicles.use-case.ts`
- [x] 3.2 Create `src/application/use-cases/clear-simulations-by-match-ids.use-case.ts` following the pattern of `clear-simulations.use-case.ts`

## 4. DI Container — Register new use-cases

- [x] 4.1 Import and register `ClearChroniclesByMatchIdsUseCase` in `src/infrastructure/di-container.ts`
- [x] 4.2 Import and register `ClearSimulationsByMatchIdsUseCase` in `src/infrastructure/di-container.ts`

## 5. Script — Restructure reset-db clear phase

- [x] 5.1 Move `clearChronicles` and `clearSimulations` (deleteAll) inside the full-reset (`else`) branch in `reset-db.script.ts`
- [x] 5.2 In the filtered branch, call `clearChroniclesByMatchIds(matchIds)` and `clearSimulationsByMatchIds(matchIds)` using the resolved match IDs
- [x] 5.3 Remove `playerIds` and `teamIds` from `resolveDerivedTargets` — do not delete them in the filtered path
- [x] 5.4 Remove the `deleteManyByIds` calls for players and teams in `clearFilteredDerivedCollections`

## 6. Tests

- [x] 6.1 Add unit tests for `ClearChroniclesByMatchIdsUseCase`
- [x] 6.2 Add unit tests for `ClearSimulationsByMatchIdsUseCase`
- [x] 6.3 Update or add tests for the filtered clear path to assert players and teams are not deleted
- [x] 6.4 Update or add tests for the filtered clear path to assert only matching chronicles/simulations are deleted

## 7. Spec sync

- [x] 7.1 Verify all new scenarios in the delta spec pass as integration/unit tests
