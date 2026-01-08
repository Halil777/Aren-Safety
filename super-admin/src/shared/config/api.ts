export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://10.10.20.77:4000/api',
  TIMEOUT: 30000,
} as const

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  TENANTS: {
    LIST: '/tenants',
    DETAILS: (id: string) => `/tenants/${id}`,
    CREATE: '/tenants',
    UPDATE: (id: string) => `/tenants/${id}`,
    DELETE: (id: string) => `/tenants/${id}`,
    STATISTICS: '/tenants/statistics',
  },
  MESSAGES: {
    LIST: '/messages',
    UNREAD: '/messages/unread-count',
    MARK_READ: '/messages/mark-read',
  },
  USERS: {
    LIST: '/users',
    DETAILS: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  INCIDENTS: {
    LIST: '/incidents',
    DETAILS: (id: string) => `/incidents/${id}`,
    CREATE: '/incidents',
    UPDATE: (id: string) => `/incidents/${id}`,
    DELETE: (id: string) => `/incidents/${id}`,
  },
} as const
