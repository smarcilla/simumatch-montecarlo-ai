## Context

El proyecto tiene una jerarquía de componentes para mostrar la identidad visual de equipos:

```
TeamBadge (decisor: flag vs shield)
  ├── TeamFlag  → <img flagUrl>  (equipos nacionales)
  └── TeamShield → <SVG colores> (equipos de clubs)
```

`TeamFlag` renderiza `<img>` con atributos HTML `width`/`height` y `style={{ objectFit: 'cover' }}`. Las dimensiones vienen de `BADGE_DIMENSIONS = { card: {40,46}, table: {20,24}, detail: {64,74} }`. En mobile las banderas son rectangulares, lo cual rompe las expectativas visuales del usuario.

`TeamBadge` con `size="table"` ya envuelve el badge en `<span className="table-team-shield-wrap">` para el tooltip CSS existente. Los `size="card"` y `size="detail"` devuelven el badge directamente sin wrapper.

Los DTOs de resultado (`FindMatchByLeagueAndSeasonResult`, `FindMatchByIdResult`) exponen solo `home`/`away` (nombre completo). La entidad `Team` ya tiene `shortName` desde la iteración anterior.

Las cabeceras de la tabla de disparos ya usan el patrón de `data-tooltip` con CSS `::after` existente en `.table-team-shield-wrap`.

## Goals / Non-Goals

**Goals:**

- Banderas circulares en mobile (≤640px) para todos los tamaños que muestren `TeamFlag`.
- Cabeceras "Equipo" y "Situación" abreviadas en mobile con tooltip al hover/focus/active.
- `shortName` de equipo en mobile en `MatchCard` y `MatchDetailCard` mediante CSS sin JS.
- Exponer `homeShortName`/`awayShortName` en los DTOs de resultado de partido.
- En el listado de partidos, mostrar en mobile solo 3 caracteres del `shortName` para evitar overflow.
- Añadir contraste visual a banderas circulares mobile mediante borde ligero.
- Compactar cabeceras de tablas de stats/simulación a un máximo de 3 caracteres en mobile.
- Corregir la alineación del bloque away en `ShotXgBar` para mobile.
- Mantener el mismo orden visual bandera+nombre en `ShotXgBar` para local y visitante.

**Non-Goals:**

- Escudos SVG (TeamShield) circulares en mobile — permanecen rectangulares.
- `shortName` en el dropdown de filtro de equipo de `ShotsTable`.
- Cambios en el backend Python ni en la ingesta de datos.
- Modificar los breakpoints existentes del proyecto.

## Decisions

### 1. Wrapper CSS condicional en TeamBadge para circularidad

`TeamBadge` envuelve el `TeamFlag` en un `<span>` con clase `team-flag-circle-wrap-{size}` cuando `normalizedFlagUrl` está presente. El CSS aplica `border-radius: 50%`, `overflow: hidden` y dimensiones iguales solo en `@media (max-width: 640px)`.

**Alternativa descartada**: CSS `!important` sobre los atributos inline de `width`/`height` de la `<img>`. Descartada por ser frágil y señal de diseño roto.

**Alternativa descartada**: `useMediaQuery` hook para pasar dimensiones cuadradas. Descartada por riesgo de hydration mismatch (SSR vs client diff).

**Rationale**: El wrapper controla la caja de recorte. La imagen llena el wrapper con `object-fit: cover` (ya declarado en `TeamFlag`). CSS `width: 100%; height: 100%` en la `<img>` dentro del wrapper override los atributos HTML en todos los browsers modernos. No requiere lógica JS.

**Dimensiones circulares en mobile**:

- `card` → 32×32px
- `table` → 20×20px (sin cambio de tamaño, solo circularidad)
- `detail` → 64×64px

Para `size="table"`, el wrapper existente `table-team-shield-wrap` recibe la clase adicional `team-flag-circle-wrap` cuando hay `flagUrl`.

### 2. Cabeceras abreviadas con data-tooltip CSS

Se añaden claves i18n `tableHeaders.teamShort` y `tableHeaders.situationShort` en ambos ficheros de mensajes. Las `<th>` de "Equipo" y "Situación" en `ShotsTable` renderizan:

