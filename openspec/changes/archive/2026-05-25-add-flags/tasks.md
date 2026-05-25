## 1. Dominio y persistencia

- [x] 1.1 Añadir `flagUrl?: string` a la entidad `Team` en `src/domain/entities/team.entity.ts`
- [x] 1.2 Añadir `flagUrl?: string` al interface `ITeamDocument` y al schema de Mongoose en `src/infrastructure/db/models/team.model.ts`
- [x] 1.3 Actualizar `MongooseTeamRepository.mapToEntity` para incluir `flagUrl` al construir la entidad
- [x] 1.4 Añadir test unitario: team con `flagUrl` se persiste y recupera correctamente
- [x] 1.5 Añadir test unitario: team sin `flagUrl` devuelve `undefined`

## 2. Capa de aplicación (lectura)

- [x] 2.1 Añadir `homeFlag?: string` y `awayFlag?: string` a `FindMatchByIdResult`
- [x] 2.2 Actualizar `FindMatchByIdUseCase.mapToResult` para mapear `flagUrl` de los equipos a `homeFlag`/`awayFlag`
- [x] 2.3 Añadir `homeFlag?: string` y `awayFlag?: string` a `FindMatchByLeagueAndSeasonResult`
- [x] 2.4 Actualizar `FindMatchByLeagueAndSeasonUseCase.mapToResult` para mapear los flags

## 3. Script derived-sync

- [x] 3.1 Eliminar la llamada a `buildTeamCommands` y la invocación del `UpsertTeamsUseCase` en `derived-sync.ts`
- [x] 3.2 Eliminar la función `buildTeamCommands` de `derived-sync.ts` si no tiene otros usos
- [x] 3.3 Actualizar el spec `seed-derived` si quedan referencias obsoletas al sync de teams en los logs del script

## 4. Componentes frontend

- [x] 4.1 Crear componente `TeamFlag` en `src/infrastructure/ui/components/TeamFlag.tsx` que renderice `<img src={flagUrl} alt={teamName} />` con manejo de error `onError`
- [x] 4.2 Crear componente `TeamBadge` en `src/infrastructure/ui/components/TeamBadge.tsx` que decida entre `TeamFlag` y `TeamShield` según `flagUrl`
- [x] 4.3 Crear variante `TableTeamBadge` (o adaptar `TeamBadge` con un prop `size`) para reemplazar `TableTeamShield` en tablas

## 5. Migración de componentes consumidores

- [x] 5.1 Actualizar `MatchCard.tsx`: pasar `homeFlag`/`awayFlag` del match y usar `TeamBadge` en lugar de `TeamShield`
- [x] 5.2 Actualizar `ShotIcons.tsx`: reemplazar `TableTeamShield` por `TableTeamBadge`, pasando `flagUrl`
- [x] 5.3 Actualizar `ScoreDistributionChart.tsx`: reemplazar `TableTeamShield` por `TableTeamBadge`
- [x] 5.4 Actualizar `PlayerStatsChart.tsx`: reemplazar `TableTeamShield` por `TableTeamBadge`
- [x] 5.5 Actualizar `ShotPlayerStatsTable.tsx`: reemplazar `TableTeamShield` por `TableTeamBadge`
- [x] 5.6 Actualizar `ShotXgBar.tsx`: reemplazar `TableTeamShield` por `TableTeamBadge`

## 6. Verificación

- [x] 6.1 Ejecutar suite de tests (`pnpm test`) y confirmar que no hay regresiones
- [x] 6.2 Verificar visualmente en local con un partido de FIFA World Cup que muestra banderas
- [x] 6.3 Verificar visualmente en local con un partido de otra liga que sigue mostrando escudos SVG
