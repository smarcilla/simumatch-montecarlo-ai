## 1. Rewrite connection-manager.ts

- [ ] 1.1 Declare the global cache type (`_mongooseCache`) with `conn` and `promise` fields at the top of the file
- [ ] 1.2 Initialize `global._mongooseCache` if not already set (HMR-safe guard)
- [ ] 1.3 Implement `buildMongoDBUri()` private function (combines `MONGODB_URI` + optional `MONGODB_NAME`)
- [ ] 1.4 Implement `getConnectionOptions()` private function returning options with `maxPoolSize`, `autoIndex` (env-conditional), `serverSelectionTimeoutMS`, `socketTimeoutMS`
- [ ] 1.5 Implement `connectToDatabase()` using global cache: return `cached.conn` if exists; set `cached.promise` with `mongoose.connect()` + `.catch(err => { cached.promise = null; throw err; })` pattern; set `cached.conn` on success
- [ ] 1.6 Implement `disconnectFromDatabase()` that disconnects and resets both `cached.conn` and `cached.promise` to `null`
- [ ] 1.7 Implement `ConnectionManager` class with `initialize()`, `close()`, and `isConnected()` methods
- [ ] 1.8 Export `connectionManager` singleton and `connectToDatabase` / `disconnectFromDatabase` functions
- [ ] 1.9 Verify NO `process.on('SIGINT')`, `process.on('SIGTERM')`, or `process.on('SIGUSR2')` handlers are present in the file

## 2. Remove client.ts

- [ ] 2.1 Delete `src/infrastructure/db/client.ts`
- [ ] 2.2 Verify no remaining imports of `client.ts` anywhere in `src/`

## 3. Update imports if needed

- [ ] 3.1 Check `src/infrastructure/di-container.ts` — confirm it imports from `connection-manager` (not `client`) and update if needed
- [ ] 3.2 Confirm `src/infrastructure/scripts/seed-derived.script.ts` imports are unaffected
- [ ] 3.3 Confirm `src/tests/setup/vitest.setup.ts` imports are unaffected

## 4. Validation

- [ ] 4.1 Run the test suite and confirm all tests pass
- [ ] 4.2 Run the linter and confirm no new errors
