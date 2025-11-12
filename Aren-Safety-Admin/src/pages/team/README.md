# Team Page - Clean Architecture

This module implements the Team Management page with a clean, professional architecture following best practices.

## 📁 Directory Structure

```
team/
├── components/              # React components
│   ├── index.ts            # Component exports
│   ├── ExportButtons.tsx   # Reusable export buttons
│   ├── EmployeesTab.tsx    # Employees tab with filters & table
│   ├── SafetyTeamTab.tsx   # Safety team tab wrapper
│   └── InspectorsTab.tsx   # Inspectors tab wrapper
├── hooks/                   # Custom React hooks
│   └── useEmployeesData.ts # Employee data management hook
├── types/                   # TypeScript type definitions
│   └── index.ts            # Type exports
├── utils/                   # Utility functions
│   ├── exportHandlers.ts   # Export functionality (Excel, PDF, Print)
│   └── tableColumns.tsx    # Table column definitions & filters
├── index.tsx               # Main page component (94 lines)
└── README.md               # This file
```

## 🎯 Key Features

### 1. **Separation of Concerns**
- Components are split by responsibility
- Business logic in hooks
- Utilities are reusable and testable
- Types are centralized

### 2. **Main Page (index.tsx - 94 lines)**
- Clean orchestration of tabs
- Minimal logic - delegates to child components
- Easy to understand and maintain

### 3. **Components**
- **ExportButtons**: Reusable across all tabs (33 lines)
- **EmployeesTab**: Full employee management (200 lines)
- **SafetyTeamTab**: Wrapper for existing component (6 lines)
- **InspectorsTab**: Wrapper for existing component (6 lines)

### 4. **Hooks**
- **useEmployeesData**: Manages filtering, statistics, and data (62 lines)

### 5. **Utils**
- **exportHandlers**: Excel/PDF/Print export logic (125 lines)
- **tableColumns**: Column definitions with filters (200 lines)

## 🔄 Data Flow

```
Main Page (index.tsx)
    ↓
EmployeesTab Component
    ↓
useEmployeesData Hook → Filters & Stats
    ↓
tableColumns Util → Column Definitions
    ↓
Table Component → Renders Data
```

## 📊 Export Functionality

All three tabs support:
- **Excel Export**: `.xlsx` format with filtered data
- **PDF Export**: Opens in new window
- **Print**: Print-friendly view

Export handlers are centralized in `utils/exportHandlers.ts`

## 🎨 Features Implemented

### Employees Tab
- ✅ Statistics cards (Total, Active, On Leave, Training Expired)
- ✅ Global filters (Search, Status, Department, Location)
- ✅ Column header filters (Search & Select)
- ✅ Sortable columns (Training, Certifications, Incidents)
- ✅ Employee details modal
- ✅ Export to Excel/PDF/Print

### Safety Team Tab
- ✅ Grid view with staff cards
- ✅ Summary statistics
- ✅ Export to Excel/PDF/Print

### Inspectors Tab
- ✅ Table view with inspector details
- ✅ Add inspector functionality
- ✅ Export to Excel/PDF/Print

## 🧩 Component Usage

```tsx
import TeamPage from '@/pages/team';

// Use in routing
<Route path="team" element={<TeamPage />} />
```

## 🔧 Extending the Module

### Adding a New Filter
1. Update `EmployeeFilters` type in `types/index.ts`
2. Add filter state in `EmployeesTab.tsx`
3. Update `useEmployeesData` hook to handle new filter

### Adding a New Export Type
1. Add export type to `ExportType` in `types/index.ts`
2. Update `ExportButtons.tsx` to add button
3. Add handler in `utils/exportHandlers.ts`

### Adding a New Tab
1. Create new tab component in `components/`
2. Add export to `components/index.ts`
3. Import and add to `index.tsx`
4. Add export handler if needed

## 📝 Type Safety

All components are fully typed with TypeScript:
- Employee interface from `@/shared/config/mock-employees`
- SafetyStaffMember and Inspector from `@/features/employees/types`
- Local types in `types/index.ts`

## ✨ Benefits of This Architecture

1. **Maintainability**: Each file has a single responsibility
2. **Testability**: Utils and hooks can be unit tested
3. **Reusability**: Components and utils can be imported elsewhere
4. **Readability**: Small, focused files (vs 800+ lines)
5. **Scalability**: Easy to add features without bloating files
6. **Type Safety**: Full TypeScript coverage
7. **Performance**: Hooks optimize re-renders with useMemo

## 🚀 Performance Optimizations

- `useMemo` for filtered data
- `useMemo` for statistics calculations
- `useMemo` for dropdown options
- Column filters use Ant Design's built-in optimization
