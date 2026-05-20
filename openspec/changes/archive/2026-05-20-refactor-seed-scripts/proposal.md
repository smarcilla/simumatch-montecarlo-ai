## Why

El flujo actual de sincronización mezcla responsabilidades: `seed:all` sincroniza ligas, importa los JSON raw y genera las colecciones derivadas en un único paso, ignorando que las colecciones raw son producidas por un proceso externo asíncrono (Python). Esto hace el flujo frágil, difícil de ejecutar parcialmente y propenso a errores cuando se añaden nuevas ligas o competiciones. Además, no existe granularidad: o se sincroniza todo o nada.

## What Changes

- **BREAKING** Eliminar el script `seed:all` y su npm script `seed:all`. Ya no tiene sentido encadenar leagues y derived cuando hay un paso asíncrono externo entre medias.
- Añadir nuevo script `seed:derived` con soporte de filtros `--league` y `--season` (una o varias temporadas por invocación).
- Adaptar el script `reset:db` para aceptar los mismos filtros que `seed:derived` (`--league`, `--season`), permitiendo deshacer/resetear con la misma granularidad.
- Los scripts individuales existentes (`seed:seasons`, `seed:teams`, `seed:matches`, `seed:players`, `seed:shots`) se mantienen tal como están — `seed:derived` los orquesta en un único proceso con filtros.
- Actualizar `package.json` con los nuevos scripts.
- Actualizar documentación (`README.md`, `add-fifa-word-cup-feature.md`) para reflejar el nuevo flujo.

## Capabilities

### New Capabilities

- `seed-derived`: Script que sincroniza las colecciones derivadas (`seasons`, `teams`, `matches`, `players`, `shots`) desde las colecciones raw de MongoDB, con soporte de filtros opcionales `--league <externalId>` y `--season <name>` (repetible para múltiples seasons). Sin filtros sincroniza todo.
- `granular-reset`: Extensión de `reset:db` con soporte de los mismos filtros que `seed:derived`. Permite limpiar y resincronizar solo una liga+temporada concreta, útil en entornos de desarrollo. El reset distingue dos tipos de colecciones: las **seeded** (seasons, teams, matches, players, shots — se borran y resincronizazan desde raw) y las **frontend-generated** (simulations, chronicles — se borran pero no se resincronizazan, se regeneran desde la UI).

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- `src/infrastructure/scripts/seed-all.script.ts` — **eliminado**
- `src/infrastructure/scripts/seed-derived.script.ts` — **nuevo**
- `src/infrastructure/scripts/reset-db.script.ts` — **modificado** (filtros opcionales)
- `package.json` — **modificado** (añadir `seed:derived`, eliminar `seed:all`)
- `README.md` — **modificado** (actualizar sección de scripts de sincronización)
- `docs/roadmap/add-fifa-word-cup-feature.md` — **modificado** (actualizar flujo recomendado)
- `src/application/use-cases/clear-chronicles.use-case.ts` — **nuevo** (requerido por `reset:db` para limpiar crónicas)
- `src/infrastructure/repositories/` — **nuevo** repositorio de crónicas si no existe ya vía `ChronicleModel`
- `src/infrastructure/di-container.ts` — **modificado** (registrar `getClearChroniclesUseCase`)
- Sin cambios en dominio ni tests
