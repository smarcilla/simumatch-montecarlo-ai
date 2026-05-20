## Descripcion

### Entorno sim

App se ejecuta en local
La migración se realiza en BD simumatch-dev

Migrar los datos para el Campeonato del FIFA World Cup

```bash
cp .env.dev .env
pnpm seed:derived --league "FIFA World Cup" --season "2022"
pnpm seed:derived --league "FIFA World Cup" --season "2026" --season "2022"
```

```bash
cp .env.staging .env
pnpm seed:derived --league "FIFA World Cup" --season "2022"
pnpm seed:derived --league "FIFA World Cup" --season "2026" --season "2022"
```

### Errores

Falla la app porque hay un pequeño bug que resolví

```typescript
  private isValidSeasonYear(value: string): boolean {
    //TODO: Modificar esta validacion para que también soporte formato "2022" o "2026"
    return /^\d{2}\/\d{2}$/.test(value) || /^\d{4}$/.test(value);
  }
```

Primero deshacer los cambios.

```bash
pnpm reset:db --league "FIFA World Cup" --season "2022"
```

No funciona porque no deshace cambios. Elimina y vuelve a crear. Voy a necesitar un proceso que haga rollback.

Ademas algunos matches fallaban al entrar en el detalle porque habían shots que apuntaban a un player que no existia.

## Hipotesis del Error

Al ejecutar el reset sobre una liga y season concreta, se borraron los jugadores que habían disparado en ese torneo. El problema es que esos jugadores también habían marcado en otros torneos.

Un Player solo se puede eliminar si no hay shots asociados a el.
