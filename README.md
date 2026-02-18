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

- **Usuarios** - 5 usuarios de teste:
  | Nome              | Email                  | Senha         |
  |-------------------|------------------------|---------------|
  | Alice Silva       | alice@example.com      | password123   |
  | Bob Santos        | bob@example.com        | password123   |
  | Charlie Johnson   | charlie@example.com    | password123   |
  | Diana Rodriguez   | diana@example.com      | password123   |
  | Eduardo Ferreira  | eduardo@example.com    | password123   |

- **Filmes** - 25 filmes de exemplo com generos, idiomas e poster/backdrop do TMDb:
  - The Matrix (en, Action/Sci-Fi)
  - Cidade de Deus (pt, Drama/Crime)
  - A Viagem de Chihiro (ja, Animation/Family/Fantasy)
  - Parasita (ko, Comedy/Thriller/Drama)
  - Interestelar (en, Adventure/Drama/Sci-Fi)
  - Um Sonho de Liberdade (en, Drama/Crime)
  - O Poderoso Chefão (en, Drama/Crime)
  - Batman: O Cavaleiro das Trevas (en, Action/Crime/Drama/Thriller)
  - Pulp Fiction (en, Thriller/Crime)
  - A Lista de Schindler (en, Drama/History/War)
  - A Origem (en, Action/Sci-Fi/Adventure)
  - Forrest Gump (en, Comedy/Drama/Romance)
  - Clube da Luta (en, Drama/Thriller)
  - O Silêncio dos Inocentes (en, Crime/Drama/Thriller)
  - O Senhor dos Anéis: A Sociedade do Anel (en, Adventure/Fantasy/Action)
  - Titanic (en, Drama/Romance)
  - Os Bons Companheiros (en, Crime/Drama)
  - Avatar (en, Action/Adventure/Sci-Fi)
  - Jurassic Park (en, Adventure/Sci-Fi)
  - De Volta para o Futuro (en, Adventure/Comedy/Sci-Fi)
  - Blade Runner 2049 (en, Sci-Fi/Drama/Mystery)
  - La La Land (en, Drama/Music/Romance)
  - Oppenheimer (en, Drama/History)
  - Tudo em Todo o Lugar ao Mesmo Tempo (en, Action/Adventure/Sci-Fi/Comedy)
  - O Fabuloso Destino de Amélie Poulain (fr, Comedy/Romance)
  - Os Sete Samurais (ja, Action/Adventure/Drama)
  - O Labirinto do Fauno (es, Drama/Fantasy/Thriller)

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
