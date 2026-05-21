# Purpose

TBD: Main specification for granular reset behavior in the database reset script.

## Requirements

### Requirement: Reset completo sin filtros

El sistema SHALL limpiar todas las colecciones dependientes cuando se ejecuta sin filtros: las colecciones **seeded** (`seasons`, `teams`, `matches`, `players`, `shots`) se borran y se resincronizazan desde raw; las colecciones **frontend-generated** (`simulations`, `chronicles`) se borran pero no se resincronizazan (las regenera la UI).

#### Scenario: Reset sin filtros limpia todo y resincroniza solo las seeded

- **WHEN** se ejecuta `pnpm reset:db` sin argumentos
- **THEN** el script borra `chronicles`, `simulations`, `shots`, `players`, `matches`, `teams` y `seasons`, y a continuación resincroniza `seasons`, `teams`, `matches`, `players` y `shots` desde los raw existentes en MongoDB

### Requirement: Reset granular por liga

El sistema SHALL permitir un reset limitado a una liga mediante el flag `--league <externalId>`. Las colecciones `chronicles` y `simulations` se borran únicamente para los `matchId` pertenecientes a los partidos de esa liga. Las colecciones `players` y `teams` **no se eliminan** en un reset filtrado. Las colecciones **seeded** `shots` y `matches` se borran y resincronizazan solo para esa liga; `seasons` también.

#### Scenario: Reset por liga borra chronicles y simulations solo de esa liga

- **WHEN** se ejecuta `pnpm reset:db --league "FIFA World Cup"`
- **THEN** el script borra únicamente los `chronicles` y `simulations` cuyo `matchId` pertenece a un partido de FIFA World Cup, y deja intactos los de otras ligas

#### Scenario: Reset por liga no elimina players ni teams

- **WHEN** se ejecuta `pnpm reset:db --league "FIFA World Cup"`
- **THEN** ningún documento de la colección `players` ni de la colección `teams` es eliminado

#### Scenario: Reset por liga borra y resincroniza shots, matches y seasons de esa liga

- **WHEN** se ejecuta `pnpm reset:db --league "FIFA World Cup"`
- **THEN** el script borra shots, matches y seasons asociados a FIFA World Cup, y los resincroniza desde los raw correspondientes

### Requirement: Reset granular por liga y temporada

El sistema SHALL permitir un reset limitado a una liga y una o varias temporadas mediante los flags `--league` y `--season`. Las colecciones `chronicles` y `simulations` se borran únicamente para los `matchId` pertenecientes a los partidos de esa liga+temporada. Las colecciones `players` y `teams` **no se eliminan**. Las colecciones **seeded** `shots`, `matches` y `seasons` se borran y resincronizazan solo para esa liga+temporada.

#### Scenario: Reset por liga y temporada única no borra data de otras ligas

- **WHEN** se ejecuta `pnpm reset:db --league "Spain La Liga" --season "25/26"`
- **THEN** el script borra solo los `chronicles`, `simulations` y datos seeded de La Liga temporada "25/26", sin afectar datos de otras ligas o temporadas

#### Scenario: Reset por liga y múltiples temporadas

- **WHEN** se ejecuta `pnpm reset:db --league "FIFA World Cup" --season "2026" --season "2022"`
- **THEN** el script borra y resincroniza los datos de FIFA World Cup para las temporadas 2026 y 2022, sin eliminar players ni teams

#### Scenario: Reset por liga y temporada no elimina players ni teams

- **WHEN** se ejecuta `pnpm reset:db --league "FIFA World Cup" --season "2022"`
- **THEN** ningún documento de la colección `players` ni de la colección `teams` es eliminado

### Requirement: Misma interfaz de filtros que seed:derived

El sistema SHALL usar exactamente la misma interfaz CLI (`--league`, `--season`) que `seed:derived` para mantener consistencia operacional.

#### Scenario: Flags idénticos a seed:derived

- **WHEN** se consulta la ayuda o documentación de `reset:db`
- **THEN** los flags `--league` y `--season` se comportan igual que en `seed:derived`

### Requirement: Las colecciones frontend-generated se borran de forma segura

El sistema SHALL borrar `chronicles` y `simulations` de manera segura durante cualquier reset:

- En un **reset sin filtros**, se borran en su totalidad (comportamiento existente).
- En un **reset filtrado** (con `--league` y/o `--season`), se borran únicamente aquellos documentos cuyo `matchId` pertenece a los partidos del scope del reset.

Estas colecciones no se resincronizazan: la UI las regenera bajo demanda.

#### Scenario: Chronicles y simulations se borran en su totalidad en reset completo

- **WHEN** se ejecuta `pnpm reset:db` sin argumentos
- **THEN** las colecciones `chronicles` y `simulations` quedan vacías al finalizar el script

#### Scenario: Chronicles y simulations se borran parcialmente en reset filtrado

- **WHEN** se ejecuta `pnpm reset:db --league "FIFA World Cup" --season "2022"`
- **THEN** solo los `chronicles` y `simulations` cuyo `matchId` pertenece a un partido de FIFA World Cup 2022 son eliminados; el resto permanece intacto

#### Scenario: Chronicles y simulations NO se repueblan

- **WHEN** finaliza la ejecución de `pnpm reset:db`
- **THEN** las colecciones `chronicles` y `simulations` no son repobladas por el script (las regenera la UI)

### Requirement: Advertencia en uso sin filtros

El sistema SHALL mostrar un mensaje de advertencia cuando se ejecuta `reset:db` sin filtros, indicando que se va a realizar un reset destructivo completo.

#### Scenario: Confirmación visual en reset completo

- **WHEN** se ejecuta `pnpm reset:db` sin argumentos
- **THEN** el script muestra un mensaje claro antes de proceder: "WARNING: Full reset — all derived collections will be cleared"
