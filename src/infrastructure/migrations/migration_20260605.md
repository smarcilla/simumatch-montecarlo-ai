## Descripcion

El objetivo es migrar y sincronizar la Eurocopa 2024

### 1. Migrar la nueva league en entorno sim

```bash
cp src/infrastructure/scripts/data/leagues_sim.json src/infrastructure/scripts/data/leagues.json
pnpm seed:leagues
```

### 2. Hacer scraping de sofascore

Esto se hace desde el proyecto python.

### 3. Hacemos el Derived

```bash
cp .env.sim .env
pnpm seed:derived --league "UEFA European Championship" --season "2024"
```

### 4. Hacemos el Derived en entorno dev

```bash
cp .env.dev .env
pnpm seed:derived --league "UEFA European Championship" --season "2024"
```

### 5. Hacemos el Derived en entorno stage

```bash
cp .env.staging .env
pnpm seed:derived --league "UEFA European Championship" --season "2024"
```
