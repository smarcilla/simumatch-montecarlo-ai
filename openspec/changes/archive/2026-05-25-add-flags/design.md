## Context

La entidad `Team` actualmente solo tiene identidad visual mediante `primaryColor` y `secondaryColor`, lo que genera escudos SVG inventados. Para la liga FIFA World Cup (selecciones nacionales) queremos mostrar las banderas reales de cada país usando la CDN pública flagcdn.com. La ingesta de equipos con el campo `flagUrl` la realizará el backend Python, que ya gestiona los raw data y tiene acceso al JSON de códigos de países de flagcdn.com.

El script `derived-sync.ts` de este proyecto actualmente sincroniza teams desde los raw; esa responsabilidad pasa íntegramente al backend Python para evitar doble ingesta y mantener un único punto de ingesta.

## Goals / Non-Goals

**Goals:**

- Añadir `flagUrl` opcional a la entidad `Team`, el modelo MongoDB y el repositorio.
- Exponer `homeFlag`/`awayFlag` opcionales en los resultados de consulta de partidos.
- Crear componentes `TeamFlag` y `TeamBadge` en el frontend; `TeamBadge` sustituye a todos los usos de `TeamShield` / `TableTeamShield`.
- Eliminar la sincronización de teams de `derived-sync.ts`.

**Non-Goals:**

- Escudos reales para equipos de clubs (trabajo futuro).
- Almacenar el contenido SVG de las banderas localmente (se consume directamente desde flagcdn.com).
- Modificar `UpsertTeamCommand` o `UpsertTeamsUseCase` (quedan intactos; se eliminarán en una iteración posterior tras validar el backend Python).
- Crear un script de resolución de flags en este proyecto.

## Decisions

### 1. Almacenar la URL completa, no el código ISO

`flagUrl` guarda `https://flagcdn.com/{code}.svg` en lugar de solo el código de país.

**Alternativa**: guardar el código `es`, `fr`, etc., y construir la URL en el frontend.

**Rationale**: si flagcdn.com cambia su estructura de URLs, el backend Python actualiza el valor en BD sin necesidad de tocar este proyecto. Esta capa no tiene que conocer la estructura de la CDN externa.

### 2. flagUrl como campo opcional (`flagUrl?: string`)

No se hace obligatorio ni se añade un valor por defecto.

**Rationale**: los equipos de clubs no tendrán `flagUrl` en el corto plazo. El frontend debe degradar graciosamente al escudo SVG cuando el campo está ausente.

### 3. Nuevo componente `TeamBadge` como único punto de decisión

Se crea `TeamBadge` (shared) que recibe `flagUrl?`, `primary` y `secondary` y decide internamente qué renderizar. Todos los componentes que actualmente usan `TeamShield` o `TableTeamShield` pasan a usar `TeamBadge`.

**Alternativa**: duplicar la lógica condicional en cada componente consumidor.

**Rationale**: la lógica "flag si existe, escudo si no" es invariable y no debería dispersarse. `TeamBadge` encapsula ese invariante. Si en el futuro se añaden escudos reales para clubs, solo hay que tocar `TeamBadge`.

### 4. No modificar UpsertTeamCommand ni UpsertTeamsUseCase

El use-case queda como está. El backend Python inserta directamente en la colección `teams` de MongoDB incluyendo `flagUrl`. El `$set` del repositorio no toca campos no listados, por lo que no borra `flagUrl` si ya existe.

**Rationale**: evita cambios en la cadena de ingesta de este proyecto y reduce el riesgo de regresión. Cuando el backend Python esté completamente validado, se elimina el use-case.

### 5. Eliminar teams del flujo de derived-sync.ts

Se retira la llamada a `buildTeamCommands` y la invocación del `UpsertTeamsUseCase` de `derived-sync.ts`.

**Rationale**: evitar doble ingesta. El backend Python es el único responsable de poblar la colección `teams`. Mantener el sync de teams en este proyecto implicaría ejecutar una operación redundante y potencialmente con datos incompletos (sin `flagUrl`).

## Risks / Trade-offs

- **[Riesgo] Backend Python no lista a tiempo** → Los documentos team en MongoDB no tendrán `flagUrl`. La UI renderiza el escudo SVG existente (degradación graciosa). Impacto: puramente visual, no funcional.
- **[Riesgo] Outage de flagcdn.com** → Las `<img>` con `flagUrl` devuelven 404. Mitigación: añadir un handler `onError` en `TeamFlag` que oculte la imagen o muestre un fallback (texto con el nombre corto del equipo). NOTA: Quizás sea mejor que si hay un error entonces se trate como sino existiera el flagUrl.
- **[Trade-off] teams eliminados de derived-sync** → Si alguien ejecuta `pnpm seed:derived` en un entorno sin el backend Python, los teams no se actualizarán. Es un trade-off aceptado: `derived-sync` pasa a ser un script parcial hasta que toda la ingesta migre al backend Python.
