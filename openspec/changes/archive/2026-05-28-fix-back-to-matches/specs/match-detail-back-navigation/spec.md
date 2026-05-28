## ADDED Requirements

### Requirement: Back navigation preserves full list URL state

When a user navigates from the match list to a match detail page, the system SHALL encode the full originating URL (including page and team filter params) in a `back` query param on the match detail URL. The "Back to matches" link SHALL use this `back` value as its destination.

#### Scenario: Navigate back with page and team filter active

- **WHEN** the user is on `/?league=X&season=Y&page=4&team=spain` and clicks on a match card
- **THEN** the match detail URL SHALL be `/match/{id}?back=%2F%3Fleague%3DX%26season%3DY%26page%3D4%26team%3Dspain`
- **THEN** clicking "Back to matches" SHALL navigate to `/?league=X&season=Y&page=4&team=spain`

#### Scenario: Navigate back with page param only

- **WHEN** the user is on `/?league=X&season=Y&page=4` and clicks on a match card
- **THEN** clicking "Back to matches" SHALL navigate to `/?league=X&season=Y&page=4`

#### Scenario: Navigate back with no extra filters

- **WHEN** the user is on `/?league=X&season=Y` and clicks on a match card
- **THEN** clicking "Back to matches" SHALL navigate to `/?league=X&season=Y`

### Requirement: Back navigation security validation

The system SHALL validate the `back` query param before using it as a redirect destination. The `back` value MUST start with `/` (relative path). If validation fails, the system SHALL fall back to `/?league={match.league}&season={match.season}`.

#### Scenario: Valid relative back URL is used

- **WHEN** the match detail page receives `?back=%2F%3Fleague%3DX%26season%3DY`
- **THEN** the decoded value starts with `/`
- **THEN** the "Back to matches" link SHALL point to `/?league=X&season=Y`

#### Scenario: Invalid absolute URL is rejected

- **WHEN** the match detail page receives `?back=https%3A%2F%2Fevil.com`
- **THEN** the decoded value does NOT start with `/`
- **THEN** the "Back to matches" link SHALL fall back to `/?league={match.league}&season={match.season}`

#### Scenario: Missing back param uses fallback

- **WHEN** the match detail page is accessed without a `back` query param (e.g., direct link)
- **THEN** the "Back to matches" link SHALL fall back to `/?league={match.league}&season={match.season}`
