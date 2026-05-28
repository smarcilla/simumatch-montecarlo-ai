## ADDED Requirements

### Requirement: Cabeceras de tabla de disparos abreviadas en mobile con tooltip

Las cabeceras "Equipo" y "Situación" de `ShotsTable` SHALL mostrar su versión abreviada en viewports ≤640px. Cada `<th>` SHALL incluir el atributo `data-tooltip` con el nombre completo de la columna para que el tooltip CSS existente lo muestre al hacer hover/focus/active. En viewports >640px SHALL mostrarse el nombre completo sin abreviatura.

Los ficheros de mensajes i18n SHALL incluir las claves `shots.tableHeaders.teamShort` y `shots.tableHeaders.situationShort` tanto en `es.json` como en `en.json`.

#### Scenario: Cabecera "Equipo" muestra abreviatura en mobile

- **WHEN** el viewport es ≤640px
- **THEN** la cabecera "Equipo" muestra el texto abreviado (ej. "Equ." en ES) y oculta el texto completo

#### Scenario: Cabecera "Equipo" muestra nombre completo en desktop

- **WHEN** el viewport es >640px
- **THEN** la cabecera "Equipo" muestra el texto completo (ej. "Equipo" en ES) y oculta la abreviatura

#### Scenario: Cabecera "Situación" muestra abreviatura en mobile

- **WHEN** el viewport es ≤640px
- **THEN** la cabecera "Situación" muestra el texto abreviado (ej. "Sit." en ES) y oculta el texto completo

#### Scenario: Cabecera "Situación" muestra nombre completo en desktop

- **WHEN** el viewport es >640px
- **THEN** la cabecera "Situación" muestra el texto completo (ej. "Situación" en ES) y oculta la abreviatura

#### Scenario: Tooltip muestra nombre completo al interactuar en mobile

- **WHEN** el usuario hace hover, focus o tap activo sobre una cabecera abreviada en mobile
- **THEN** el tooltip CSS (`::after` con `content: attr(data-tooltip)`) muestra el nombre completo de la columna

#### Scenario: Cabeceras restantes no cambian

- **WHEN** el viewport es ≤640px
- **THEN** las cabeceras "Jugador", "xG" y "Res." no se abrevian ni cambian su comportamiento
