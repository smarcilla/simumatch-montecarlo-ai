# Purpose

TBD: Main specification for the seed-derived synchronization script.
## Requirements
### Requirement: Sincronización de colecciones derivadas sin filtros

El sistema SHALL disponer de un script `seed:derived` que, cuando se ejecuta sin argumentos, sincronice todas las colecciones derivadas (`seasons`, `teams`, `matches`, `players`, `shots`) a partir de los datos existentes en las colecciones raw de MongoDB (`seasons_raw`, `league_matches_raw`, `match_shots_raw`).

#### Scenario: Ejecución sin filtros sincroniza todo

- **WHEN** se ejecuta `pnpm seed:derived` sin argumentos
- **THEN** el script sincroniza `seasons`, `teams`, `matches`, `players` y `shots` para todas las ligas y temporadas presentes en los raw

### Requirement: Filtro por liga

El sistema SHALL permitir restringir la sincronización a una única liga mediante el flag `--league <externalId>`.

#### Scenario: Filtro por liga sincroniza solo esa liga

- **WHEN** se ejecuta `pnpm seed:derived --league "Spain La Liga"`
- **THEN** el script sincroniza únicamente `seasons`, `teams`, `matches`, `players` y `shots` cuyos datos raw correspondan a `league_external_id = "Spain La Liga"`

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

#### Scenario: Temporada no encontrada para esa liga

- **WHEN** se ejecuta `pnpm seed:derived --league "Spain La Liga" --season "1999"`
- **THEN** el script termina con éxito indicando que no se encontraron datos para esa combinación liga+temporada

### Requirement: Cascada de filtros para shots

El sistema SHALL resolver el filtrado de `match_shots_raw` mediante una cascada a partir de los partidos filtrados, dado que `match_shots_raw` no contiene `league_external_id` ni `season_id`.

#### Scenario: Shots filtrados por match_ids derivados

- **WHEN** se aplica un filtro `--league` y/o `--season`
- **THEN** el script obtiene primero los `match_ids` de los partidos filtrados y usa esos IDs para filtrar los disparos

### Requirement: Orden de sincronización respeta dependencias del dominio

El sistema SHALL sincronizar las colecciones derivadas en el siguiente orden: `seasons` → `teams` → `matches` → `players` → `shots`.

#### Scenario: Orden de ejecución garantizado

- **WHEN** se ejecuta `seed:derived` (con o sin filtros)
- **THEN** la sincronización ocurre en orden: seasons, teams, matches, players, shots

### Requirement: Operación de upsert idempotente

El sistema SHALL realizar operaciones de upsert (no borrado previo) al sincronizar colecciones derivadas. Ejecutar `seed:derived` múltiples veces con los mismos datos SHALL producir el mismo estado final.

#### Scenario: Segunda ejecución no duplica datos

- **WHEN** se ejecuta `pnpm seed:derived` dos veces consecutivas con los mismos raw
- **THEN** el conteo de documentos en las colecciones derivadas es idéntico tras ambas ejecuciones

### Requirement: Derived match synchronization includes slugs

The `seed:derived` synchronization flow SHALL map `league_matches_raw.tournament.slug` to `tournamentSlug` and `league_matches_raw.slug` to `matchSlug` in derived match upsert data.

#### Scenario: Full synchronization persists match slugs

- **WHEN** `pnpm seed:derived` synchronizes a raw match that contains tournament and match slugs
- **THEN** the derived `matches` record stores `tournamentSlug` and `matchSlug` alongside existing match fields

#### Scenario: Filtered synchronization persists match slugs

- **WHEN** `pnpm seed:derived --league <externalId> --season <season>` synchronizes raw matches with slugs
- **THEN** each synchronized derived match in that scope stores `tournamentSlug` and `matchSlug`

### Requirement: Match slug synchronization remains idempotent

Repeated synchronization SHALL keep one derived match per external ID and SHALL update slug fields to the latest raw values.

#### Scenario: Re-running synchronization does not duplicate matches

- **WHEN** `seed:derived` runs multiple times with unchanged raw data
- **THEN** no duplicate derived matches are created and stored slug fields remain unchanged

#### Scenario: Re-running synchronization updates changed slugs

- **WHEN** a raw match slug value changes and `seed:derived` runs again
- **THEN** the existing derived match for that external ID is updated with the new slug value

