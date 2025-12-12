import { Navigate, createBrowserRouter } from 'react-router-dom'
import { ProtectedLayout } from '@/app/layout/protected-layout'
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'
import { CategoriesPage } from '@/features/categories/pages/categories-page'
import { ObservationsPage } from '@/features/observations/pages/observations-page'
import { ProjectsListPage } from '@/features/projects/pages/projects-list-page'
import { TasksPage } from '@/features/tasks/pages/tasks-page'
import { DepartmentsPage } from '@/features/departments/pages/departments-page'
import { CompaniesPage } from '@/features/companies/pages/companies-page'
import { SubcategoriesPage } from '@/features/subcategories/pages/subcategories-page'
import { TypesPage } from '@/features/types/pages/types-page'
import { SupervisorsPage } from '@/features/supervisors/pages/supervisors-page'
import { UsersListPage } from '@/features/users/pages/users-list-page'
import { LoginPage } from '@/features/auth/pages/login-page'
import { SupportPage } from '@/features/support/pages/support-page'
import { SubscriptionPage } from '@/features/subscription/pages/subscription-page'

export const appRouter = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/support',
    element: <SupportPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersListPage />,
      },
      {
        path: 'observations',
        element: <ObservationsPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'supervisors',
        element: <SupervisorsPage />,
      },
      {
        path: 'projects',
        element: <ProjectsListPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'departments',
        element: <DepartmentsPage />,
      },
      {
        path: 'companies',
        element: <CompaniesPage />,
      },
      {
        path: 'subcategories',
        element: <SubcategoriesPage />,
      },
      {
        path: 'types',
        element: <TypesPage />,
      },
      {
        path: 'subscription',
        element: <SubscriptionPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
