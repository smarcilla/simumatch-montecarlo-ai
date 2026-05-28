## ADDED Requirements

### Requirement: TeamFlag se renderiza como círculo en mobile

Cuando `TeamBadge` muestra un `TeamFlag` (es decir, `flagUrl` está presente y no vacío), el componente SHALL envolver la imagen en un `<span>` con clase CSS que aplique `border-radius: 50%` y `overflow: hidden` en viewports de anchura ≤640px. En viewports superiores (tablet, desktop) la imagen SHALL conservar su forma rectangular.

La clase del wrapper SHALL variar según el `size` de `TeamBadge`:

- `size="card"` → wrapper con dimensiones 32×32px en mobile
- `size="table"` → el wrapper existente `table-team-shield-wrap` recibe la clase adicional `team-flag-circle-wrap`, con dimensiones 20×20px en mobile
- `size="detail"` → wrapper con dimensiones 64×64px en mobile

Cuando `flagUrl` no está presente (`TeamShield`), NO se aplica ningún wrapper circular.

Los wrappers circulares de bandera en mobile SHALL incluir un borde ligero para mejorar contraste visual cuando los colores de la bandera se aproximan al fondo.

#### Scenario: Bandera en card es circular en mobile

- **WHEN** `TeamBadge` recibe `flagUrl` no vacío con `size="card"` y el viewport es ≤640px
- **THEN** el badge se envuelve en un `<span>` con clase `team-flag-circle-wrap-card` que aplica `border-radius: 50%; overflow: hidden; width: 32px; height: 32px`

#### Scenario: Bandera en card es rectangular en desktop

- **WHEN** `TeamBadge` recibe `flagUrl` no vacío con `size="card"` y el viewport es >640px
- **THEN** la imagen se muestra sin recorte circular, con las dimensiones originales (40×46px)

#### Scenario: Bandera en table es circular en mobile

- **WHEN** `TeamBadge` recibe `flagUrl` no vacío con `size="table"` y el viewport es ≤640px
- **THEN** el wrapper `table-team-shield-wrap` tiene la clase adicional `team-flag-circle-wrap` aplicando `border-radius: 50%; overflow: hidden; width: 20px; height: 20px`

#### Scenario: Bandera en detail es circular en mobile

- **WHEN** `TeamBadge` recibe `flagUrl` no vacío con `size="detail"` y el viewport es ≤640px
- **THEN** el badge se envuelve en un `<span>` con clase `team-flag-circle-wrap-detail` que aplica `border-radius: 50%; overflow: hidden; width: 64px; height: 64px`

#### Scenario: Escudo permanece rectangular en mobile

- **WHEN** `TeamBadge` no recibe `flagUrl` (renderiza `TeamShield`) y el viewport es ≤640px
- **THEN** el SVG del escudo se muestra sin wrapper circular y sin cambio de forma

#### Scenario: La imagen rellena el wrapper con object-fit cover

- **WHEN** `TeamFlag` está dentro de un wrapper circular en mobile
- **THEN** la `<img>` ocupa el 100% del ancho y alto del wrapper con `object-fit: cover`

#### Scenario: Borde ligero visible en flags circulares mobile

- **WHEN** `TeamFlag` se renderiza en wrapper circular y el viewport es ≤640px
- **THEN** el wrapper aplica un borde ligero visible alrededor del círculo