```html
<th className="shots-th" data-tooltip={tShots("tableHeaders.team")}>
  <span className="th-full">{tShots("tableHeaders.team")}</span>
  <span className="th-abbr">{tShots("tableHeaders.teamShort")}</span>
</th>
```

CSS: `.th-abbr { display: none }` en desktop; `.th-full { display: none }` + `.th-abbr { display: inline }` en `@media (max-width: 640px)`.

El tooltip (`::after` con `content: attr(data-tooltip)`) ya está implementado para `.table-team-shield-wrap` y `.shot-icon-wrapper`. Se extiende a `shots-th` con la misma regla.

**Alternativa descartada**: `<abbr title="">`. El tooltip nativo no responde al tap en mobile.

### 3. shortName en MatchCard y MatchDetailCard via dual span + CSS

Los DTOs añaden `homeShortName` y `awayShortName`. Los componentes de UI renderizan:

```html
<span className="team-name-full">{name}</span>
<span className="team-name-short">{shortName}</span>
```

CSS: `.team-name-short { display: none }` en desktop; en `@media (max-width: 640px)` se invierte. La clase `.team-name` en `MatchCard` ya maneja el truncado y min-width; los spans heredan ese contexto.

**Alternativa descartada**: `useMediaQuery` hook. Riesgo de hydration mismatch en Next.js SSR; requiere `useEffect`; añade complejidad sin beneficio real para este caso.

**Rationale**: El contenido está en el DOM en ambos breakpoints, por lo que SSR y cliente siempre coinciden. El CSS es la capa correcta para decisiones puramente de presentación.

### 4. homeShortName/awayShortName en DTOs, no en entidad de dominio

Se añaden los campos a los DTOs de resultado y se mapean en los use cases. La entidad `Team` ya tiene `shortName`; no requiere cambios de dominio.

### 5. Truncado a 3 caracteres para MatchCard mobile

`MatchCard` mantiene dos spans (`team-name-full`, `team-name-short`) y calcula el valor de `team-name-short` truncando `shortName` a los primeros 3 caracteres. Esto evita desbordes cuando la fuente de datos trae short names largos.

### 6. Borde ligero en wrappers de bandera mobile

Los wrappers circulares de `TeamFlag` en mobile (`team-flag-circle-wrap-card`, `team-flag-circle-wrap-detail`, `team-flag-circle-wrap`) añaden un borde sutil para mantener legibilidad cuando el color dominante de la bandera coincide con el fondo de tarjeta.

### 7. Cabeceras compactas (<=3) en tablas de stats/simulación

Las tablas `ShotPlayerStatsTable`, `ShotGoalkeeperStatsTable`, `ScoreDistributionChart` y `PlayerStatsChart` adoptan patrón dual `th-full`/`th-abbr`. En mobile solo se muestra `th-abbr` con abreviaturas de 3 caracteres o menos.

### 8. Alineación away en ShotXgBar mobile

En `ShotXgBar`, la regla de escritorio que alinea el badge xG away a la derecha se revierte explícitamente en mobile para mantener consistencia visual con el resto de bloques de estadísticas.

### 9. Orden visual consistente en cabecera away de ShotXgBar

La cabecera del bloque away en `ShotXgBar` usa el mismo orden visual que el bloque local: primero `TableTeamBadge` y después el nombre del equipo. Esto evita una lectura inconsistente en la sección de estadísticas de disparos.

## Risks / Trade-offs

- **Atributos inline vs CSS**: El override `width: 100%; height: 100%` sobre atributos HTML de `<img>` dentro del wrapper funciona en browsers modernos. En navegadores muy antiguos podría no funcionar, pero el target del proyecto no incluye IE. → Mitigation: ninguna necesaria.

- **DOM dual span**: El nombre corto y largo están ambos en el DOM siempre. Los screen readers podrían leer ambos. → Mitigation: añadir `aria-hidden="true"` al span que no se muestra en el breakpoint actual. En la práctica, screen readers usan el texto visible; la duplicidad es mínima.

- **Tooltip en `<th>`**: El CSS `::after` para tooltip requiere que el `<th>` tenga `position: relative`. Si el CSS de la tabla no lo establece, el tooltip podría posicionarse de forma inesperada. → Mitigation: añadir `position: relative` a `.shots-th` con `data-tooltip` en el CSS.
