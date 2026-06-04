## Context

The current application exposes match pages with ID-only routes (`/match/{id}`), while raw match data already provides `tournament.slug` and `slug` values that can support SEO-friendly URLs. Match data is synchronized from `league_matches_raw` into derived collections through script-driven upserts, and UI navigation currently hardcodes ID-based links in multiple components and pages.

Constraints:

- Match lookup and downstream use cases must continue to rely on `matchId` as the stable key.
- Existing links, bookmarks, and tests based on ID-only URLs must remain functional.
- The change spans multiple layers (raw sync, domain contracts, persistence, Next.js routes, and UI link builders).

Stakeholders:

- Product/SEO goals for crawlable and readable match URLs.
- Engineering teams maintaining data sync and Next.js routing.

## Goals / Non-Goals

**Goals:**

- Persist tournament and match slugs in derived match records.
- Expose slug fields to read models used by navigation/UI.
- Introduce canonical match routes: `/match/{tournamentSlug}/{matchSlug}/{matchId}`.
- Keep ID-based lookup behavior unchanged for data retrieval and business logic.
- Preserve backward compatibility by redirecting legacy ID-only routes to canonical ones.
- Cover the new behavior with unit/integration/e2e tests.

**Non-Goals:**

- Replacing ID as the primary identifier for repositories or use cases.
- Changing simulation/chronicle domain behavior.
- Introducing locale-specific slug translation logic.
- Rewriting unrelated routing patterns outside match pages.

## Decisions

### 1) Persist slugs in the Match aggregate storage contract

Decision:

- Extend match upsert contracts and persistence schema with `tournamentSlug` and `matchSlug`.
- Populate these fields from raw source (`tournament.slug`, top-level `slug`) during derived synchronization.

Rationale:

- Canonical URLs must be buildable without joining back to raw collections at request time.
- Keeping slugs on the derived match record reduces runtime complexity and enables deterministic link generation.

Alternatives considered:

- Resolve slugs dynamically from `league_matches_raw` on every request.
  Why not chosen:
- Adds runtime coupling to raw collections and unnecessary query overhead.

### 2) Use slug-plus-id canonical routing while keeping ID authoritative

Decision:

- Canonical route pattern: `/match/{tournamentSlug}/{matchSlug}/{matchId}`.
- Canonical nested routes:
  - `/match/{tournamentSlug}/{matchSlug}/{matchId}/simulation`
  - `/match/{tournamentSlug}/{matchSlug}/{matchId}/chronicle`
- Resolve match data using `matchId` only.

Rationale:

- ID remains stable and authoritative.
- Slugs provide readability and SEO value without changing domain identity.

Alternatives considered:

- Slug-only route (`/match/{tournamentSlug}/{matchSlug}`) lookup.
  Why not chosen:
- Slug collisions and slug mutation would make URLs less stable and increase lookup ambiguity.

### 3) Keep legacy routes as compatibility redirects

Decision:

- Maintain legacy routes under `/match/{id}` (and its nested pages) as compatibility entry points.
- Redirect legacy requests to canonical slug URLs when slug data is available.
- Preserve supported query parameters (for example `back`) during redirect.

Rationale:

- Avoids breaking existing links and external references.
- Provides gradual migration path for tests and consumers.

Alternatives considered:

- Remove legacy routes immediately.
  Why not chosen:
- High regression risk and avoidable operational disruption.

### 4) Centralize URL construction in a shared helper

Decision:

- Introduce a single match URL builder utility used by cards, action buttons, and page redirects.
- Utility supports detail/simulation/chronicle targets and optional query passthrough.

Rationale:

- Prevents duplicated string templates across UI layers.
- Makes canonical URL adoption consistent and easier to test.

Alternatives considered:

- Keep route strings inline in each component/page.
  Why not chosen:
- Increases drift and future maintenance cost.

### 5) Migrate in two phases: compatibility first, strictness later

Decision:

- Phase 1: deploy schema and routing changes with graceful fallback behavior for records missing slugs.
- Phase 2: run derived re-sync/backfill and then enforce canonical links everywhere.

Rationale:

- Minimizes release risk while existing data is being hydrated.

Alternatives considered:

- Single-shot release that assumes all records already contain slugs.
  Why not chosen:
- Backfill timing and data quality could cause broken canonical links.

## Risks / Trade-offs

- [Slug fields missing in old records] → Keep temporary fallback to legacy ID URLs and run backfill before enforcing canonical-only navigation.
- [Slug mismatch in incoming URL vs stored slugs] → Redirect to stored canonical URL to avoid duplicate content and stale links.
- [Increased route surface with legacy + canonical] → Centralize route helper and add route-focused tests to reduce maintenance burden.
- [Test instability during migration] → Update unit/e2e assertions to accept canonical URLs while explicitly verifying legacy redirects.

## Migration Plan

1. Add slug fields to match contracts, persistence model, and read results.
2. Implement canonical route tree and compatibility redirects from legacy routes.
3. Introduce shared URL builder and switch UI/link generation to canonical paths.
4. Run `seed:derived` to backfill slug fields for existing matches.
5. Validate with unit/integration/e2e test suites.
6. Monitor for legacy-route traffic and routing errors after release.

Rollback strategy:

- Revert URL builder usage to ID-only links while keeping additional slug fields in storage (backward-safe schema expansion).
- Keep legacy route handlers active so existing links remain valid.

## Open Questions

- Should canonical redirects be permanent (308) immediately, or temporary during rollout?. Temporaly
- Do we want to fail sync records with missing slug fields, or allow nullable slugs with fallback links?. fail sync records with missing slug fields
- Should we add explicit uniqueness/indexing constraints involving `externalId` plus slug fields, or keep slug fields non-indexed initially?. non-indexed initially.
