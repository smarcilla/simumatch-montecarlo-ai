## ADDED Requirements

### Requirement: Global cache survives warm requests

The connection module SHALL use the Node.js `global` object to store the cached connection and in-flight promise, so that warm Vercel instances reuse an existing connection across multiple requests without opening new ones.

#### Scenario: Warm instance reuses existing connection

- **WHEN** a request arrives on a Vercel instance that already has an established connection
- **THEN** the system SHALL return the cached connection without calling `mongoose.connect()`

#### Scenario: Concurrent cold-start requests share one connection attempt

- **WHEN** two requests arrive simultaneously on a fresh Vercel instance with no cached connection
- **THEN** the system SHALL initiate only one `mongoose.connect()` call and both requests SHALL await the same promise

### Requirement: Failed connection allows retry on next request

The connection module SHALL reset the cached promise to `null` when a connection attempt fails, so that the next incoming request can attempt a new connection instead of receiving the previously rejected promise.

#### Scenario: Connection failure resets cache

- **WHEN** `mongoose.connect()` rejects (e.g., Atlas unreachable)
- **THEN** the cached promise SHALL be set to `null`
- **THEN** the next call to `connectToDatabase()` SHALL attempt a new connection

#### Scenario: Cached rejected promise is never returned

- **WHEN** a connection attempt has previously failed
- **THEN** subsequent calls SHALL NOT receive the rejected promise from cache

### Requirement: Connection pool is bounded for serverless

The connection module SHALL default to `maxPoolSize: 2` and SHALL read the `MONGODB_MAX_POOL_SIZE` environment variable to allow runtime tuning without code changes.

#### Scenario: Default pool size is 2

- **WHEN** `MONGODB_MAX_POOL_SIZE` is not set
- **THEN** the connection pool size SHALL be 2

#### Scenario: Pool size is configurable via environment variable

- **WHEN** `MONGODB_MAX_POOL_SIZE` is set to a numeric string
- **THEN** the connection pool SHALL use that value as `maxPoolSize`

### Requirement: autoIndex is environment-aware

The connection module SHALL enable `autoIndex` only in non-production environments.

#### Scenario: autoIndex is disabled in production

- **WHEN** `NODE_ENV` is `"production"`
- **THEN** `autoIndex` SHALL be `false`

#### Scenario: autoIndex is enabled in development

- **WHEN** `NODE_ENV` is not `"production"`
- **THEN** `autoIndex` SHALL be `true`

### Requirement: Database URI supports separate name configuration

The connection module SHALL support composing the MongoDB URI from `MONGODB_URI` and an optional `MONGODB_NAME` environment variable, appending the database name to the URI path when provided.

#### Scenario: URI uses MONGODB_NAME when provided

- **WHEN** `MONGODB_NAME` is set
- **THEN** the connection URI SHALL include `/<MONGODB_NAME>` as the path

#### Scenario: URI uses MONGODB_URI as-is when MONGODB_NAME is absent

- **WHEN** `MONGODB_NAME` is not set
- **THEN** the connection URI SHALL be `MONGODB_URI` unchanged

### Requirement: ConnectionManager provides lifecycle API for scripts and tests

The connection module SHALL export a `ConnectionManager` singleton with `initialize()`, `close()`, and `isConnected()` methods for use in scripts and test setup that require explicit connection lifecycle management.

#### Scenario: initialize() establishes connection

- **WHEN** `connectionManager.initialize()` is called
- **THEN** a database connection SHALL be established
- **THEN** `isConnected()` SHALL return `true`

#### Scenario: close() terminates connection

- **WHEN** `connectionManager.close()` is called after a successful connection
- **THEN** the database connection SHALL be closed
- **THEN** `isConnected()` SHALL return `false`

#### Scenario: initialize() is idempotent

- **WHEN** `connectionManager.initialize()` is called more than once
- **THEN** only one connection SHALL be established

### Requirement: No process signal handlers in connection module

The connection module SHALL NOT register `SIGINT`, `SIGTERM`, or `SIGUSR2` process event handlers. Signal-based shutdown is the responsibility of the caller (scripts or runtime).

#### Scenario: Signal handlers are absent

- **WHEN** the connection module is imported
- **THEN** no `process.on('SIGINT')`, `process.on('SIGTERM')`, or `process.on('SIGUSR2')` handlers SHALL be registered by the module

### Requirement: Single connection module file

The connection logic SHALL be contained in `src/infrastructure/db/connection-manager.ts` as the sole connection module. `src/infrastructure/db/client.ts` SHALL NOT exist.

#### Scenario: client.ts is removed

- **WHEN** the change is applied
- **THEN** `src/infrastructure/db/client.ts` SHALL NOT be present in the codebase
