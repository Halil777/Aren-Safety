# API Testing Guide for Safety Management Backend

## Overview
This guide explains how to test the Safety Management API using both Swagger UI and Insomnia REST client.

## Swagger UI Documentation

### Accessing Swagger
The backend includes auto-generated Swagger/OpenAPI documentation.

**URL:** http://localhost:3000/api/docs

### Features
- Interactive API documentation
- Try out API endpoints directly from the browser
- View request/response schemas
- See all available endpoints organized by tags

### Using Swagger UI

1. **Start the backend server:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Open Swagger UI:**
   Navigate to http://localhost:3000/api/docs in your browser

3. **Authenticate:**
   - Most endpoints require authentication
   - Click the "Authorize" button at the top
   - Enter your bearer token (obtained from the login endpoint)
   - Click "Authorize" then "Close"

4. **Test Endpoints:**
   - Expand any endpoint to see details
   - Click "Try it out"
   - Fill in the required parameters
   - Click "Execute"
   - View the response below

## Insomnia REST Client Setup

### Installing Insomnia
Download from: https://insomnia.rest/download

### Importing OpenAPI Specification

1. **Export Swagger JSON:**
   - Visit: http://localhost:3000/api/docs-json
   - Save the JSON file (Ctrl+S) as `swagger.json`

2. **Import to Insomnia:**
   - Open Insomnia
   - Click "Create" > "Import From" > "File"
   - Select the `swagger.json` file
   - Insomnia will create a collection with all endpoints

### Manual Collection Setup

If you prefer to set up manually:

#### 1. Create Base Environment

Create a new environment with these variables:

```json
{
  "base_url": "http://localhost:3000/api",
  "tenant_token": "",
  "superadmin_token": "",
  "tenant_id": "90f14174-44cf-46fc-b5b1-9fe55215833f"
}
```

#### 2. Authentication Flow

**Login Request:**
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "login": "admin@example.com",
  "password": "password123"
}
```

Copy the `token` from the response and set it in your environment variables.

#### 3. Key Endpoints

##### Authentication
- `POST /api/auth/login` - Login and get token

##### Super Admin - Tenants
- `GET /api/super-admin/tenants` - List all tenants
- `POST /api/super-admin/tenants` - Create new tenant
- `GET /api/super-admin/tenants/:id` - Get tenant by ID
- `PATCH /api/super-admin/tenants/:id` - Update tenant
- `DELETE /api/super-admin/tenants/:id` - Delete tenant
- `POST /api/super-admin/tenants/:id/admins` - Create tenant admin

##### Users
- `GET /api/tenant/users` - List all users (supports filters)
- `GET /api/tenant/users/stats` - Get user statistics
- `GET /api/tenant/users/:id` - Get user by ID
- `POST /api/tenant/users` - Create new user
- `PATCH /api/tenant/users/:id` - Update user
- `DELETE /api/tenant/users/:id` - Delete user

##### Observations
- `GET /api/tenant/observations` - List all observations
- `GET /api/tenant/observations/:id` - Get observation by ID
- `POST /api/tenant/observations` - Create new observation
- `PATCH /api/tenant/observations/:id` - Update observation
- `DELETE /api/tenant/observations/:id` - Delete observation
- `POST /api/tenant/observations/:id/supervisor-response` - Add supervisor response

##### Employees
- `GET /api/tenant/employees` - List all employees
- `GET /api/tenant/employees/:id` - Get employee by ID
- `POST /api/tenant/employees` - Create new employee
- `PATCH /api/tenant/employees/:id` - Update employee
- `DELETE /api/tenant/employees/:id` - Delete employee

##### Departments
- `GET /api/tenant/departments` - List all departments
- `GET /api/tenant/departments/:id` - Get department by ID
- `POST /api/tenant/departments` - Create new department
- `PATCH /api/tenant/departments/:id` - Update department
- `DELETE /api/tenant/departments/:id` - Delete department

##### Supervisors
- `GET /api/tenant/supervisors` - List all supervisors
- `GET /api/tenant/supervisors/:id` - Get supervisor by ID
- `POST /api/tenant/supervisors` - Create new supervisor
- `PATCH /api/tenant/supervisors/:id` - Update supervisor
- `DELETE /api/tenant/supervisors/:id` - Delete supervisor

##### Other Endpoints
- Categories: `/api/tenant/categories`
- Branches: `/api/tenant/branches`
- User Roles: `/api/tenant/user-roles`
- Project Codes: `/api/tenant/project-codes`
- Settings: `/api/tenant/settings`
- Training: `/api/tenant/training`

#### 4. Setting Up Headers

For authenticated endpoints, add header:
```
Authorization: Bearer {{tenant_token}}
```

Or for Super Admin endpoints:
```
Authorization: Bearer {{superadmin_token}}
```

For tenant-specific endpoints, add header:
```
x-tenant-id: {{tenant_id}}
```

### Sample Request Examples

#### Create User
```
POST {{base_url}}/tenant/users
Authorization: Bearer {{tenant_token}}
x-tenant-id: {{tenant_id}}
Content-Type: application/json

