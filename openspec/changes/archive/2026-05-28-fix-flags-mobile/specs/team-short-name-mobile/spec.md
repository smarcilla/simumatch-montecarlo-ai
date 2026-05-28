## ADDED Requirements

### Requirement: Nombres de equipo en tarjetas usan shortName en mobile

`MatchCard` y `MatchDetailCard` SHALL mostrar `shortName` del equipo en viewports ≤640px y `name` en viewports >640px. El renderizado SHALL realizarse mediante dos elementos `<span>`: uno con el nombre completo (visible en desktop/tablet, oculto en mobile) y otro con el nombre corto (visible en mobile, oculto en desktop/tablet). Ambos spans estarán siempre en el DOM para compatibilidad con SSR.

`FindMatchByLeagueAndSeasonResult` y `FindMatchByIdResult` SHALL exponer los campos `homeShortName: string` y `awayShortName: string`.

En `MatchCard`, el texto visible en mobile SHALL truncarse a los primeros 3 caracteres del `shortName` para garantizar que ambas columnas de equipo caben sin overflow.

#### Scenario: MatchCard muestra shortName en mobile

- **WHEN** `MatchCard` recibe un partido con `homeShortName: "ESP"` y el viewport es ≤640px
- **THEN** el nombre del equipo local muestra "ESP" y oculta el nombre completo

#### Scenario: MatchCard trunca shortName largo a 3 caracteres

- **WHEN** `MatchCard` recibe `homeShortName: "Espanyol"` y el viewport es ≤640px
- **THEN** el texto visible en `team-name-short` es "Esp"

#### Scenario: MatchCard muestra name en desktop

- **WHEN** `MatchCard` recibe un partido con `home: "Spain"` y el viewport es >640px
- **THEN** el nombre del equipo local muestra "Spain" y oculta el shortName

#### Scenario: MatchDetailCard muestra shortName en mobile

- **WHEN** `MatchDetailCard` recibe un partido con `awayShortName: "FRA"` y el viewport es ≤640px
- **THEN** el nombre del equipo visitante muestra "FRA" y oculta el nombre completo

#### Scenario: MatchDetailCard muestra name en desktop

- **WHEN** `MatchDetailCard` recibe un partido con `away: "France"` y el viewport es >640px
- **THEN** el nombre del equipo visitante muestra "France" y oculta el shortName

#### Scenario: SSR renderiza ambos spans sin mismatch

- **WHEN** la página se renderiza en servidor
- **THEN** el HTML contiene tanto el span de nombre completo como el de nombre corto; CSS determina cuál es visible
