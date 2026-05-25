## MODIFIED Requirements

### Requirement: Sincronización de colecciones derivadas sin filtros

El sistema SHALL disponer de un script `seed:derived` que, cuando se ejecuta sin argumentos, sincronice las colecciones derivadas `seasons`, `matches`, `players` y `shots` a partir de los datos existentes en las colecciones raw de MongoDB (`seasons_raw`, `league_matches_raw`, `match_shots_raw`). La colección `teams` queda excluida de este script; su ingesta es responsabilidad exclusiva del backend Python.

#### Scenario: Ejecución sin filtros sincroniza colecciones derivadas excepto teams

- **WHEN** se ejecuta `pnpm seed:derived` sin argumentos
- **THEN** el script sincroniza `seasons`, `matches`, `players` y `shots` para todas las ligas y temporadas presentes en los raw
- **THEN** el script NO sincroniza la colección `teams`

### Requirement: Filtro por liga

El sistema SHALL permitir restringir la sincronización a una única liga mediante el flag `--league <externalId>`.

#### Scenario: Filtro por liga sincroniza solo esa liga

- **WHEN** se ejecuta `pnpm seed:derived --league "Spain La Liga"`
- **THEN** el script sincroniza únicamente `seasons`, `matches`, `players` y `shots` cuyos datos raw correspondan a `league_external_id = "Spain La Liga"`

#### Scenario: Liga inexistente en raw no produce error

- **WHEN** se ejecuta `pnpm seed:derived --league "Liga Inexistente"`
- **THEN** el script termina con éxito indicando que no se encontraron datos para esa liga

### Requirement: Filtro por liga y una o varias temporadas

El sistema SHALL permitir restringir adicionalmente la sincronización a una o varias temporadas mediante el flag `--season <name>` (repetible).

#### Scenario: Filtro por liga y temporada única

- **WHEN** se ejecuta `pnpm seed:derived --league "Spain La Liga" --season "25/26"`
- **THEN** el script sincroniza solo los datos correspondientes a La Liga en la temporada "25/26"

#### Scenario: Filtro por liga y múltiples temporadas

- **WHEN** se ejecuta `pnpm seed:derived --league "FIFA World Cup" --season "2026" --season "2022"`
- **THEN** el script sincroniza los datos de FIFA World Cup para las temporadas 2026 y 2022
