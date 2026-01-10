import { Navigate, createBrowserRouter } from "react-router-dom";
import { ProtectedLayout } from "@/app/layout/protected-layout";
import { CategoriesPage } from "@/features/categories/pages/categories-page";
import { ObservationsPage } from "@/features/observations/pages/observations-page";
import { ProjectsListPage } from "@/features/projects/pages/projects-list-page";
import { TasksPage } from "@/features/tasks/pages/tasks-page";
import { DepartmentsPage } from "@/features/departments/pages/departments-page";
import { CompaniesPage } from "@/features/companies/pages/companies-page";
import { SubcategoriesPage } from "@/features/subcategories/pages/subcategories-page";
import { LocationsPage } from "@/features/locations/pages/locations-page";
import { SupervisorsPage } from "@/features/supervisors/pages/supervisors-page";
import { LoginPage } from "@/features/auth/pages/login-page";
import { SupportPage } from "@/features/support/pages/support-page";
import { SubscriptionPage } from "@/features/subscription/pages/subscription-page";
import { DashboardPageV2 } from "@/features/dashboard/pages/dashboard-page";

export const appRouter = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/support",
    element: <SupportPage />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <DashboardPageV2 />,
      },
      {
        path: "users",
        element: <Navigate to="/supervisors" replace />,
      },
      {
        path: "observations",
        element: <ObservationsPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "supervisors",
        element: <SupervisorsPage />,
      },
      {
        path: "projects",
        element: <ProjectsListPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "departments",
        element: <DepartmentsPage />,
      },
      {
        path: "companies",
        element: <CompaniesPage />,
      },
      {
        path: "locations",
        element: <LocationsPage />,
      },
      {
        path: "subcategories",
        element: <SubcategoriesPage />,
      },

      {
        path: "subscription",
        element: <SubscriptionPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
