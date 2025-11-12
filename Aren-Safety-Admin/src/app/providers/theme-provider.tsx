import { createContext, useContext, useState, type ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  light: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    background: string;
    backgroundElevated: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    divider: string;
    error: string;
    errorLight: string;
    warning: string;
    warningLight: string;
    success: string;
    successLight: string;
    info: string;
    infoLight: string;
    shadow: string;
    shadowMedium: string;
    shadowLarge: string;
  };
  dark: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    background: string;
    backgroundElevated: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    divider: string;
    error: string;
    errorLight: string;
    warning: string;
    warningLight: string;
    success: string;
    successLight: string;
    info: string;
    infoLight: string;
    shadow: string;
    shadowMedium: string;
    shadowLarge: string;
  };
}

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: ThemeColors;
  mode: ThemeMode;
}

const themeColors: ThemeColors = {
  light: {
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primaryLight: '#eef2ff',
    secondary: '#6366f1',
    secondaryHover: '#4f46e5',
    accent: '#8b5cf6',
    background: '#fafbfc',
    backgroundElevated: '#ffffff',
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    divider: '#e2e8f0',
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    success: '#10b981',
    successLight: '#d1fae5',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    shadow: 'rgba(15, 23, 42, 0.04)',
    shadowMedium: 'rgba(15, 23, 42, 0.08)',
    shadowLarge: 'rgba(15, 23, 42, 0.12)',
  },
  dark: {
    primary: '#6366f1',
    primaryHover: '#818cf8',
    primaryLight: '#312e81',
    secondary: '#8b5cf6',
    secondaryHover: '#a78bfa',
    accent: '#a855f7',
    background: '#0a0f1e',
    backgroundElevated: '#1e293b',
    surface: '#1e293b',
    surfaceHover: '#334155',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    border: '#334155',
    borderLight: '#1e293b',
    divider: '#334155',
    error: '#f87171',
    errorLight: '#7f1d1d',
    warning: '#fbbf24',
    warningLight: '#78350f',
    success: '#34d399',
    successLight: '#064e3b',
    info: '#60a5fa',
    infoLight: '#1e3a8a',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowMedium: 'rgba(0, 0, 0, 0.5)',
    shadowLarge: 'rgba(0, 0, 0, 0.7)',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const antdAlgorithm = theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  const styledTheme = {
    mode: theme,
    colors: themeColors,
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors, mode: theme }}>
      <StyledThemeProvider theme={styledTheme}>
        <ConfigProvider
          theme={{
            algorithm: antdAlgorithm,
          }}
        >
          {children}
        </ConfigProvider>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
