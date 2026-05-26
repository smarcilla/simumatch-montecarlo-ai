## ADDED Requirements

### Requirement: League data is served from server cache

The system SHALL cache the result of the leagues and seasons query using Next.js `unstable_cache` with a 24-hour TTL. After the first request populates the cache, subsequent requests within the TTL window SHALL NOT perform a MongoDB query for league data.

#### Scenario: Leagues are returned from cache on repeated requests

- **WHEN** a request for league data is made and the cache is already populated
- **THEN** the response is served from the Next.js Data Cache without querying MongoDB

#### Scenario: Cache is populated on first request

- **WHEN** a request for league data is made and the cache is cold (first request or TTL expired)
- **THEN** MongoDB is queried, the result is stored in cache, and the result is returned to the caller

### Requirement: Match listing is served from server cache when no date filter is active

The system SHALL cache match listing queries using Next.js `unstable_cache` with a 5-minute TTL when no date filter parameters (`dateFrom`, `dateTo`) are present. The cache key SHALL include `leagueId`, `seasonId`, `page`, `pageSize`, and `statusesRaw`.

#### Scenario: Match listing is served from cache without date filters

- **WHEN** a match listing request is made with `leagueId`, `seasonId`, and optional status filters but WITHOUT date filters
- **THEN** the response is served from cache on subsequent requests within the TTL

#### Scenario: Match listing bypasses cache when date filters are active

- **WHEN** a match listing request includes a non-empty `dateFrom` or `dateTo` parameter
- **THEN** the query is executed directly against MongoDB, bypassing the cache entirely

#### Scenario: Different league or season combinations have independent cache entries

- **WHEN** two requests are made for the same page and status filters but different `leagueId` or `seasonId` values
- **THEN** each request has an independent cache entry and returns its own dataset

#### Scenario: Different pages have independent cache entries

- **WHEN** two requests are made for the same league, season, and status filters but different `page` values
- **THEN** each page has an independent cache entry

### Requirement: Match detail is served from server cache

The system SHALL cache the result of single match queries using Next.js `unstable_cache` with a 5-minute TTL, keyed by match ID.
The system SHALL support targeted invalidation of a specific match detail cache entry when that match state changes.

#### Scenario: Match detail is served from cache on repeated requests

- **WHEN** a request for a match by ID is made and the cache is already populated for that ID
- **THEN** the response is served from cache without querying MongoDB

#### Scenario: Each match ID has an independent cache entry

- **WHEN** requests are made for two different match IDs
- **THEN** each match ID has its own independent cache entry

#### Scenario: Match detail cache is invalidated when match state changes

- **WHEN** a status-changing action (`simulateMatch` or `writeChronicle`) completes for a match ID
- **THEN** the cached match detail entry for that match ID is invalidated and the next request fetches fresh data

### Requirement: Shot statistics are served from server cache

The system SHALL cache shot statistics queries using Next.js `unstable_cache` with a 1-hour TTL, keyed by match ID.

#### Scenario: Shot statistics are served from cache on repeated requests

- **WHEN** shot statistics for a match are requested and the cache is already populated
- **THEN** the result is served from cache without querying MongoDB

#### Scenario: Shot statistics cache is independent per match

- **WHEN** shot statistics are requested for two different match IDs
- **THEN** each has an independent cache entry
