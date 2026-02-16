# Cubos Fullstack Challenge

Aplicacao web fullstack para gerenciamento de filmes com autenticacao de usuarios.

## Estrutura do Projeto

Monorepo com [Turborepo](https://turbo.build/):

```
apps/
  backend/    # API REST com Fastify + Prisma + PostgreSQL
  frontend/   # SPA com React + TypeScript
packages/
  dtos/       # DTOs compartilhados entre frontend e backend
```

## Pre-requisitos

- Node.js 20+
- PostgreSQL
- Redis

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Configure as variaveis de ambiente no `apps/backend/.env`

3. Execute as migrations:

```bash
cd apps/backend
npx prisma migrate deploy
```

4. Execute os seeds obrigatorios (generos e idiomas):

```bash
npm run seed --workspace=backend
```

## Seeds

O projeto possui dois comandos de seed:

### `npm run seed` (producao)

Popula os dados obrigatorios para o funcionamento do sistema:

- **Generos** - 19 generos de filmes baseados no TMDb (Action, Comedy, Drama, etc.)
- **Idiomas** - 30 idiomas comuns baseados no TMDb (English, Portuguese, Japanese, etc.)

Esses dados sao necessarios para o sistema funcionar corretamente. O comando e idempotente (`skipDuplicates`), podendo ser executado multiplas vezes sem duplicar dados.

### `npm run seed:dev` (desenvolvimento)

Executa os seeds de producao **e adicionalmente** popula dados de exemplo para desenvolvimento:

- **Usuarios** - 2 usuarios de teste:
  | Nome         | Email             | Senha         |
  |--------------|-------------------|---------------|
  | Alice Silva  | alice@example.com | password123   |
  | Bob Santos   | bob@example.com   | password123   |

- **Filmes** - 5 filmes de exemplo com generos, idiomas e poster/backdrop do TMDb:
  - The Matrix (en, Action/Sci-Fi)
  - Cidade de Deus (pt, Drama/Crime)
  - A Viagem de Chihiro (ja, Animation/Family/Fantasy)
  - Parasita (ko, Comedy/Thriller/Drama)
  - Interestelar (en, Adventure/Drama/Sci-Fi)

## Executando

### Desenvolvimento

```bash
npm run dev
```

Inicia o backend (API + worker) e o frontend simultaneamente via Turborepo.

### Producao

```bash
npm run build
npm run start --workspace=backend
```
