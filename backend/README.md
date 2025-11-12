# Safety Backend (NestJS + Postgres + TypeORM)

A minimal NestJS backend configured with TypeORM and Postgres for the Safety project.

## Prerequisites

- Node.js 18+
- Docker (optional, for local Postgres via Compose)

## Setup

1. Copy the example env and adjust if needed:
   ```bash
   cp .env.example .env
   ```
2. (Optional) Start Postgres locally:
   ```bash
   docker compose up -d
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run in development mode:
   ```bash
   npm run start:dev
   ```

API runs at `http://localhost:3000`.

## Database & TypeORM

- App DB config is from env in `src/app.module.ts` via `ConfigModule`.
- CLI/migrations use `src/db/data-source.ts` which reads from `.env`.

### Entities
- Example entity: `src/users/user.entity.ts`.

### Migrations

Generate a migration (adjust the name):
```bash
npm run typeorm:generate -- --name init
```

Run migrations:
```bash
npm run typeorm:migrate
```

Revert last migration:
```bash
npm run typeorm:revert
```

Notes:
- Migration generation inspects your entities. Ensure DB is reachable (env OK).
- By default `synchronize` is disabled. Use migrations for schema changes.

## Endpoints

- `GET /` → `{ status: "ok" }`
- `GET /users` → returns users array (empty until you add records)

## Scripts

- `npm run start:dev` — Dev server with ts-node-dev
- `npm run build` — Compile to `dist/`
- `npm run start` — Run compiled server
- `npm run typeorm:*` — Migration helpers via TypeORM CLI

## Project Structure

```
backend/
  src/
    db/
      data-source.ts
      migrations/
    users/
      user.entity.ts
      users.controller.ts
      users.module.ts
      users.service.ts
    app.controller.ts
    app.module.ts
    app.service.ts
    main.ts
```

## Troubleshooting

- If `typeorm` CLI has trouble resolving TS paths, ensure `ts-node` and `tsconfig-paths` are installed (they are in devDependencies) and use the included npm scripts.
- On Windows PowerShell, double-dash `--` separator is required before CLI args.

## Running Without Postgres

To run without a database, use file-based storage for tenants:

1. Copy env: `cp .env.example .env`
2. Set `DB_DISABLED=true` in `.env`
3. Start dev: `npm run start:dev`

## Endpoints (initial)

- `GET /api` -> `{ status: "ok" }`
- Auth:
  - `POST /api/auth/login` with body `{ login, password }`.
    - Static super admin: login `superadmin@gmail.com`, password `superAdmin123!`
    - Returns `{ token, user }` where `token` is `superadmin-token`.
- Super Admin Tenants (requires header `Authorization: Bearer superadmin-token`):
  - `GET /api/super-admin/tenants` list tenants
  - `GET /api/super-admin/tenants/:id` get tenant
  - `POST /api/super-admin/tenants` create tenant (single title) with optional initial admin credentials
    - Body: `{ slug, title, [adminLogin, adminPassword, adminEmail, adminFirstName, adminLastName] }`
  - `PATCH /api/super-admin/tenants/:id` update fields (same keys)
  - `DELETE /api/super-admin/tenants/:id` delete tenant
  - `POST /api/super-admin/tenants/:id/admins` create tenant admin (with credentials)
    - Body: `{ login, password, [email], firstName, lastName }`
