## ADDED Requirements

### Requirement: Derived match synchronization includes slugs

The `seed:derived` synchronization flow SHALL map `league_matches_raw.tournament.slug` to `tournamentSlug` and `league_matches_raw.slug` to `matchSlug` in derived match upsert data.

#### Scenario: Full synchronization persists match slugs

- **WHEN** `pnpm seed:derived` synchronizes a raw match that contains tournament and match slugs
- **THEN** the derived `matches` record stores `tournamentSlug` and `matchSlug` alongside existing match fields

#### Scenario: Filtered synchronization persists match slugs

- **WHEN** `pnpm seed:derived --league <externalId> --season <season>` synchronizes raw matches with slugs
- **THEN** each synchronized derived match in that scope stores `tournamentSlug` and `matchSlug`

### Requirement: Match slug synchronization remains idempotent

Repeated synchronization SHALL keep one derived match per external ID and SHALL update slug fields to the latest raw values.

#### Scenario: Re-running synchronization does not duplicate matches

- **WHEN** `seed:derived` runs multiple times with unchanged raw data
- **THEN** no duplicate derived matches are created and stored slug fields remain unchanged

#### Scenario: Re-running synchronization updates changed slugs

- **WHEN** a raw match slug value changes and `seed:derived` runs again
- **THEN** the existing derived match for that external ID is updated with the new slug value
