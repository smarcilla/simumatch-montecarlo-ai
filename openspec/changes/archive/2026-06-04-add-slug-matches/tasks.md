## 1. Data Contracts and Persistence

- [x] 1.1 Extend match upsert command and domain entity contracts with `tournamentSlug` and `matchSlug`.
- [x] 1.2 Extend match persistence schema/model and repository mapping to store and hydrate slug fields.
- [x] 1.3 Extend match read result DTOs and use-case mappers to expose slug fields for UI routing.

## 2. Derived Synchronization

- [x] 2.1 Extend raw match document typing in derived sync and seed scripts to include `tournament.slug` and top-level `slug`.
- [x] 2.2 Map raw slug fields into match upsert commands in both `seed:derived` and `seed:matches` flows.
- [x] 2.3 Add or update sync-focused tests to verify slug persistence and idempotent re-sync behavior.

## 3. Canonical Routing and Legacy Compatibility

- [x] 3.1 Add canonical match detail route structure for `/match/{tournamentSlug}/{matchSlug}/{matchId}` using ID-based data resolution.
- [x] 3.2 Add canonical nested routes for simulation and chronicle under the slug-based path.
- [x] 3.3 Implement legacy `/match/{matchId}` and nested route redirects to canonical paths while preserving supported query parameters.
- [x] 3.4 Implement slug mismatch canonicalization redirect for requests with valid IDs but stale slug segments.

## 4. Navigation and URL Builder Adoption

- [x] 4.1 Create a shared match URL builder utility for detail/simulation/chronicle canonical paths.
- [x] 4.2 Replace inline route string generation in match cards, action panels, and page redirects with the shared URL builder.
- [x] 4.3 Keep temporary fallback behavior for records missing slugs until backfill is complete.

## 5. Validation, Backfill, and Release Readiness

- [x] 5.1 Update unit tests that assert match href generation to cover canonical URLs and legacy redirect expectations.
- [x] 5.2 Update e2e page objects/specs to navigate and assert canonical match routes.
- [x] 5.4 Run lint, type-check, unit tests, and e2e smoke checks for routing and navigation before release.
