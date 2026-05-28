## 1. Capa de datos — DTOs y use cases

- [x] 1.1 Añadir `homeShortName: string` y `awayShortName: string` a `FindMatchByLeagueAndSeasonResult`
- [x] 1.2 Añadir `homeShortName: string` y `awayShortName: string` a `FindMatchByIdResult`
- [x] 1.3 Mapear `match.homeTeam.shortName` y `match.awayTeam.shortName` en `FindMatchesByLeagueAndSeasonUseCase.mapToResult`
- [x] 1.4 Mapear `match.homeTeam.shortName` y `match.awayTeam.shortName` en `FindMatchByIdUseCase.mapToResult`

## 2. Propagación en páginas

- [x] 2.1 Pasar `homeShortName` y `awayShortName` desde la página de listado de partidos hasta `MatchCard`
- [x] 2.2 Pasar `homeShortName` y `awayShortName` desde la página de detalle del partido hasta `MatchDetailCard`

## 3. i18n — Traducciones de cabeceras abreviadas

- [x] 3.1 Añadir `tableHeaders.teamShort: "Equ."` y `tableHeaders.situationShort: "Sit."` en `es.json`
- [x] 3.2 Añadir `tableHeaders.teamShort: "Team"` (abreviado) y `tableHeaders.situationShort: "Sit."` en `en.json`

## 4. Componentes UI

- [x] 4.1 Actualizar `MatchCard` para renderizar `<span className="team-name-full">` y `<span className="team-name-short">` con el prop `homeShortName`/`awayShortName`
- [x] 4.2 Actualizar `MatchDetailCard` para renderizar `<span className="team-name-full">` y `<span className="team-name-short">` con el prop `homeShortName`/`awayShortName`
- [x] 4.3 Actualizar `TeamBadge`: cuando `normalizedFlagUrl` está presente y `size !== "table"`, envolver el badge en `<span className="team-flag-circle-wrap-{size}">`
- [x] 4.4 Actualizar `TeamBadge`: cuando `normalizedFlagUrl` está presente y `size === "table"`, añadir clase `team-flag-circle-wrap` al `span` de `table-team-shield-wrap` existente
- [x] 4.5 Actualizar `ShotsTable`: cabecera "Equipo" usa `data-tooltip`, dual span `th-full`/`th-abbr` y traducciones `team`/`teamShort`
- [x] 4.6 Actualizar `ShotsTable`: cabecera "Situación" usa `data-tooltip`, dual span `th-full`/`th-abbr` y traducciones `situation`/`situationShort`

## 5. CSS en globals.css

- [x] 5.1 Añadir clases `.team-name-full` (visible por defecto) y `.team-name-short` (oculto por defecto); en `@media (max-width: 640px)` invertir visibilidad
- [x] 5.2 Añadir clases `.th-full` (visible por defecto) y `.th-abbr` (oculto por defecto); en `@media (max-width: 640px)` invertir visibilidad
- [x] 5.3 Añadir `.shots-th[data-tooltip] { position: relative; }` para anclar el tooltip CSS
- [x] 5.4 Extender el selector de tooltip CSS existente para incluir `.shots-th[data-tooltip]::after` (contenido y posición) y `.shots-th[data-tooltip]:hover::after, :focus::after, :active::after` (visibilidad)
- [x] 5.5 Añadir `.team-flag-circle-wrap-card` con dimensiones y `border-radius: 50%; overflow: hidden`; en `@media (max-width: 640px)` activo; en desktop sin efecto
- [x] 5.6 Añadir `.team-flag-circle-wrap-detail` con `border-radius: 50%; overflow: hidden; width: 64px; height: 64px`; en `@media (max-width: 640px)` activo
- [x] 5.7 Añadir regla para `.team-flag-circle-wrap` (table) con `border-radius: 50%; overflow: hidden; width: 20px; height: 20px`; en `@media (max-width: 640px)` activo
- [x] 5.8 Añadir regla CSS para `<img>` dentro de los wrappers circulares: `width: 100%; height: 100%; object-fit: cover`

## 6. Tests

- [x] 6.1 Actualizar tests de `MatchCard` para incluir `homeShortName`/`awayShortName` en los datos de prueba
- [x] 6.2 Actualizar tests de `MatchDetailCard` si existen fixtures con los nuevos campos
- [x] 6.3 Actualizar tests de use cases que verifiquen el shape de `FindMatchByLeagueAndSeasonResult` y `FindMatchByIdResult`

## 7. Ajustes visuales adicionales mobile

- [x] 7.1 En `MatchCard`, mostrar en mobile solo los primeros 3 caracteres de `homeShortName` y `awayShortName`
- [x] 7.2 En wrappers circulares de `TeamFlag` mobile, añadir borde ligero para distinguir flags con colores similares al fondo
- [x] 7.3 Corregir alineación mobile en `ShotXgBar`: el valor de xG del equipo away debe alinearse a la izquierda
- [x] 7.4 Añadir traducciones i18n compactas (máximo 3 caracteres) para cabeceras de tablas de stats/simulación
- [x] 7.5 Actualizar `ShotPlayerStatsTable` para usar cabeceras responsive `th-full`/`th-abbr` con abreviaturas de máximo 3 caracteres en mobile
- [x] 7.6 Actualizar `ShotGoalkeeperStatsTable` para usar cabeceras responsive `th-full`/`th-abbr` con abreviaturas de máximo 3 caracteres en mobile
- [x] 7.7 Actualizar `ScoreDistributionChart` para usar cabeceras responsive `th-full`/`th-abbr` con abreviaturas de máximo 3 caracteres en mobile
- [x] 7.8 Actualizar `PlayerStatsChart` para usar cabeceras responsive `th-full`/`th-abbr` con abreviaturas de máximo 3 caracteres en mobile
- [x] 7.9 Añadir test en `MatchCard` que verifique truncado a 3 caracteres para `team-name-short`

## 8. Ajuste final en estadísticas de disparos

- [x] 8.1 En `ShotXgBar`, renderizar la bandera del equipo away a la izquierda del nombre para mantener el mismo patrón visual que el equipo local
