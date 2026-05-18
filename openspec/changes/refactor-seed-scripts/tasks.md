## 1. Crear seed:derived

- [ ] 1.1 Crear `src/infrastructure/scripts/seed-derived.script.ts` con lógica de parsing de args `--league` y `--season`
- [ ] 1.2 Implementar la cascada de filtros: `seasons_raw` por league+season_name → `season_ids[]` → `league_matches_raw` por league+season_ids → `match_ids[]` → `match_shots_raw` por match_ids
- [ ] 1.3 Implementar sincronización de `seasons` desde los raw filtrados (reutilizar lógica de `seed-seasons.script.ts`)
- [ ] 1.4 Implementar sincronización de `teams` desde los partidos raw filtrados (reutilizar lógica de `seed-teams.script.ts`)
- [ ] 1.5 Implementar sincronización de `matches` desde los partidos raw filtrados (reutilizar lógica de `seed-matches.script.ts`)
- [ ] 1.6 Implementar sincronización de `players` desde los shots raw filtrados (reutilizar lógica de `seed-players.script.ts`)
- [ ] 1.7 Implementar sincronización de `shots` desde los shots raw filtrados (reutilizar lógica de `seed-shots.script.ts`)
- [ ] 1.8 Verificar que sin filtros el comportamiento es "sincronizar todo" (equivalente al `seed:all` actual sin la parte de leagues y sin importar JSON)

## 2. Crear ClearChroniclesUseCase

- [ ] 2.1 Crear `src/application/use-cases/clear-chronicles.use-case.ts` siguiendo el mismo patrón que `clear-simulations.use-case.ts`
- [ ] 2.2 Añadir método `clearAll()` al repositorio de crónicas (si no existe) e implementarlo en `mongoose-chronicle.repository.ts`
- [ ] 2.3 Registrar `getClearChroniclesUseCase()` en `src/infrastructure/di-container.ts`

## 3. Adaptar reset:db con granularidad

- [ ] 3.1 Añadir parsing de args `--league` y `--season` a `reset-db.script.ts`
- [ ] 3.2 Añadir mensaje de advertencia cuando se ejecuta sin filtros: `"WARNING: Full reset — all derived collections will be cleared"`
- [ ] 3.3 Implementar borrado de `chronicles` y `simulations` al inicio del script (siempre, sin filtro)
- [ ] 3.4 Implementar lógica de borrado selectivo de `shots`, `players`, `matches`, `teams`, `seasons` cuando hay filtros
- [ ] 3.5 Reutilizar la lógica de filtrado de `seed:derived` para la fase de resincronización tras el borrado
- [ ] 3.6 Mantener comportamiento actual (borrado + resync total) cuando no se pasan filtros

## 4. Eliminar seed:all

- [ ] 4.1 Eliminar `src/infrastructure/scripts/seed-all.script.ts`
- [ ] 4.2 Eliminar el npm script `seed:all` de `package.json`

## 5. Actualizar package.json

- [ ] 5.1 Añadir npm script `seed:derived` → `tsx src/infrastructure/scripts/seed-derived.script.ts`

## 6. Actualizar documentación

- [ ] 6.1 Actualizar sección de scripts de sincronización en `README.md`: reemplazar tabla y descripción de `seed:all` por el nuevo flujo de dos procesos separados con nota del paso asíncrono externo entre ellos
- [ ] 6.2 Actualizar el diagrama mermaid en `README.md` para reflejar la nueva separación de procesos
- [ ] 6.3 Actualizar `docs/roadmap/add-fifa-word-cup-feature.md` con el nuevo flujo recomendado usando `seed:derived`
