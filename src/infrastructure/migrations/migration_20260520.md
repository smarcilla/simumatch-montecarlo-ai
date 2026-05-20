## Descripcion

Probar el proceso de seed:derived para una liga y temporada concreta y luego hacer un reset:db para comprobar que el spec "fix-reset-db-safe-delete" resuelve el bug de eliminar Players que juegan en varias competiciones y temporadas.

### Entorno dev

App se ejecuta en local
La migración se realiza en BD simumatch-dev

Migrar los datos para Spain La Liga y 25/26

seasons 4
matches 79
shots (all) 11696
players (all) 2672
simulations (all) 13
chronicles (all) 9

```bash
cp .env.dev .env
pnpm seed:derived --league "Spain La Liga" --season "25/26"
```

seasons 4
matches 430
shots (all) 20496
players (all) 2823
simulations (all) 13
chronicles (all) 9

```bash
pnpm reset:db --league "Spain La Liga" --season "25/26"
```

seasons 4
matches 430
shots (all) 20496
players (all) 2823
simulations (all) 12
chronicles (all) 9
