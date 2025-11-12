import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomThemeConfig, ThemeMode } from '@/shared/types/theme';
import { lightTheme, darkTheme, getThemeById } from '@/shared/config/themePresets';

interface ThemeState {
  mode: ThemeMode;
  customTheme: CustomThemeConfig | null;
  activeTheme: CustomThemeConfig;

  // Actions
  setMode: (mode: ThemeMode) => void;
  setCustomTheme: (theme: CustomThemeConfig) => void;
  applyPreset: (presetId: string) => void;
  toggleDarkMode: () => void;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      customTheme: null,
      activeTheme: lightTheme,

      setMode: (mode) => {
        set({ mode });

        // Apply corresponding theme
        if (mode === 'light') {
          set({ activeTheme: lightTheme });
        } else if (mode === 'dark') {
          set({ activeTheme: darkTheme });
        } else if (mode === 'custom' && get().customTheme) {
          set({ activeTheme: get().customTheme! });
        }
      },

      setCustomTheme: (theme) => {
        set({
          customTheme: theme,
          activeTheme: theme,
          mode: 'custom'
        });
      },

      applyPreset: (presetId) => {
        const preset = getThemeById(presetId);
        if (preset) {
          set({
            activeTheme: preset.config,
            mode: preset.config.mode,
            customTheme: preset.config.mode === 'custom' ? preset.config : null,
          });
        }
      },

      toggleDarkMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        get().setMode(newMode);
      },

      resetTheme: () => {
        set({
          mode: 'light',
          customTheme: null,
          activeTheme: lightTheme,
        });
      },
    }),
    {
      name: 'tenant-theme-storage', // localStorage key
      partialize: (state) => ({
        mode: state.mode,
        customTheme: state.customTheme,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration from localStorage, ensure activeTheme is set correctly
        if (state) {
          if (state.mode === 'custom' && state.customTheme) {
            state.activeTheme = state.customTheme;
          } else if (state.mode === 'dark') {
            state.activeTheme = darkTheme;
          } else {
            state.activeTheme = lightTheme;
          }
        }
      },
    }
  )
);

// Selectors for easier access
export const selectActiveTheme = (state: ThemeState) => state.activeTheme;
export const selectThemeMode = (state: ThemeState) => state.mode;
export const selectCustomTheme = (state: ThemeState) => state.customTheme;
