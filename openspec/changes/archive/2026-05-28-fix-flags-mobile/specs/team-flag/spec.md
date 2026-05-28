## MODIFIED Requirements

### Requirement: Los resultados de consulta de partidos exponen flags opcionales

`FindMatchByIdResult` y `FindMatchByLeagueAndSeasonResult` SHALL incluir los campos opcionales `homeFlag?: string` y `awayFlag?: string`, y los campos obligatorios `homeShortName: string` y `awayShortName: string`. Los use-cases correspondientes SHALL mapear `flagUrl` y `shortName` del equipo a estos campos.

#### Scenario: Resultado incluye flag cuando el equipo tiene flagUrl

- **WHEN** `FindMatchByIdUseCase.execute` mapea un partido cuyo equipo local tiene `flagUrl`
- **THEN** el resultado incluye `homeFlag` con ese valor

#### Scenario: Resultado omite flag cuando el equipo no tiene flagUrl

- **WHEN** `FindMatchByIdUseCase.execute` mapea un partido cuyo equipo local no tiene `flagUrl`
- **THEN** `homeFlag` es `undefined` en el resultado

#### Scenario: Lo mismo aplica para el equipo visitante

- **WHEN** `FindMatchByLeagueAndSeasonUseCase.execute` mapea partidos
- **THEN** `awayFlag` refleja el `flagUrl` del equipo visitante, o es `undefined` si no existe

#### Scenario: Resultado incluye shortName de ambos equipos

- **WHEN** `FindMatchByIdUseCase.execute` o `FindMatchByLeagueAndSeasonUseCase.execute` mapea un partido
- **THEN** el resultado incluye `homeShortName` igual a `match.homeTeam.shortName` y `awayShortName` igual a `match.awayTeam.shortName`
