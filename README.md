# Oficina Backend

Backend em Node.js + TypeScript com acesso direto ao PostgreSQL via SQL e migrations com node-pg-migrate em TypeScript.

## Requisitos

- Node.js 20+
- Banco PostgreSQL acessivel via `DATABASE_URL`

## Configuracao

1. Copie `.env.example` para `.env` e ajuste os valores.
2. Instale dependencias:

### Sessao e CORS em producao

Se o frontend estiver em `http://localhost:8080` e a API na VPS com HTTPS, configure:

```bash
CORS_ORIGIN=http://localhost:8080,https://apitorqueos.graciki.systems
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=none
```

```bash
npm install
```

## Migrations (node-pg-migrate)

O padrao oficial de nomenclatura do banco e **snake_case** para todos os artefatos:

- tabelas
- colunas
- constraints
- foreign keys
- indices
- sequences

Comandos:

```bash
npm run migration:status
npm run migration:up
npm run migration:down
npm run migration:create -- nome_da_migration
```

As migrations TypeScript ficam em `db/migrations`.

## Seed

```bash
npm run db:seed
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```
