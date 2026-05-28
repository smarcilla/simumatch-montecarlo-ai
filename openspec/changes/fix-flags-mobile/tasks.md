## 1. Capa de datos — DTOs y use cases

- [ ] 1.1 Añadir `homeShortName: string` y `awayShortName: string` a `FindMatchByLeagueAndSeasonResult`
- [ ] 1.2 Añadir `homeShortName: string` y `awayShortName: string` a `FindMatchByIdResult`
- [ ] 1.3 Mapear `match.homeTeam.shortName` y `match.awayTeam.shortName` en `FindMatchesByLeagueAndSeasonUseCase.mapToResult`
- [ ] 1.4 Mapear `match.homeTeam.shortName` y `match.awayTeam.shortName` en `FindMatchByIdUseCase.mapToResult`

## 2. Propagación en páginas

- [ ] 2.1 Pasar `homeShortName` y `awayShortName` desde la página de listado de partidos hasta `MatchCard`
- [ ] 2.2 Pasar `homeShortName` y `awayShortName` desde la página de detalle del partido hasta `MatchDetailCard`

## 3. i18n — Traducciones de cabeceras abreviadas

- [ ] 3.1 Añadir `tableHeaders.teamShort: "Equ."` y `tableHeaders.situationShort: "Sit."` en `es.json`
- [ ] 3.2 Añadir `tableHeaders.teamShort: "Team"` (abreviado) y `tableHeaders.situationShort: "Sit."` en `en.json`

## 4. Componentes UI

- [ ] 4.1 Actualizar `MatchCard` para renderizar `<span className="team-name-full">` y `<span className="team-name-short">` con el prop `homeShortName`/`awayShortName`
- [ ] 4.2 Actualizar `MatchDetailCard` para renderizar `<span className="team-name-full">` y `<span className="team-name-short">` con el prop `homeShortName`/`awayShortName`
- [ ] 4.3 Actualizar `TeamBadge`: cuando `normalizedFlagUrl` está presente y `size !== "table"`, envolver el badge en `<span className="team-flag-circle-wrap-{size}">`
- [ ] 4.4 Actualizar `TeamBadge`: cuando `normalizedFlagUrl` está presente y `size === "table"`, añadir clase `team-flag-circle-wrap` al `span` de `table-team-shield-wrap` existente
- [ ] 4.5 Actualizar `ShotsTable`: cabecera "Equipo" usa `data-tooltip`, dual span `th-full`/`th-abbr` y traducciones `team`/`teamShort`
- [ ] 4.6 Actualizar `ShotsTable`: cabecera "Situación" usa `data-tooltip`, dual span `th-full`/`th-abbr` y traducciones `situation`/`situationShort`

## 5. CSS en globals.css

- [ ] 5.1 Añadir clases `.team-name-full` (visible por defecto) y `.team-name-short` (oculto por defecto); en `@media (max-width: 640px)` invertir visibilidad
- [ ] 5.2 Añadir clases `.th-full` (visible por defecto) y `.th-abbr` (oculto por defecto); en `@media (max-width: 640px)` invertir visibilidad
- [ ] 5.3 Añadir `.shots-th[data-tooltip] { position: relative; }` para anclar el tooltip CSS
- [ ] 5.4 Extender el selector de tooltip CSS existente para incluir `.shots-th[data-tooltip]::after` (contenido y posición) y `.shots-th[data-tooltip]:hover::after, :focus::after, :active::after` (visibilidad)
- [ ] 5.5 Añadir `.team-flag-circle-wrap-card` con dimensiones y `border-radius: 50%; overflow: hidden`; en `@media (max-width: 640px)` activo; en desktop sin efecto
- [ ] 5.6 Añadir `.team-flag-circle-wrap-detail` con `border-radius: 50%; overflow: hidden; width: 64px; height: 64px`; en `@media (max-width: 640px)` activo
- [ ] 5.7 Añadir regla para `.team-flag-circle-wrap` (table) con `border-radius: 50%; overflow: hidden; width: 20px; height: 20px`; en `@media (max-width: 640px)` activo
- [ ] 5.8 Añadir regla CSS para `<img>` dentro de los wrappers circulares: `width: 100%; height: 100%; object-fit: cover`

## 6. Tests

- [ ] 6.1 Actualizar tests de `MatchCard` para incluir `homeShortName`/`awayShortName` en los datos de prueba
- [ ] 6.2 Actualizar tests de `MatchDetailCard` si existen fixtures con los nuevos campos
- [ ] 6.3 Actualizar tests de use cases que verifiquen el shape de `FindMatchByLeagueAndSeasonResult` y `FindMatchByIdResult`
