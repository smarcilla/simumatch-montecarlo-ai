## Why

Match URLs currently rely on opaque IDs, which reduces readability and SEO value. The raw source data already includes stable tournament and match slugs, so this is the right time to introduce canonical slug-based URLs without changing ID-based match lookup.

## What Changes

- Persist `tournamentSlug` and `matchSlug` in derived match data when syncing from `league_matches_raw`.
- Extend match query results so UI layers can build URLs using slugs plus match ID.
- Introduce canonical match routes using the format `/match/{tournamentSlug}/{matchSlug}/{matchId}`.
- Support canonical nested routes for simulation and chronicle under the same slug-based path.
- Preserve compatibility for existing ID-only URLs by redirecting legacy routes to canonical URLs.
- Update navigation/link generation to use a shared canonical URL builder.
- Add automated test coverage for sync mapping, route compatibility, and URL generation.

## Capabilities

### New Capabilities

- `match-seo-routing`: Canonical slug-based match URLs with backward-compatible legacy route handling.

### Modified Capabilities

- `seed-derived`: Match synchronization now includes tournament and match slugs as part of derived match upsert data.

## Impact

- Affected systems: derived sync scripts, match upsert command/use case, match persistence model/repository, match read use cases, Next.js routing, and UI navigation components.
- API and contract impact: match read results include slug fields; canonical route contract changes from ID-only to slug plus ID.
- Operational impact: existing data requires a re-sync/backfill to populate slug fields for current matches.
- Testing impact: unit, integration, and e2e tests that assert `/match/{id}` paths must be updated or supplemented with legacy redirect assertions.
