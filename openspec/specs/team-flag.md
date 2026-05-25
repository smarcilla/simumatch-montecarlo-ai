## ADDED Requirements

### Requirement: Team entity soporta flagUrl opcional

La entidad `Team` y el modelo MongoDB `TeamModel` SHALL incluir el campo `flagUrl` de tipo `string` opcional. El `MongooseTeamRepository` SHALL mapear este campo al leer documentos y preservarlo al hacer upsert.

#### Scenario: Team con flagUrl se persiste y recupera

- **WHEN** un documento de la colección `teams` en MongoDB contiene el campo `flagUrl`
- **THEN** `MongooseTeamRepository.findByExternalId` devuelve un `Team` con `flagUrl` igual al valor almacenado

#### Scenario: Team sin flagUrl devuelve undefined

- **WHEN** un documento de la colección `teams` en MongoDB no contiene el campo `flagUrl`
- **THEN** `MongooseTeamRepository.findByExternalId` devuelve un `Team` con `flagUrl` igual a `undefined`

#### Scenario: Upsert de team no borra flagUrl existente

- **WHEN** `MongooseTeamRepository.upsert` se ejecuta con un `Team` sin `flagUrl`
- **THEN** si el documento ya tenía `flagUrl` en MongoDB, ese valor se preserva (no se sobreescribe con `$set`)

### Requirement: Los resultados de consulta de partidos exponen flags opcionales

`FindMatchByIdResult` y `FindMatchByLeagueAndSeasonResult` SHALL incluir los campos opcionales `homeFlag?: string` y `awayFlag?: string`. Los use-cases correspondientes SHALL mapear `flagUrl` del equipo a estos campos.

#### Scenario: Resultado incluye flag cuando el equipo tiene flagUrl

- **WHEN** `FindMatchByIdUseCase.execute` mapea un partido cuyo equipo local tiene `flagUrl`
- **THEN** el resultado incluye `homeFlag` con ese valor

#### Scenario: Resultado omite flag cuando el equipo no tiene flagUrl

- **WHEN** `FindMatchByIdUseCase.execute` mapea un partido cuyo equipo local no tiene `flagUrl`
- **THEN** `homeFlag` es `undefined` en el resultado

#### Scenario: Lo mismo aplica para el equipo visitante

- **WHEN** `FindMatchByLeagueAndSeasonUseCase.execute` mapea partidos
- **THEN** `awayFlag` refleja el `flagUrl` del equipo visitante, o es `undefined` si no existe
