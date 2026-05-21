## ADDED Requirements

### Requirement: Landing page displays a hero section when no league is selected

The system SHALL display a hero section on the main page when no league/season is selected. The hero section SHALL include a primary headline (H1), a supporting subtitle, and a three-column explainer block describing how the model works.

#### Scenario: Hero renders when no query params are present

- **WHEN** a user visits the root URL without `league` or `season` query parameters
- **THEN** the page SHALL display the hero section instead of the previous minimal welcome banner
- **THEN** the H1 SHALL contain the text defined by `layout.hero.headline` i18n key
- **THEN** the subtitle SHALL contain the text defined by `layout.hero.subtitle` i18n key

#### Scenario: Hero section is not shown when a league is selected

- **WHEN** a user visits the page with valid `league` and `season` query parameters
- **THEN** the hero section SHALL NOT be rendered
- **THEN** the match list view SHALL be displayed instead

### Requirement: Hero section contains a three-column "How it works" explainer

The system SHALL render three equal-width columns within the hero section, each describing one step of the model: (1) xG source data, (2) Monte Carlo simulation, (3) Expected Score result. Each column SHALL have a title and a descriptive paragraph.

#### Scenario: Three columns render on desktop viewport

- **WHEN** a user views the hero section on a desktop viewport (≥ 768px)
- **THEN** the three columns SHALL be displayed side by side in a row

#### Scenario: Three columns stack on mobile viewport

- **WHEN** a user views the hero section on a mobile viewport (< 768px)
- **THEN** the three columns SHALL stack vertically, each occupying full width

#### Scenario: Column titles and descriptions match i18n keys

- **WHEN** the hero section is rendered in any locale
- **THEN** each column title SHALL use the corresponding `layout.hero.steps.*.title` i18n key
- **THEN** each column description SHALL use the corresponding `layout.hero.steps.*.description` i18n key

### Requirement: Hero section adapts layout for tablet viewports

The system SHALL present the hero section in a readable single or two-column layout on tablet viewports (768px–1023px), without horizontal overflow or truncated content.

#### Scenario: Hero section renders without overflow on tablet

- **WHEN** a user views the hero section on a tablet viewport (768px–1023px)
- **THEN** no horizontal scroll SHALL be introduced
- **THEN** all text SHALL be legible without truncation
