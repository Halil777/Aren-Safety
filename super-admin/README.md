# Super Admin Dashboard

A modern, professional Super Admin application built with React, TypeScript, and a clean feature-first architecture.

## Tech Stack

### Core

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)

### Styling & UI

- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui principles
- **Icons**: lucide-react

### Routing & Navigation

- **Router**: React Router v7

### State & Data Management

- **Global UI State**: Zustand
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Validation**: Zod

### Tables & Data

- **Data Tables**: TanStack Table
- **Charts**: Recharts

### Animations

- **Animations**: Framer Motion

### Code Quality

- **Linting**: ESLint
- **Formatting**: Prettier

## Architecture

This project follows a **feature-first architecture** with strict separation of concerns:

```
src/
├── app/
│   ├── router/          # Route configuration
│   ├── providers/       # App-level providers (TanStack Query, etc.)
│   └── layout/          # Root layout components
│
├── features/
│   ├── auth/
│   │   ├── pages/       # Login, etc.
│   │   ├── components/  # Auth-specific UI
│   │   ├── api/         # Auth API calls & TanStack Query hooks
│   │   ├── store/       # Auth Zustand store
│   │   └── types/       # Auth TypeScript types
│   │
│   ├── tenants/
│   │   ├── pages/       # TenantsListPage, TenantDetailsPage, etc.
│   │   ├── components/  # TenantsTable, TenantsFilters, TenantForm
│   │   ├── api/         # Tenant API functions & hooks
│   │   ├── store/       # Tenant-specific UI state
│   │   └── types/       # Tenant types
│   │
│   ├── users/           # Same structure as tenants
│   └── incidents/       # Same structure as tenants
│
└── shared/
    ├── ui/              # Reusable UI components (Button, Card, etc.)
    ├── hooks/           # Shared hooks
    ├── lib/             # Utilities (cn, formatDate, api-client)
    ├── store/           # Global Zustand stores
    ├── config/          # App configuration (API routes, app routes)
    ├── constants/       # Constants and enums
    └── types/           # Shared TypeScript types
```

## Key Principles

### 1. Feature Isolation

Each feature (tenants, users, incidents) is self-contained with its own:

- Pages (route-level containers)
- Components (UI building blocks)
- API layer (data fetching with TanStack Query)
- Store (Zustand for UI state)
- Types (TypeScript interfaces)

### 2. Separation of Concerns

- **Pages**: Compose layout, connect routes, pass props
- **Components**: Pure UI, receive data via props
- **API Layer**: All backend communication via TanStack Query
- **Store**: UI state only (no API calls in stores)
- **Shared**: Generic, reusable across all features

### 3. Consistent Patterns

- List pages follow the same structure: Header + Filters + Table
- Forms use React Hook Form + Zod validation
- All API calls use TanStack Query for caching and state management
- Styling uses Tailwind utility classes

### 4. No Over-Engineering

- Components do one thing well
- No premature abstractions
- No backwards-compatibility hacks
- Delete unused code completely

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your API URL
# VITE_API_BASE_URL=http://10.10.20.77:4000/api
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure Details

### App Layer (`src/app/`)

- **router**: React Router configuration
- **providers**: QueryProvider for TanStack Query, future providers
- **layout**: RootLayout with sidebar and main content area

### Features Layer (`src/features/`)

Each feature follows this structure:

- **pages/**: Route-level components (e.g., TenantsListPage)
- **components/**: Feature-specific UI (e.g., TenantsTable)
- **api/**: API functions and TanStack Query hooks
- **store/**: Zustand stores for feature-specific UI state
- **types/**: TypeScript interfaces for the feature

### Shared Layer (`src/shared/`)

- **ui/**: Generic components (Button, Card, PageHeader)
- **lib/**: Utilities (cn, formatDate, api-client)
- **config/**: API routes, app routes
- **types/**: Shared TypeScript interfaces
- **store/**: Global Zustand stores (auth, UI preferences)

## Code Style

### TypeScript

- Strict mode enabled
- No `any` types
- Type-only imports using `import type`
- Shared types defined once and reused

### Components

- Functional components with hooks
- Props typed with interfaces
- Use `forwardRef` for component references
- One component per file

### Styling

- Tailwind utility classes only
- Use `cn()` helper for conditional classes
- Follow shadcn/ui patterns
- Custom colors via CSS variables

### Naming Conventions

- Pages: `<Feature>ListPage`, `<Feature>DetailsPage`
- Components: `<Feature>Table`, `<Feature>Form`
- Hooks: `use<Something>`
- Stores: `use<Something>Store`
- Types: PascalCase interfaces

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://10.10.20.77:4000/api
```

## Contributing

1. Follow the established folder structure
2. Keep features isolated
3. Use TypeScript strictly
4. Write clean, simple code
5. Use Prettier and ESLint
6. No over-engineering

## License

MIT
