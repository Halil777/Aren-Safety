import { Navigate, createBrowserRouter } from 'react-router-dom'
import { APP_ROUTES } from '@/shared/config/routes'
import { RootLayout } from '@/app/layout/RootLayout'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { TenantsListPage } from '@/features/tenants/pages/TenantsListPage'
import { MessagesPage } from '@/features/messages/pages/MessagesPage'

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={APP_ROUTES.DASHBOARD} replace />,
      },
      {
        path: APP_ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: APP_ROUTES.TENANTS.LIST,
        element: <TenantsListPage />,
      },
      {
        path: APP_ROUTES.MESSAGES.LIST,
        element: <MessagesPage />,
      },
      {
        path: '*',
        element: <Navigate to={APP_ROUTES.DASHBOARD} replace />,
      },
    ],
  },
])
