## ADDED Requirements

### Requirement: Team search input scoped to active league and season

The system SHALL provide a text input that allows users to search for a team within the currently active league and season. Autocomplete suggestions SHALL appear after the user has typed 3 or more characters, with a 300ms debounce. Suggestions SHALL only include teams that have matches in the current league/season context.

#### Scenario: Suggestions appear for matching teams in current context

- **WHEN** the user types 3 or more characters in the team search input
- **THEN** a dropdown appears listing teams whose name or shortName matches the pattern (case-insensitive) and who have at least one match in the current league/season

#### Scenario: No suggestions when no team matches in current context

- **WHEN** the user types 3 or more characters that match no team in the current league/season
- **THEN** the dropdown shows a "no teams found" message (i18n key: `filters.noTeamSuggestions`)

#### Scenario: Suggestions do not appear below threshold

- **WHEN** the user types fewer than 3 characters
- **THEN** no suggestions dropdown is shown

### Requirement: Selecting a team filters the matches list

The system SHALL filter the matches list to show only matches where the selected team participated (as home or away) within the current league/season. The selected team SHALL be persisted in the URL as a slug parameter `?team=<slug>`.

#### Scenario: User selects a suggestion from the dropdown

- **WHEN** the user clicks a suggestion in the dropdown
- **THEN** the URL is updated with `?team=<slug>` and `?page=0`, and the matches list shows only that team's matches

#### Scenario: User presses Enter with suggestions available

- **WHEN** the user presses Enter while the dropdown has at least one suggestion visible
- **THEN** the first suggestion is selected and the URL is updated with `?team=<slug>` and `?page=0`

#### Scenario: User presses Enter with no suggestions

- **WHEN** the user presses Enter while the dropdown is empty (no matches)
- **THEN** no navigation occurs and the current state is preserved

### Requirement: Selected team is shown in the search input on page load

The system SHALL display the selected team's name in the search input when the page loads with a `?team=<slug>` URL parameter.

#### Scenario: Page loads with a team slug in the URL

- **WHEN** the page is loaded with `?team=fc-barcelona` in the URL
- **THEN** the search input displays the team's full name (e.g., "FC Barcelona") and the matches list is filtered to that team's matches

### Requirement: Team filter can be cleared

The system SHALL provide a clear button (×) on the search input when a team is selected. Clicking it SHALL remove the `?team` param from the URL and reset `?page=0`, showing all matches for the current league/season.

#### Scenario: User clears the team filter

- **WHEN** the user clicks the × button while a team is selected
- **THEN** the `?team` param is removed from the URL and the full matches list is restored

### Requirement: Empty state when selected team has no matches in current context

The system SHALL display a contextual empty state message when the `?team` param is present but the team has no matches in the current league/season. The message SHALL include the team name and SHALL be available in all supported languages.

#### Scenario: Team exists but has no matches in the current league/season

- **WHEN** the page loads with `?team=fc-barcelona` but FC Barcelona has no matches in the active league/season
- **THEN** the matches grid is empty and a message is shown: "[Team Name] does not play in this league / season" (i18n key: `match.teamNotInLeague`)

### Requirement: Changing season preserves the team filter

The system SHALL preserve the `?team` param when the user changes the active season via the season selector.

#### Scenario: User changes season with team filter active

- **WHEN** a team is selected and the user changes the season
- **THEN** the `?team` param is preserved in the new URL and the matches list reflects that team's matches in the new season (or shows the empty state if none)

### Requirement: Changing league clears the team filter

The system SHALL clear the `?team` param when the user selects a different league from the sidebar.

#### Scenario: User changes league with team filter active

- **WHEN** a team is selected and the user clicks a different league in the sidebar
- **THEN** the `?team` param is absent from the new URL and the full matches list for the new league/season is shown
