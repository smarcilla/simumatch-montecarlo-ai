## Why

Los escudos SVG generados a partir de colores primario/secundario son inventados y dan mala imagen visual, especialmente en la liga FIFA World Cup donde los equipos son selecciones nacionales con banderas reconocibles. El Mundial 2026 empieza ya y es necesario mostrar las banderas reales de las selecciones para que la aplicación sea presentable.

## What Changes

- La entidad `Team` y el modelo MongoDB `TeamModel` incorporan el campo opcional `flagUrl` (URL pública de la bandera SVG en flagcdn.com).
- El repositorio `MongooseTeamRepository` mapea y persiste `flagUrl`.
- Las capas de lectura (`FindMatchByIdResult`, `FindMatchByLeagueAndSeasonResult` y sus use-cases) exponen `homeFlag` y `awayFlag` opcionales.
- El frontend introduce un componente `TeamBadge` que actúa como decisor: renderiza un `TeamFlag` (imagen de bandera) si el equipo tiene `flagUrl`, o el `TeamShield` SVG de colores existente si no lo tiene.
- La ingesta de teams con flags se delega íntegramente al backend Python. Como consecuencia, la sincronización de teams se elimina de `derived-sync.ts` para evitar doble ingesta.
- El `UpsertTeamsUseCase` y `UpsertTeamCommand` de este proyecto **no se modifican** (quedan obsoletos para teams con flags; se podrán eliminar cuando el backend Python esté 100% validado).

## Capabilities

### New Capabilities

- `team-flag`: Campo `flagUrl` opcional en la entidad y modelo Team; componentes visuales `TeamFlag` y `TeamBadge` para renderizar banderas o escudos según disponibilidad.

### Modified Capabilities

- `seed-derived`: La sincronización de la colección `teams` se elimina del script `derived-sync.ts`. El requisito de que `seed:derived` sincronice teams deja de aplicar, ya que esa responsabilidad pasa al backend Python.

## Impact

- **Backend / Dominio**: `team.entity.ts`, `team.model.ts`, `mongoose-team.repository.ts`.
- **Application (lectura)**: `find-match-by-id.result.ts`, `find-matches-by-league-and-season.result.ts`, `find-match-by-id.use-case.ts`, `find-matches-by-league-and-season.use-case.ts`.
- **Scripts**: `derived-sync.ts` — se elimina la llamada a `buildTeamCommands` y `UpsertTeamsUseCase` del flujo de sincronización.
- **Frontend**: nuevos componentes `TeamFlag` y `TeamBadge`; actualización de todos los puntos de uso de `TeamShield` y `TableTeamShield` para pasar `flagUrl`.
- **Sin cambios**: `UpsertTeamCommand`, `UpsertTeamsUseCase`, `seed-teams.script.ts` (se mantienen intactos hasta validación del backend Python).
- **Dependencia externa**: backend Python debe ingestar teams con `flagUrl` poblado en MongoDB antes de que la UI muestre banderas.
