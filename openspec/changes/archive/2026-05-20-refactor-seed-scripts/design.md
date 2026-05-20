## Context

Actualmente el sistema de sincronización tiene dos scripts principales:

- `seed:leagues` → lee `leagues.json` y hace upsert en la colección `leagues`
- `seed:all` → importa los 3 JSON raw desde disco, sincroniza leagues y luego genera todas las colecciones derivadas

El problema: `seed:all` mezcla dos responsabilidades que pertenecen a procesos distintos con un paso asíncrono externo entre ellas. Las colecciones raw (`seasons_raw`, `league_matches_raw`, `match_shots_raw`) son alimentadas por scripts Python desde Sofascore en un proceso completamente externo a Node. Solo cuando ese proceso termina tiene sentido ejecutar la sincronización de colecciones derivadas.

Además existe `reset:db`, pensado para entornos de desarrollo, que limpia colecciones derivadas y las regenera desde los raw. Actualmente no soporta filtros.

La cadena de dependencias en los datos raw es:

```
seasons_raw
  { league_external_id, season_name, season_id }
         ↓ filtrar por league_external_id + season_name[]
         → season_ids[]

league_matches_raw
  { league_external_id, season_id, id (match_id), homeTeam, awayTeam }
         ↓ filtrar por league_external_id + season_id IN season_ids[]
         → match_ids[] + team data

match_shots_raw
  { match_id, player, goalkeeper, ... }
         ↓ filtrar por match_id IN match_ids[]
         → shots + player data
```

`match_shots_raw` no tiene `league_external_id` ni `season_id` directamente, por lo que el filtrado de disparos siempre es una cascada derivada de los partidos.

### Dos tipos de colecciones en el sistema

Es importante distinguir:

| Tipo                   | Colecciones                             | Se borran en reset | Se re-sincronizan en reset |
| ---------------------- | --------------------------------------- | ------------------ | -------------------------- |
| **Seeded** (desde raw) | seasons, teams, matches, players, shots | Sí                 | Sí (desde `*_raw`)         |
| **Frontend-generated** | simulations, chronicles                 | Sí                 | No (las regenera la UI)    |

Las colecciones `simulations` y `chronicles` se generan desde el frontend a partir de los datos derived. No tienen colección raw equivalente. El reset las borra para que no queden referencias rotas a matches/players que ya no existen, pero no las reconstituye.

`ClearSimulationsUseCase` ya existe. **`ClearChroniclesUseCase` no existe y debe crearse** como parte de este change.

## Goals / Non-Goals

**Goals:**

- Separar claramente dos procesos: `seed:leagues` (sincroniza ligas) y `seed:derived` (sincroniza colecciones derivadas)
- Añadir filtros opcionales `--league` y `--season` a `seed:derived`
- Extender `reset:db` con los mismos filtros de granularidad
- Eliminar `seed:all` — ya no es correcto ni seguro encadenar ambos procesos
- Mantener comportamiento sin filtros como "sincronizar todo" (compatibilidad con flujo completo)

**Non-Goals:**

- No modificar scripts individuales existentes (`seed:seasons`, `seed:teams`, etc.)
- No modificar use cases, dominio, repositorios ni tests
- No añadir interfaz interactiva ni menús — solo argumentos CLI
- No gestionar la ejecución de los scripts Python externos
- No implementar lógica de borrado selectivo en `reset:db` más allá del scope liga+season (no se borran teams ni players huérfanos — eso es complejidad futura)

## Decisions

### 1. Un único script `seed:derived` en lugar de orquestar los individuales

**Decisión**: Crear `seed-derived.script.ts` como script monolítico que lee los raw, aplica filtros y ejecuta upserts en orden. No orquesta los scripts individuales existentes.

**Alternativa descartada**: Hacer que `seed:derived` llame a `seed:seasons`, `seed:teams`, etc. con argumentos. Los scripts individuales no están diseñados para recibir filtros y modificarlos implicaría cambios en todos ellos.

**Rationale**: El filtrado de shots requiere join con match_ids que solo existe en memoria durante la ejecución. Un script monolítico mantiene ese contexto sin necesidad de pasar estado entre procesos.

### 2. Interfaz CLI: `--league` y `--season` como flags repetibles

**Decisión**: Usar `process.argv` directamente con parsing manual o una librería mínima. Interfaz:

```
pnpm seed:derived
pnpm seed:derived --league "Spain La Liga"
pnpm seed:derived --league "Spain La Liga" --season "25/26"
pnpm seed:derived --league "FIFA World Cup" --season "2026" --season "2022"
```

