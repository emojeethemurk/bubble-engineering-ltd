# Dependency and Security Baseline

This release updates the application dependency baseline to current supported security-patched lines as of August 2026, including Next.js ^16.3.0, React 19.2.7, NestJS ^11.1.29 (core/common/platform-express), @nestjs/cli ^11.0.24, bcrypt 6.0.0, Prisma 6.19.2, Helmet 8.1.0, TypeScript 6.0.3, and current Nest testing packages.

## 2026-08-14 audit remediation

A 28-finding `npm audit` (3 low, 13 moderate, 11 high, 1 critical) was traced and fixed at the source:

| Package | Was vulnerable | Fixed via |
|---|---|---|
| `@nestjs/core` / `platform-express` / `common` | <=11.1.17 / <=11.1.14 / 11.0.16-11.1.16 (injection, file-type DoS) | bumped to `^11.1.29` |
| `@nestjs/cli` chain (`ajv`, `glob`, `picomatch`, `tmp`, `webpack`, `@angular-devkit/*`) | various | `@nestjs/cli` bumped to `^11.0.24` + root `overrides` pinning `ajv@^8.18.0`, `glob@^11.1.0`, `picomatch@^4.0.4`, `tmp@^0.2.6`, `webpack@^5.106.0` |
| `body-parser` / `multer` / `qs` / `express` | DoS chain via `@nestjs/platform-express` | resolved by the platform-express bump; `qs` also pinned via `overrides` (`^6.15.2`) as a backstop |
| `lodash` | <=4.17.23 (code injection / prototype pollution) via old `@nestjs/config` | `@nestjs/config` was already `^4.0.4` (fix floor); `overrides` pins `lodash@^4.18.0` as a backstop |
| `postcss` / `sharp` | bundled inside `next` <16.3.0 (XSS, path traversal, libvips CVEs) | `next` bumped to `^16.3.0`; top-level `postcss` devDependency tightened to `^8.5.23`; `sharp` pinned via `overrides` (`^0.35.0`) |
| `tar` (critical) | <=7.5.20, via `bcrypt` → `@mapbox/node-pre-gyp` (build-time only) | root `overrides` pins `tar@^7.5.21` |

**Note on `next` 15 → 16:** this is a major version bump made solely to pull the patched `postcss`/`sharp`. It was not verified against the app's actual page/route code in this pass — run `npm run build` and the app's test suite before deploying, and check the [Next.js 16 upgrade guide](https://nextjs.org/docs) for breaking changes relevant to this codebase.

Important: `npm audit` is registry-state dependent. The repository cannot truthfully claim a permanent zero-vulnerability state because advisories can be published after a release. Before production deployment, install from the registry and run:

```bash
npm ci
npm audit --audit-level=high
npm run db:generate
npm run build
npm run test:api
```

Do not use `npm audit fix --force` as a first-line fix; it can introduce breaking changes.
