const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  // "https://api.arensafety.com/api";
  "https://api.arensafety.com/api";

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    LOGIN: "/auth/login",
    OBSERVATIONS: "/tenant/observations",
    CATEGORIES: "/tenant/categories",
    BRANCHES: "/tenant/branches",
    EMPLOYEES: "/tenant/employees",
    USERS: "/tenant/users",
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
};

if (__DEV__) {
  console.log("API base URL:", BASE_URL);
}