`--season` es repetible para soportar múltiples temporadas en una invocación. Solo una `--league` por invocación (restricción acordada).

**Alternativa descartada**: Sintaxis `--seasons "25/26,24/25"` con split. Menos ergonómica y más propensa a errores de formato.

### 3. Comportamiento sin filtros: sincronizar todo

**Decisión**: Si no se pasa `--league`, `seed:derived` sincroniza todas las ligas y temporadas presentes en los raw. Esto mantiene el comportamiento equivalente al `seed:all` actual (sin la parte de leagues).

### 4. `reset:db` con misma interfaz de filtros, borrado selectivo por liga+season

**Decisión**: `reset:db` acepta los mismos flags `--league` y `--season`. El orden de borrado es:

1. `chronicles` (frontend-generated, borrado siempre — no tiene filtro granular posible sin join complejo)
2. `simulations` (frontend-generated, borrado siempre — misma razón)
3. `shots`, `players`, `matches`, `teams`, `seasons` — borrado selectivo si hay filtros, o total si no
4. Resincronización con lógica equivalente a `seed:derived` (solo colecciones seeded)

Si no se pasan filtros, borrado completo de todas las colecciones derivadas y frontend-generated, seguido de resync total.

**Nota**: `chronicles` y `simulations` se borran siempre en su totalidad (no hay borrado granular por liga/season) porque el coste de implementar ese join es desproporcionado para el caso de uso de desarrollo.

**Riesgo asumido**: El borrado de teams y players en modo filtrado puede ser incorrecto si un equipo o jugador aparece en múltiples ligas/temporadas. Para el caso de uso de desarrollo ("quiero resetear FIFA WC 2026") esto es aceptable.

### 5. Eliminar `seed:all` completamente

**Decisión**: Eliminar script y npm script. No crear alias.

**Rationale**: Un alias `seed:leagues && seed:derived` induciría a ejecutarlos juntos cuando hay un paso asíncrono externo obligatorio entre ellos. La eliminación es la señal más clara de que esto no es correcto.

### 6. Orden de sincronización en `seed:derived`

El orden respeta las dependencias del dominio:

1. `seasons` (dependen de `leagues`, que ya existen)
2. `teams` (extraídos de `league_matches_raw`)
3. `matches` (dependen de `leagues`, `seasons`, `teams`)
4. `players` (extraídos de `match_shots_raw`)
5. `shots` (dependen de `players` y `matches`)

## Risks / Trade-offs

- **Borrado parcial de teams/players en reset filtrado** → Los teams y players pueden aparecer en múltiples ligas. Un reset por liga+season puede borrar teams/players que también existen en otras ligas. Mitigación: `seed:derived` (que corre después del clear) los reinsertará si sus raw siguen presentes. Solo problemático si los raw también se limpiaron antes.

- **Chronicles y simulations se borran siempre en su totalidad, incluso en reset granular** → Un reset de "FIFA WC 2026" borrará también crónicas y simulaciones de partidos de otras ligas. Mitigación: es el comportamiento esperado para entornos de desarrollo; la UI los regenera bajo demanda. Si en el futuro esto es un problema, se puede añadir filtrado por matchId.

- **`ClearChroniclesUseCase` debe crearse desde cero** → Implica crear use case, método en repositorio de crónicas y registro en DIContainer. Mitigación: el patrón es idéntico a `ClearSimulationsUseCase`, el esfuerzo es mínimo.

- **`seed:all` desaparece sin alternativa directa para full sync** → Un desarrollador nuevo puede buscar un "sync everything" command. Mitigación: documentar claramente en README el nuevo flujo de dos pasos con la nota del paso asíncrono.

- **Parsing de args manual puede ser frágil** → Si hay espacios en nombres de ligas con comillas, el parsing puede fallar según el shell. Mitigación: testear con los valores reales de `externalId` (`"Spain La Liga"`, `"FIFA World Cup"`).

## Migration Plan

1. Crear `seed-derived.script.ts`
2. Modificar `reset-db.script.ts` con filtros
3. Eliminar `seed-all.script.ts`
4. Actualizar `package.json`
5. Actualizar `README.md` y `docs/roadmap/add-fifa-word-cup-feature.md`

No hay migración de datos — todos los cambios son de scripts de infraestructura. Rollback: revertir los ficheros modificados.

## Open Questions

- ¿Debería `reset:db` con filtros borrar **seasons** además de teams/matches/players/shots? Actualmente `reset:db` no toca seasons. Si queremos poder "deshacer" completamente una temporada, habría que incluirlas. **Decisión pendiente de confirmación.**

Si seed:derived sincroniza seasons, el comando reset:db tiene que limpiarlo también.