{
  "username": "john.doe",
  "password": "SecurePass123",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "department": "Engineering",
  "isActive": true
}
```

#### Create Observation
```
POST {{base_url}}/tenant/observations
Authorization: Bearer {{tenant_token}}
x-tenant-id: {{tenant_id}}
Content-Type: application/json

{
  "projectCode": "PRJ-001",
  "nameSurname": "John Doe",
  "department": "Construction",
  "nonconformityType": "Safety Violation",
  "observationDate": "2025-01-15T10:30:00Z",
  "riskLevel": 3,
  "status": "Open",
  "deadline": "2025-02-01",
  "description_en": "Worker not wearing helmet"
}
```

#### List Users with Filters
```
GET {{base_url}}/tenant/users?role=admin&isActive=true&search=john
Authorization: Bearer {{tenant_token}}
x-tenant-id: {{tenant_id}}
```

## Testing Workflow

### 1. Initial Setup
1. Start the backend server
2. Login to get authentication token
3. Set the token in your environment

### 2. Test Authentication
```
POST /api/auth/login
{
  "login": "admin@safety.com",
  "password": "password123"
}
```

### 3. Test CRUD Operations

For each resource (users, observations, employees, etc.):
- **Create** - POST request
- **Read All** - GET request to collection endpoint
- **Read One** - GET request to /:id endpoint
- **Update** - PATCH request to /:id endpoint
- **Delete** - DELETE request to /:id endpoint

### 4. Test Filters
Many endpoints support query parameters for filtering:
- Users: `?role=admin&department=Engineering&isActive=true&search=john`
- Observations: `?projectCode=PRJ-001&department=Construction&startDate=2025-01-01`
- Employees: `?safetyRole=inspector&status=active&search=doe`
- Supervisors: `?projectId=123&department=Safety&search=supervisor`

## Authentication Notes

### Bearer Token Format
All authenticated requests require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

### Tenant Context
Most endpoints require a tenant context. Include the tenant ID in the header:
```
x-tenant-id: 90f14174-44cf-46fc-b5b1-9fe55215833f
```

### Super Admin vs Tenant Admin
- **Super Admin**: Use `superadmin_token` for `/api/super-admin/*` endpoints
- **Tenant Admin**: Use `tenant_token` for `/api/tenant/*` endpoints

## Common Status Codes

- `200 OK` - Successful GET/PATCH/DELETE request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found

## Troubleshooting

### Swagger Not Loading
- Ensure server is running: `npm run start:dev`
- Check the URL: http://localhost:3000/api/docs
- Check console for errors

### Authentication Issues
- Verify token is correct and not expired
- Check Authorization header format
- Ensure x-tenant-id header is included for tenant endpoints

### CORS Errors
- Check that frontend URL is in the CORS whitelist (backend/src/main.ts)
- Verify origin header matches allowed origins

### Validation Errors
- Check Swagger UI for required fields
- Verify data types match the schema
- Review DTOs in backend/src/*/dto/*.dto.ts for validation rules

## Additional Resources

- Swagger/OpenAPI Spec: http://localhost:3000/api/docs-json
- NestJS Documentation: https://docs.nestjs.com
- Swagger UI Guide: https://swagger.io/tools/swagger-ui/
- Insomnia Documentation: https://docs.insomnia.rest

## Quick Start Checklist

- [ ] Backend server is running on port 3000
- [ ] Swagger UI accessible at http://localhost:3000/api/docs
- [ ] Obtained authentication token from /api/auth/login
- [ ] Set up Insomnia environment variables
- [ ] Imported Swagger JSON to Insomnia (optional)
- [ ] Configured Authorization headers
- [ ] Tested basic CRUD operations
- [ ] Verified filtering and query parameters work

## Notes

- All endpoints are prefixed with `/api`
- Most endpoints require authentication via Bearer token
- Tenant-specific endpoints require `x-tenant-id` header
- Passwords are hashed with SHA-256 (should use bcrypt in production)
- The file-based storage is used for development (should use PostgreSQL in production)
