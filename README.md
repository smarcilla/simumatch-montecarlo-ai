# SimuMatch Montecarlo AI

## Tecnologías utilizadas

- NextJs 16
-

## Arquitectura de carpetas

```
src/
├── app/               <-- Infrastructure (Input: Web/API)
├── infrastructure/
│   ├── db/            <-- Infrastructure (Output: Mongoose)
│   └── scripts/       <-- Infrastructure (Input: Ingestión)
│       └── ingest.ts
├── application/       <-- Casos de uso (Lógica)
└── domain/            <-- Entidades (Corazón)
```
