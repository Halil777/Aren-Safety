const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  // "http//10.10.20.77:4000/api";
  "http//10.10.20.77:4000/api";

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
