## ADDED Requirements

### Requirement: Canonical match detail URL

The system SHALL expose match detail pages with the canonical path `/match/{tournamentSlug}/{matchSlug}/{matchId}`.

#### Scenario: Listing navigation uses canonical URL

- **WHEN** a user opens a match card for a match with stored slugs
- **THEN** the generated link points to `/match/{tournamentSlug}/{matchSlug}/{matchId}` for that match

### Requirement: Canonical nested match routes

The system SHALL expose canonical nested routes for simulation and chronicle under the canonical match path.

#### Scenario: Canonical simulation path

- **WHEN** a user navigates to match simulation
- **THEN** the route is `/match/{tournamentSlug}/{matchSlug}/{matchId}/simulation`

#### Scenario: Canonical chronicle path

- **WHEN** a user navigates to match chronicle
- **THEN** the route is `/match/{tournamentSlug}/{matchSlug}/{matchId}/chronicle`

### Requirement: Legacy match URLs remain compatible

The system SHALL keep legacy ID-only routes functional and redirect them to the canonical slug-based route when slug data exists.

#### Scenario: Legacy detail URL redirect

- **WHEN** a user opens `/match/{matchId}` for a match that has stored slugs
- **THEN** the system redirects to `/match/{tournamentSlug}/{matchSlug}/{matchId}`

#### Scenario: Legacy nested URL redirect

- **WHEN** a user opens `/match/{matchId}/simulation` or `/match/{matchId}/chronicle` for a match that has stored slugs
- **THEN** the system redirects to the canonical nested route that includes `{tournamentSlug}` and `{matchSlug}`

### Requirement: Match data resolution remains ID-based

The system SHALL resolve match data using `matchId` as the authoritative identifier, independent of slug path segments.

#### Scenario: Canonical URL with stale slugs

- **WHEN** a request contains a valid `matchId` but slug segments that do not match stored values
- **THEN** the system resolves the match by `matchId` and redirects to the stored canonical slug path
