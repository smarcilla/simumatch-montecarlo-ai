## ADDED Requirements

### Requirement: App displays ExpectedScore.app brand name

The system SHALL display "ExpectedScore.app" as the application brand name in all user-visible surfaces, replacing any reference to "SimuMatch AI".

#### Scenario: Header shows correct brand name

- **WHEN** a user loads any page of the application
- **THEN** the header SHALL display the text "expected" and "score" forming the brand name "expectedscore" with the ".app" suffix visible

#### Scenario: Footer shows correct copyright

- **WHEN** a user views the footer of any page
- **THEN** the footer SHALL display "© 2026 ExpectedScore.app"

#### Scenario: Loading state shows correct brand name

- **WHEN** the page is in a loading state
- **THEN** the loading screen SHALL display "ExpectedScore.app" as the brand name

#### Scenario: Browser tab shows correct title

- **WHEN** a user opens the application in a browser
- **THEN** the browser tab title SHALL match the pattern "ExpectedScore.app | ..." as defined by the active locale

### Requirement: Header logo uses bicolor typographic treatment

The system SHALL render the brand name in the header with a bicolor typographic treatment: the word "expected" in bold weight and white color, and "score" in light weight and green mint color (`#10b981`), using the Space Grotesk display font.

#### Scenario: Logo renders correct bicolor style on desktop

- **WHEN** a user views the header on a desktop viewport (≥ 1024px)
- **THEN** "expected" SHALL appear in bold white and "score" in light green mint, separated only by adjacent inline spans

#### Scenario: Logo renders correct bicolor style on mobile

- **WHEN** a user views the header on a mobile viewport (< 768px)
- **THEN** the logo bicolor treatment SHALL be preserved and legible without truncation

### Requirement: App uses a light-mode-only color scheme

The system SHALL apply a light color scheme by default to all pages, with no dark mode fallback. The background SHALL use off-white tones coherent with the branding palette (`#f8fafc` as primary background). The system SHALL NOT respect `prefers-color-scheme: dark` media query.

#### Scenario: Application renders with light background on dark-mode OS

- **WHEN** a user with a dark-mode OS preference opens the application
- **THEN** the application background SHALL remain light (`#f8fafc` or equivalent off-white)
- **THEN** text SHALL remain dark (near-black slate tone)

#### Scenario: Primary accent color uses green mint

- **WHEN** interactive elements or accents are rendered
- **THEN** the primary accent color SHALL be `#10b981` (Green Mint Tecnológico)

### Requirement: Application has a favicon using the "e·s" isotipo

The system SHALL display a favicon in the browser tab composed of the characters "e·s" on a dark slate background (`#0f172a`) with green mint (`#10b981`) lettering.

#### Scenario: Favicon appears in browser tab

- **WHEN** a user loads any page of the application
- **THEN** the browser tab SHALL display an icon containing the "e·s" mark
