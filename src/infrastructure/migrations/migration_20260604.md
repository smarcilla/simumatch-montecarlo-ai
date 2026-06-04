## Descripcion

Probar el proceso de seed:derived para una liga y temporada concreta para comprobar que tanto el tournamentSlug como el matchSlug se sincronizan correctamente en Match

### Entorno dev

App se ejecuta en local
La migración se realiza en BD simumatch-dev

```bash
cp .env.dev .env
pnpm seed:derived --league "FIFA World Cup" --season "2022"
``




```
