import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

type ThemeState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

const STORAGE_KEY = "tenant-admin-theme";
const isBrowser = typeof window !== "undefined";

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "light" || value === "dark" || value === "system";

export const getStoredTheme = (): ThemeMode | null => {
  if (!isBrowser) return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return isThemeMode(stored) ? stored : null;
};

export const persistTheme = (theme: ThemeMode) => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEY, theme);
};

export const getSystemTheme = (): Exclude<ThemeMode, "system"> => {
  if (!isBrowser) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const resolveTheme = (theme: ThemeMode): Exclude<ThemeMode, "system"> =>
  theme === "system" ? getSystemTheme() : theme;

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));
