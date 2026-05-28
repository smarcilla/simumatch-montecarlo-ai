## ADDED Requirements

### Requirement: Tablas de stats y simulación compactan cabeceras en mobile

Las tablas `ShotPlayerStatsTable`, `ShotGoalkeeperStatsTable`, `ScoreDistributionChart` y `PlayerStatsChart` SHALL renderizar cabeceras duales (`th-full` y `th-abbr`) para que en viewports ≤640px solo se muestre la variante abreviada.

La variante abreviada SHALL usar textos de 3 caracteres o menos.

#### Scenario: Cabeceras compactas en ShotPlayerStatsTable

- **WHEN** el viewport es ≤640px
- **THEN** las cabeceras se muestran abreviadas con un máximo de 3 caracteres

#### Scenario: Cabeceras compactas en ShotGoalkeeperStatsTable

- **WHEN** el viewport es ≤640px
- **THEN** las cabeceras se muestran abreviadas con un máximo de 3 caracteres

#### Scenario: Cabeceras compactas en ScoreDistributionChart

- **WHEN** el viewport es ≤640px
- **THEN** las cabeceras de columnas se muestran con abreviaturas de máximo 3 caracteres

#### Scenario: Cabeceras compactas en PlayerStatsChart

- **WHEN** el viewport es ≤640px
- **THEN** las cabeceras de columnas se muestran con abreviaturas de máximo 3 caracteres

### Requirement: Alineación consistente en bloque away de ShotXgBar mobile

`ShotXgBar` SHALL alinear el valor xG del bloque away a la izquierda cuando el viewport es ≤640px.

#### Scenario: xG away alineado a la izquierda en mobile

- **WHEN** el viewport es ≤640px
- **THEN** el valor xG del equipo away se renderiza alineado a la izquierda, sin desplazamiento hacia la derecha

### Requirement: Orden consistente de bandera y nombre en cabecera away de ShotXgBar

`ShotXgBar` SHALL renderizar la cabecera del bloque away con el mismo orden visual que el bloque home: `TableTeamBadge` primero y nombre de equipo después.

#### Scenario: Bandera away aparece a la izquierda del nombre

- **WHEN** se renderiza la cabecera del bloque away en `ShotXgBar`
- **THEN** la bandera del equipo visitante aparece a la izquierda del nombre del equipo
