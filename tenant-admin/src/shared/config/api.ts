export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
} as const

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  TENANTS: {
    LIST: '/tenants',
    DETAILS: (id: string) => `/tenants/${id}`,
  },
  MESSAGES: {
    CREATE: '/messages',
  },
  PROJECTS: {
    LIST: '/projects',
  },
  CATEGORIES: {
    OBSERVATION: {
      LIST: '/observation-categories',
      DETAIL: (id: string) => `/observation-categories/${id}`,
    },
    TASK: {
      LIST: '/task-categories',
      DETAIL: (id: string) => `/task-categories/${id}`,
    },
  },
  SUBCATEGORIES: {
    OBSERVATION: {
      LIST: '/observation-subcategories',
      DETAIL: (id: string) => `/observation-subcategories/${id}`,
    },
    TASK: {
      LIST: '/task-subcategories',
      DETAIL: (id: string) => `/task-subcategories/${id}`,
    },
  },
  DEPARTMENTS: {
    LIST: '/departments',
    DETAIL: (id: string) => `/departments/${id}`,
  },
  TASKS: {
    LIST: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
  },
  COMPANIES: {
    LIST: '/companies',
    DETAIL: (id: string) => `/companies/${id}`,
  },
  MOBILE_USERS: {
    LIST: '/mobile-users',
    DETAIL: (id: string) => `/mobile-users/${id}`,
  },
  SUPERVISORS: {
    LIST: '/supervisors',
    DETAIL: (id: string) => `/supervisors/${id}`,
  },
  OBSERVATIONS: {
    LIST: '/observations',
    DETAIL: (id: string) => `/observations/${id}`,
  },
  TYPES: {
    LIST: '/types',
    DETAIL: (id: string) => `/types/${id}`,
  },
} as const
