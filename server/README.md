# Safety Platform - Backend Server

NestJS backend API for the Safety Platform with PostgreSQL and TypeORM.

## Features

- **Tenant Management**: Full CRUD operations for tenant admins
- **Authentication**: JWT-based authentication for tenant admins
- **Status Control**: Super Admin can activate/deactivate tenant accounts
- **Auto-blocking**: Tenant admins cannot login if their status is set to "offline"

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport JWT
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your PostgreSQL credentials
```

## Environment Variables

```env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=safety_platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## Database Setup

1. Create PostgreSQL database:

```sql
CREATE DATABASE safety_platform;
```

2. The tables will be created automatically when you start the server (TypeORM synchronize is enabled in development).

## Running the Application

```bash
# Development mode with auto-reload
npm run start:dev

# Production build
npm run build

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### Login (Tenant Admin)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "tenant@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "jwt-token-here",
  "tenant": {
    "id": "uuid",
    "fullname": "John Doe",
    "email": "tenant@example.com",
    "phoneNumber": "+1234567890",
    "status": "active"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "userId": "uuid",
  "email": "tenant@example.com",
  "status": "active"
}
```

### Tenants (Super Admin)

#### Get All Tenants
```http
GET /api/tenants

Response:
[
  {
    "id": "uuid",
    "fullname": "John Doe",
    "email": "tenant@example.com",
    "phoneNumber": "+1234567890",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Single Tenant
```http
GET /api/tenants/:id

Response:
{
  "id": "uuid",
  "fullname": "John Doe",
  "email": "tenant@example.com",
  "phoneNumber": "+1234567890",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Create Tenant
```http
POST /api/tenants
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "tenant@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "status": "active"
}

Response:
{
  "id": "uuid",
  "fullname": "John Doe",
  "email": "tenant@example.com",
  "phoneNumber": "+1234567890",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Tenant
```http
PATCH /api/tenants/:id
Content-Type: application/json

{
  "status": "offline"
}

Response:
{
  "id": "uuid",
  "fullname": "John Doe",
  "email": "tenant@example.com",
  "phoneNumber": "+1234567890",
  "status": "offline",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Delete Tenant
```http
DELETE /api/tenants/:id

Response: 204 No Content
```

## Business Logic

### Tenant Status Control

1. **Super Admin** can create tenants with status `active` or `offline`
2. **Super Admin** can change tenant status at any time
3. **Tenant Admin** can only login if their status is `active`
4. When a tenant's status is changed to `offline`:
   - Existing JWT tokens are still validated
   - But the status check in JWT strategy prevents access
   - Tenant Admin cannot login again until status is set back to `active`

### Password Security

- Passwords are automatically hashed using bcrypt before saving
- Password hash uses 10 salt rounds
- Passwords are never returned in API responses

### Validation

All DTOs use class-validator:
- Email must be valid email format
- Password must be at least 6 characters
- Required fields are validated

## Project Structure

```
src/
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── jwt.strategy.ts
├── tenants/
│   ├── dto/
│   │   ├── create-tenant.dto.ts
│   │   └── update-tenant.dto.ts
│   ├── tenant.entity.ts
│   ├── tenants.controller.ts
│   ├── tenants.service.ts
│   └── tenants.module.ts
├── common/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── decorators/
│       └── current-user.decorator.ts
├── app.module.ts
└── main.ts
```

## Security Notes

1. **Change JWT_SECRET** in production to a strong random value
2. **Use environment variables** for all sensitive configuration
3. **Enable HTTPS** in production
4. **Set up database backups**
5. **Use strong passwords** for database and tenants
6. **Disable TypeORM synchronize** in production (use migrations instead)

## License

MIT
