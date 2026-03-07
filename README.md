# Cine Manager

Full-stack movie management platform with authentication, movie catalog CRUD, custom lists, ratings, and media upload support.

## Project Structure

This repository is a monorepo managed with [Turborepo](https://turbo.build/):

```text
apps/
  backend/    Fastify + Prisma REST API and background worker
  frontend/   React + Vite single-page application
packages/
  dtos/       Shared DTOs and error codes
  validators/ Shared Zod validators
```

## Tech Stack

- Backend: Fastify, Prisma, PostgreSQL, Redis, JWT, Argon2, S3/MinIO, Resend
- Frontend: React 19, React Router 7, React Query, Vite, Tailwind CSS
- Tooling: Turborepo, Vitest, Biome, TypeScript

## Prerequisites

- Node.js 24.x
- npm 11.x (project uses `npm@11.7.0`)
- Docker + Docker Compose (recommended for local infra)

You can also run with local services instead of Docker:
- PostgreSQL
- Redis
- S3-compatible object storage (MinIO or AWS S3)

## Quick Start (Local Development)

1. Install dependencies:

```bash
npm install
```

2. Start local infrastructure (Postgres, Redis, MinIO):

```bash
cd apps/backend
docker compose up -d
cd ../..
```

3. Create environment files:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

4. Update `apps/backend/.env` with your values.

Required backend variables:
- `DATABASE_URL`
- `REDIS_URL` (required by runtime validation)
- `ACCESS_TOKEN_SECRET` (minimum 32 characters)
- `FRONTEND_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- S3 variables (`S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`)

Example local `REDIS_URL`:

```env
REDIS_URL="redis://localhost:6379"
```

Frontend environment:
- `VITE_API_URL` (default local value is `http://localhost:3000`)

5. Run database migrations:

```bash
cd apps/backend
npx prisma migrate deploy
cd ../..
```

6. Seed required reference data (genres and languages):

```bash
npm run seed --workspace=backend
```

7. Start everything in development mode:

```bash
npm run dev
```

This starts:
- Backend API
- Backend outbox worker
- Frontend app

## Local URLs

- Frontend: `http://localhost:5173`
- API base: `http://localhost:3000/api/v1`
- Health check: `http://localhost:3000/health`
- API docs (non-production + `ENABLE_DOCS=true`): `http://localhost:3000/docs`
- MinIO API: `http://localhost:9000`
- MinIO console: `http://localhost:9001`

## Authentication Model

- `POST /api/v1/auth/login` returns an access token in the response body.
- A refresh token is stored in an `httpOnly` cookie (`refreshToken`).
- Protected routes require `Authorization: Bearer <accessToken>`.
- `POST /api/v1/auth/refresh` rotates tokens using the cookie.

## API Route Groups

Base path: `/api/v1`

- Auth: `/auth/*`
- Users: `/users/*`
- Movies: `/movies/*`
- Movie Lists: `/lists/*`
- Genres: `/genres`
- Languages: `/languages`
- Uploads: `/uploads/signed-url`

Public route outside `/api/v1`:
- `GET /health`

## Seed Commands

- `npm run seed --workspace=backend`
Creates required reference data only:
  - 19 movie genres
  - 30 languages

- `npm run seed:dev --workspace=backend`
Runs `seed` plus development fixtures:
  - 5 test users (all with password `password123`)
  - 27 sample movies
  - generated ratings

Test users:

| Name | Email | Password |
| --- | --- | --- |
| Alice Silva | alice@example.com | password123 |
| Bob Santos | bob@example.com | password123 |
| Charlie Johnson | charlie@example.com | password123 |
| Diana Rodriguez | diana@example.com | password123 |
| Eduardo Ferreira | eduardo@example.com | password123 |

## Scripts

Root:
- `npm run dev` - run frontend + backend + worker
- `npm run build` - build all workspaces
- `npm run test` - run tests in all workspaces
- `npm run typecheck` - run TypeScript checks
- `npm run lint` - run Biome lint
- `npm run format` - format repository with Biome
- `npm run check` - Biome check

Backend (`--workspace=backend`):
- `npm run dev`
- `npm run dev:worker`
- `npm run build`
- `npm run start`
- `npm run start:worker`
- `npm run test`
- `npm run test:integration`
- `npm run test:e2e`
- `npm run seed`
- `npm run seed:dev`

Frontend (`--workspace=frontend`):
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`

## Testing

Run all tests:

```bash
npm run test
```

Run backend suites individually:

```bash
npm run test --workspace=backend
npm run test:integration --workspace=backend
npm run test:e2e --workspace=backend
```

## Production Notes

Build everything:

```bash
npm run build
```

Run backend API and worker:

```bash
npm run start --workspace=backend
npm run start:worker --workspace=backend
```

The frontend build output is generated in `apps/frontend/dist` and should be served by your preferred static hosting solution.
