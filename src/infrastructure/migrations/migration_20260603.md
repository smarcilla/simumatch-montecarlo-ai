## Descripcion

Probar el proceso de seed:derived para una liga y temporada concreta para comprobar que tanto el tournamentSlug como el matchSlug se sincronizan correctamente en Match

### Entorno sim

App se ejecuta en local
La migración se realiza en BD sim-demo

Migrar los datos para Spain La Liga y 25/26

seasons 4
matches 79
shots (all) 11696
players (all) 2672
simulations (all) 13
chronicles (all) 9

```bash
cp .env.sim .env
pnpm seed:derived --league "Spain La Liga" --season "25/26"
```

```bash
cp .env.sim .env
pnpm seed:derived --league "FIFA World Cup" --season "2022"
``




```
