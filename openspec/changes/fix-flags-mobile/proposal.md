## Why

Las banderas de equipos nacionales presentan defectos visuales en mobile: se muestran como rectángulos donde el usuario esperaría ver un círculo, las cabeceras de la tabla de disparos consumen demasiado espacio horizontal, y los nombres de equipo completos desbordan el layout en pantallas pequeñas.

## What Changes

- Las banderas de equipos (`TeamFlag`) se muestran como círculos en mobile (≤640px) mediante un wrapper CSS con `border-radius: 50%` y `overflow: hidden`; en tablet y desktop permanecen rectangulares.
- Las cabeceras "Equipo" y "Situación" de `ShotsTable` muestran su versión abreviada en mobile con un tooltip CSS al hacer hover/focus/active (patrón existente `data-tooltip`).
- Los nombres de equipo en `MatchCard` y `MatchDetailCard` usan `shortName` en mobile y `name` en tablet/desktop mediante dual span con CSS `display: none` por breakpoint.
- Los DTOs `FindMatchByLeagueAndSeasonResult` y `FindMatchByIdResult` exponen `homeShortName` y `awayShortName`.
- Se añaden traducciones cortas `tableHeaders.teamShort` y `tableHeaders.situationShort` en los mensajes i18n (ES + EN).

## Capabilities

### New Capabilities

- `flag-circle-mobile`: Las banderas de equipos con `flagUrl` se muestran como círculos en mobile. En tablet y desktop conservan su forma rectangular. Se aplica a `size="card"` (40×40 en mobile), `size="table"` (20×20 en mobile) y `size="detail"` (64×64 en mobile).

- `shots-table-abbr-headers`: Las cabeceras "Equipo" y "Situación" de la tabla de disparos muestran texto abreviado en mobile con tooltip al hover/focus/active. El tooltip muestra el nombre completo de la columna.

- `team-short-name-mobile`: Los nombres de equipo en las tarjetas de partido muestran `shortName` en mobile y `name` en tablet/desktop.

### Modified Capabilities

- `team-flag`: Los DTOs de resultado de partido exponen `homeShortName` y `awayShortName` además de los campos existentes. El `TeamBadge` y `TeamFlag` adquieren comportamiento responsive.

## Impact

- `src/application/results/find-matches-by-league-and-season.result.ts` — añadir `homeShortName`, `awayShortName`
- `src/application/results/find-match-by-id.result.ts` — añadir `homeShortName`, `awayShortName`
- `src/application/use-cases/find-matches-by-league-and-season.use-case.ts` — mapear `shortName`
- `src/application/use-cases/find-match-by-id.use-case.ts` — mapear `shortName`
- `src/infrastructure/ui/components/TeamBadge.tsx` — añadir wrapper circular condicional
- `src/infrastructure/ui/components/ShotsTable.tsx` — cabeceras abreviadas con tooltip
- `src/infrastructure/ui/components/MatchCard.tsx` — dual span name/shortName
- `src/infrastructure/ui/components/MatchDetailCard.tsx` — dual span name/shortName
- `src/infrastructure/ui/i18n/messages/es.json` — traducciones cortas de cabecera
- `src/infrastructure/ui/i18n/messages/en.json` — traducciones cortas de cabecera
- `src/app/globals.css` — estilos de wrapper circular y dual span
- Páginas que pasan props a `MatchCard`/`MatchDetailCard` — propagar `homeShortName`/`awayShortName`
