# BUBBLE Engineering Company Limited — Construction Platform

A production-oriented construction technology platform and corporate website built around the BUBBLE Engineering identity: **DESIGN · ENGINEER · INNOVATE · BUILD · DELIVER**.

## What is included

- Cinematic black/electric-blue public website with blueprint motion and responsive interactions.
- BUBBLE logo integrated into navigation, hero language, footer, login and command center.
- Animated process storytelling and construction-themed micro-interactions.
- Authenticated command center with real PostgreSQL-backed portfolio metrics.
- Project list/detail views with task status updates and progress derived from database tasks.
- Secure httpOnly authentication cookies, refresh-token rotation and RBAC.
- Client project isolation on project reads and dashboard summaries.
- PostgreSQL + Prisma schema and realistic development seed data.
- Helmet, CORS allow-list, validation/whitelisting, rate limiting and health endpoint.
- CI workflow for dependency install, Prisma generation, API lint/build/test and web build.
- Dockerfiles and Compose setup for PostgreSQL, API and web.
- Reduced-motion support and mobile layouts.

## Important security note

The repository contains **no real production API keys**. Integrations such as AI, maps, email and object storage are configured through environment variables. You must supply your own secrets in a local/production secret manager. Never commit `.env` or credentials.

The development seed credentials are intentionally demo-only and must be changed before any deployment.

## Local setup

```bash
cp .env.example .env
# Replace both JWT secrets with random values of at least 32 characters.

docker compose up -d db
npm install
npm run db:generate
npm run db:push
npm run db:seed

npm run dev:api
# in another terminal
npm run dev:web
```

Web: http://localhost:3000
API: http://localhost:4000/api/v1
Health: http://localhost:4000/api/v1/health

Development owner: `owner@bubble.example` / `ChangeMe123!`
Development client: `client@bubble.example` / `ChangeMe123!`

## Production database workflow

Use versioned Prisma migrations for production. After changing `schema.prisma`, generate a migration in a controlled development environment with:

```bash
npm run db:migrate
```

Then deploy migrations with `prisma migrate deploy` as part of your release process. Do not use `db push` as the production migration strategy.

## Validation checklist

Before release, run:

```bash
npm run db:generate
npm run build
npm run test --workspace=apps/api
npm audit --audit-level=high
```

Also run browser E2E tests and an external DAST/security scan against a staging deployment. A repository cannot honestly guarantee zero vulnerabilities; the release gate should be **zero known critical/high vulnerabilities and zero failing required tests**, with medium/low findings documented and assessed.

## Architecture

```text
construction-platform/
├── apps/
│   ├── web/              # Next.js public website + command center
│   └── api/              # NestJS REST API
├── packages/
│   └── database/         # Prisma schema + seed
├── docker-compose.yml
└── .github/workflows/ci.yml
```

The backend remains authoritative for authentication, authorization and business rules. The frontend never receives server-side secrets.
