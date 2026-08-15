# BUBBLE Engineering Build Status

## Dependency remediation applied

The previous dependency baseline reported by the developer included 28 npm audit findings, including 11 high and 1 critical, plus deprecated packages such as `inflight`, `npmlog`, `rimraf@3`, `glob@7`, and the old `bcrypt` installation chain.

This release replaces that baseline with:

- Next.js 15.5.22
- React / React DOM 19.2.7
- NestJS 11.1.28
- Nest CLI 11.0.7
- Nest Schematics 11.1.0
- Nest Config 4.0.4
- Nest JWT 11.0.2
- Nest mapped-types 2.1.1
- Nest Throttler 6.5.0
- bcrypt 6.0.0
- Prisma 6.19.2
- Helmet 8.1.0
- class-validator 0.15.1
- TypeScript 6.0.3
- ts-jest 29.4.12

These changes specifically remove the old bcrypt/node-pre-gyp dependency chain that was responsible for several deprecated transitive packages and move Next.js/React off vulnerable releases.

## Required verification on a network-enabled machine

```bash
npm ci
npm audit --audit-level=high
npm run db:generate
npm run build
npm run test:api
```

A successful `npm audit --audit-level=high` with exit code 0 is the required dependency-security gate. A successful build/test run is the required functional gate.
