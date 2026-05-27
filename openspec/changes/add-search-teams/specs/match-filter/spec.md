## REMOVED Requirements

### Requirement: Filter matches by status

**Reason**: Removed to simplify the filter bar. All matches regardless of status are shown. The status field still exists in the data model but is no longer exposed as a filter in the UI.
**Migration**: Remove `statuses` URL param and `StatusFilter` component. Existing URLs with `?statuses=...` will silently ignore the parameter.

### Requirement: Filter matches by date range

**Reason**: Removed to simplify the filter bar and make room for the team search. Date navigation is covered by the season selector.
**Migration**: Remove `dateFrom`, `dateTo` URL params and `DateRangeFilter` component. Existing URLs with `?dateFrom=...&dateTo=...` will silently ignore those parameters.

## ADDED Requirements

### Requirement: Filter bar layout is season selector plus team search

The matches filter bar SHALL contain exactly two controls: the season selector on the left with its natural width, and the team search input taking the remaining horizontal space. On mobile, the two controls SHALL stack vertically.

#### Scenario: Desktop layout renders two controls side by side

- **WHEN** the page renders on a viewport wider than the mobile breakpoint
- **THEN** the filter bar shows the season selector on the left and the team search to its right, filling the available width

#### Scenario: Mobile layout stacks controls vertically

- **WHEN** the page renders on a mobile viewport
- **THEN** the season selector appears above the team search input, each taking full width
