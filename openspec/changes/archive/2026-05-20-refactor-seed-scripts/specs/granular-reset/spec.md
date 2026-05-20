## ADDED Requirements

### Requirement: Reset completo sin filtros

El sistema SHALL limpiar todas las colecciones dependientes cuando se ejecuta sin filtros: las colecciones **seeded** (`seasons`, `teams`, `matches`, `players`, `shots`) se borran y se resincronizazan desde raw; las colecciones **frontend-generated** (`simulations`, `chronicles`) se borran pero no se resincronizazan (las regenera la UI).

#### Scenario: Reset sin filtros limpia todo y resincroniza solo las seeded

- **WHEN** se ejecuta `pnpm reset:db` sin argumentos
- **THEN** el script borra `chronicles`, `simulations`, `shots`, `players`, `matches`, `teams` y `seasons`, y a continuación resincroniza `seasons`, `teams`, `matches`, `players` y `shots` desde los raw existentes en MongoDB

### Requirement: Reset granular por liga

El sistema SHALL permitir un reset limitado a una liga mediante el flag `--league <externalId>`. Las colecciones **frontend-generated** (`chronicles`, `simulations`) se borran siempre en su totalidad. Las colecciones **seeded** se borran y resincronizazan solo para esa liga.

#### Scenario: Reset por liga borra frontend-generated y resincroniza solo esa liga

- **WHEN** se ejecuta `pnpm reset:db --league "FIFA World Cup"`
- **THEN** el script borra todos los `chronicles` y `simulations`, borra shots, players, matches, teams y seasons asociados a FIFA World Cup, y los resincroniza desde los raw correspondientes

### Requirement: Reset granular por liga y temporada

El sistema SHALL permitir un reset limitado a una liga y una o varias temporadas mediante los flags `--league` y `--season`. Las colecciones **frontend-generated** (`chronicles`, `simulations`) se borran siempre en su totalidad. Las colecciones **seeded** se borran y resincronizazan solo para esa liga+temporada.

#### Scenario: Reset por liga y temporada única

- **WHEN** se ejecuta `pnpm reset:db --league "Spain La Liga" --season "25/26"`
- **THEN** el script borra todos los `chronicles` y `simulations`, borra shots, players, matches, teams y seasons de La Liga temporada "25/26" y los resincroniza

#### Scenario: Reset por liga y múltiples temporadas

- **WHEN** se ejecuta `pnpm reset:db --league "FIFA World Cup" --season "2026" --season "2022"`
- **THEN** el script borra todos los `chronicles` y `simulations`, y borra y resincroniza los datos de FIFA World Cup para las temporadas 2026 y 2022

### Requirement: Misma interfaz de filtros que seed:derived

El sistema SHALL usar exactamente la misma interfaz CLI (`--league`, `--season`) que `seed:derived` para mantener consistencia operacional.

#### Scenario: Flags idénticos a seed:derived

- **WHEN** se consulta la ayuda o documentación de `reset:db`
- **THEN** los flags `--league` y `--season` se comportan igual que en `seed:derived`

### Requirement: Las colecciones frontend-generated se borran siempre en su totalidad

El sistema SHALL borrar siempre la totalidad de las colecciones `chronicles` y `simulations` durante cualquier reset (con o sin filtros), ya que estas colecciones son generadas por el frontend y dependen de `matches` que pueden cambiar. No se resincronizazan: la UI las regenera bajo demanda.

#### Scenario: Chronicles y simulations se borran en reset granular

- **WHEN** se ejecuta `pnpm reset:db` con cualquier combinación de filtros
- **THEN** las colecciones `chronicles` y `simulations` quedan vacías al finalizar el script

#### Scenario: Chronicles y simulations NO se repueblan

- **WHEN** finaliza la ejecución de `pnpm reset:db`
- **THEN** las colecciones `chronicles` y `simulations` permanecen vacías (no hay reseed de estas colecciones)

### Requirement: Advertencia en uso sin filtros

El sistema SHALL mostrar un mensaje de advertencia cuando se ejecuta `reset:db` sin filtros, indicando que se va a realizar un reset destructivo completo.

#### Scenario: Confirmación visual en reset completo

- **WHEN** se ejecuta `pnpm reset:db` sin argumentos
- **THEN** el script muestra un mensaje claro antes de proceder: "WARNING: Full reset — all derived collections will be cleared"
