# Security and release checklist

This repository is designed to make the backend authoritative for authentication and authorization. Before production deployment:

- [ ] Replace every development secret in `.env` with secret-manager values.
- [ ] Use HTTPS and `NODE_ENV=production` so auth cookies become Secure.
- [ ] Restrict `CORS_ORIGIN` to the exact deployed web origin(s).
- [ ] Run `npm audit --audit-level=high` and remediate all known critical/high issues.
- [ ] Run a secret scanner against the repository and CI artifacts.
- [ ] Run API authorization tests including cross-user/project access attempts.
- [ ] Run DAST (for example OWASP ZAP) against staging.
- [ ] Run browser E2E tests for login, refresh, logout, projects and task updates.
- [ ] Use versioned Prisma migrations in production.
- [ ] Put private documents/media in object storage and serve them with authorization-aware signed URLs.
- [ ] Enable backups and point-in-time recovery for PostgreSQL.
- [ ] Configure monitoring and alerting for API errors, authentication failures and database health.

The project does not claim mathematical “zero vulnerabilities”. The intended release gate is zero known critical/high vulnerabilities, zero failing required tests, and no unresolved security findings that could compromise confidentiality, integrity or availability.
