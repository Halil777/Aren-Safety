import type { ThemePreset, CustomThemeConfig } from '@/shared/types/theme';

// Base typography configuration (shared across all themes)
const baseTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyHeading: "'Inter', sans-serif",
  fontFamilyMono: "'JetBrains Mono', 'Courier New', monospace",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

const baseSpacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
};

const baseBorderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
};

const baseBreakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// LIGHT THEME PRESET
// ============================================================================
export const lightTheme: CustomThemeConfig = {
  mode: 'light',
  name: 'Light',
  colors: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryActive: '#4338ca',
    primaryLight: '#e0e7ff',
    primaryDark: '#3730a3',

    accent: '#06b6d4',
    accentHover: '#0891b2',
    accentLight: '#cffafe',

    background: '#f8fafc',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#f1f5f9',

    sidebarBackground: '#ffffff',
    sidebarBorder: 'rgba(226, 232, 240, 0.8)',
    sidebarText: '#475569',
    sidebarTextHover: '#1e293b',
    sidebarTextActive: '#6366f1',
    sidebarItemHover: 'rgba(99, 102, 241, 0.08)',
    sidebarItemActive: 'rgba(99, 102, 241, 0.12)',

    headerBackground: '#ffffff',
    headerBorder: 'rgba(226, 232, 240, 0.8)',
    headerText: '#0f172a',
    headerIconColor: '#475569',

    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    cardShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',

    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#64748b',
    textDisabled: '#cbd5e1',

    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',

    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    successLight: '#d1fae5',
    warningLight: '#fef3c7',
    errorLight: '#fee2e2',
    infoLight: '#dbeafe',

    hover: 'rgba(0, 0, 0, 0.04)',
    active: 'rgba(0, 0, 0, 0.08)',
    focus: 'rgba(99, 102, 241, 0.12)',
    disabled: 'rgba(0, 0, 0, 0.26)',

    shadowLight: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    shadowHeavy: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',

    overlay: 'rgba(0, 0, 0, 0.5)',
    modalOverlay: 'rgba(0, 0, 0, 0.75)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  breakpoints: baseBreakpoints,
};

// ============================================================================
// DARK THEME PRESET
// ============================================================================
export const darkTheme: CustomThemeConfig = {
  mode: 'dark',
  name: 'Dark',
  colors: {
    primary: '#818cf8',
    primaryHover: '#a5b4fc',
    primaryActive: '#c7d2fe',
    primaryLight: '#312e81',
    primaryDark: '#4338ca',

    accent: '#22d3ee',
    accentHover: '#67e8f9',
    accentLight: '#164e63',

    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',

    sidebarBackground: '#0a0f1e',
    sidebarBorder: 'rgba(51, 65, 85, 0.3)',
    sidebarText: '#cbd5e1',
    sidebarTextHover: '#f1f5f9',
    sidebarTextActive: '#a5b4fc',
    sidebarItemHover: 'rgba(129, 140, 248, 0.15)',
    sidebarItemActive: 'rgba(129, 140, 248, 0.25)',

    headerBackground: '#111827',
    headerBorder: 'rgba(51, 65, 85, 0.3)',
    headerText: '#f1f5f9',
    headerIconColor: '#cbd5e1',

    cardBackground: '#1e293b',
    cardBorder: '#334155',
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',

    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textDisabled: '#475569',

    border: '#334155',
    borderLight: '#475569',
    borderDark: '#1e293b',

    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',

    successLight: '#064e3b',
    warningLight: '#78350f',
    errorLight: '#7f1d1d',
    infoLight: '#1e3a8a',

    hover: 'rgba(255, 255, 255, 0.08)',
    active: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(129, 140, 248, 0.25)',
    disabled: 'rgba(255, 255, 255, 0.12)',

    shadowLight: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    shadowMedium: '0 8px 16px -2px rgba(0, 0, 0, 0.4)',
    shadowHeavy: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',

    overlay: 'rgba(0, 0, 0, 0.7)',
    modalOverlay: 'rgba(0, 0, 0, 0.85)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  breakpoints: baseBreakpoints,
};

// ============================================================================
// PROFESSIONAL THEME (Blue & Gray)
// ============================================================================
export const professionalTheme: CustomThemeConfig = {
  mode: 'custom',
  name: 'Professional',
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryActive: '#1e40af',
    primaryLight: '#dbeafe',
    primaryDark: '#1e3a8a',

    accent: '#0891b2',
    accentHover: '#0e7490',
    accentLight: '#cffafe',

    background: '#f9fafb',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#f3f4f6',

    sidebarBackground: '#1f2937',
    sidebarBorder: 'rgba(55, 65, 81, 0.5)',
    sidebarText: '#d1d5db',
    sidebarTextHover: '#f9fafb',
    sidebarTextActive: '#60a5fa',
    sidebarItemHover: 'rgba(96, 165, 250, 0.15)',
    sidebarItemActive: 'rgba(96, 165, 250, 0.25)',

    headerBackground: '#ffffff',
    headerBorder: '#e5e7eb',
    headerText: '#111827',
    headerIconColor: '#6b7280',

    cardBackground: '#ffffff',
    cardBorder: '#e5e7eb',
    cardShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',

    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textTertiary: '#6b7280',
    textDisabled: '#9ca3af',

    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',

    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',

    successLight: '#d1fae5',
    warningLight: '#fef3c7',
    errorLight: '#fee2e2',
    infoLight: '#dbeafe',

    hover: 'rgba(0, 0, 0, 0.04)',
    active: 'rgba(0, 0, 0, 0.08)',
    focus: 'rgba(37, 99, 235, 0.12)',
    disabled: 'rgba(0, 0, 0, 0.26)',

    shadowLight: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    shadowHeavy: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',

    overlay: 'rgba(0, 0, 0, 0.5)',
    modalOverlay: 'rgba(0, 0, 0, 0.75)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  breakpoints: baseBreakpoints,
};

// ============================================================================
// MODERN THEME (Purple & Teal)
// ============================================================================
export const modernTheme: CustomThemeConfig = {
  mode: 'custom',
  name: 'Modern',
  colors: {
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    primaryActive: '#5b21b6',
    primaryLight: '#ede9fe',
    primaryDark: '#4c1d95',

    accent: '#14b8a6',
    accentHover: '#0d9488',
    accentLight: '#ccfbf1',

    background: '#fafafa',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#f5f5f5',

    sidebarBackground: 'linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)',
    sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    sidebarText: '#e9d5ff',
    sidebarTextHover: '#ffffff',
    sidebarTextActive: '#ffffff',
    sidebarItemHover: 'rgba(255, 255, 255, 0.15)',
    sidebarItemActive: 'rgba(255, 255, 255, 0.25)',

    headerBackground: '#ffffff',
    headerBorder: '#e5e5e5',
    headerText: '#171717',
    headerIconColor: '#737373',

    cardBackground: '#ffffff',
    cardBorder: '#e5e5e5',
    cardShadow: '0 2px 8px 0 rgba(124, 58, 237, 0.08)',

    textPrimary: '#171717',
    textSecondary: '#525252',
    textTertiary: '#737373',
    textDisabled: '#a3a3a3',

    border: '#e5e5e5',
    borderLight: '#f5f5f5',
    borderDark: '#d4d4d4',

    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#7c3aed',

    successLight: '#d1fae5',
    warningLight: '#fef3c7',
    errorLight: '#fee2e2',
    infoLight: '#ede9fe',

    hover: 'rgba(124, 58, 237, 0.04)',
    active: 'rgba(124, 58, 237, 0.08)',
    focus: 'rgba(124, 58, 237, 0.12)',
    disabled: 'rgba(0, 0, 0, 0.26)',

    shadowLight: '0 1px 3px 0 rgba(124, 58, 237, 0.05)',
    shadowMedium: '0 4px 6px -1px rgba(124, 58, 237, 0.1)',
    shadowHeavy: '0 10px 15px -3px rgba(124, 58, 237, 0.15)',

    overlay: 'rgba(0, 0, 0, 0.5)',
    modalOverlay: 'rgba(0, 0, 0, 0.75)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  breakpoints: baseBreakpoints,
};

// ============================================================================
// OCEAN THEME (Blue & Cyan)
// ============================================================================
export const oceanTheme: CustomThemeConfig = {
  mode: 'custom',
  name: 'Ocean',
  colors: {
    primary: '#0ea5e9',
    primaryHover: '#0284c7',
    primaryActive: '#0369a1',
    primaryLight: '#e0f2fe',
    primaryDark: '#075985',

    accent: '#06b6d4',
    accentHover: '#0891b2',
    accentLight: '#cffafe',

    background: '#f0f9ff',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#e0f2fe',

    sidebarBackground: 'linear-gradient(180deg, #0c4a6e 0%, #075985 100%)',
    sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    sidebarText: '#bae6fd',
    sidebarTextHover: '#ffffff',
    sidebarTextActive: '#ffffff',
    sidebarItemHover: 'rgba(255, 255, 255, 0.15)',
    sidebarItemActive: 'rgba(255, 255, 255, 0.25)',

    headerBackground: '#ffffff',
    headerBorder: '#bae6fd',
    headerText: '#0c4a6e',
    headerIconColor: '#0369a1',

    cardBackground: '#ffffff',
    cardBorder: '#bae6fd',
    cardShadow: '0 2px 8px 0 rgba(14, 165, 233, 0.08)',

    textPrimary: '#0c4a6e',
    textSecondary: '#075985',
    textTertiary: '#0369a1',
    textDisabled: '#7dd3fc',

    border: '#bae6fd',
    borderLight: '#e0f2fe',
    borderDark: '#7dd3fc',

    success: '#14b8a6',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',

    successLight: '#ccfbf1',
    warningLight: '#fef3c7',
    errorLight: '#fee2e2',
    infoLight: '#e0f2fe',

    hover: 'rgba(14, 165, 233, 0.04)',
    active: 'rgba(14, 165, 233, 0.08)',
    focus: 'rgba(14, 165, 233, 0.12)',
    disabled: 'rgba(14, 165, 233, 0.26)',

    shadowLight: '0 1px 3px 0 rgba(14, 165, 233, 0.1)',
    shadowMedium: '0 4px 6px -1px rgba(14, 165, 233, 0.15)',
    shadowHeavy: '0 10px 15px -3px rgba(14, 165, 233, 0.2)',

    overlay: 'rgba(12, 74, 110, 0.5)',
    modalOverlay: 'rgba(12, 74, 110, 0.75)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  breakpoints: baseBreakpoints,
};

// ============================================================================
// FOREST THEME (Green & Earth Tones)
// ============================================================================
export const forestTheme: CustomThemeConfig = {
  mode: 'custom',
  name: 'Forest',
  colors: {
    primary: '#059669',
    primaryHover: '#047857',
    primaryActive: '#065f46',
    primaryLight: '#d1fae5',
    primaryDark: '#064e3b',

    accent: '#84cc16',
    accentHover: '#65a30d',
    accentLight: '#ecfccb',

    background: '#f7fee7',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#ecfccb',

    sidebarBackground: 'linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
    sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    sidebarText: '#a7f3d0',
    sidebarTextHover: '#ffffff',
    sidebarTextActive: '#ffffff',
    sidebarItemHover: 'rgba(255, 255, 255, 0.15)',
    sidebarItemActive: 'rgba(255, 255, 255, 0.25)',

    headerBackground: '#ffffff',
    headerBorder: '#bbf7d0',
    headerText: '#064e3b',
    headerIconColor: '#059669',

    cardBackground: '#ffffff',
    cardBorder: '#bbf7d0',
    cardShadow: '0 2px 8px 0 rgba(5, 150, 105, 0.08)',

    textPrimary: '#064e3b',
    textSecondary: '#065f46',
    textTertiary: '#047857',
    textDisabled: '#6ee7b7',

    border: '#bbf7d0',
    borderLight: '#d1fae5',
    borderDark: '#6ee7b7',

    success: '#059669',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    successLight: '#d1fae5',
    warningLight: '#fef3c7',
    errorLight: '#fee2e2',
    infoLight: '#dbeafe',

    hover: 'rgba(5, 150, 105, 0.04)',
    active: 'rgba(5, 150, 105, 0.08)',
    focus: 'rgba(5, 150, 105, 0.12)',
    disabled: 'rgba(5, 150, 105, 0.26)',

    shadowLight: '0 1px 3px 0 rgba(5, 150, 105, 0.1)',
    shadowMedium: '0 4px 6px -1px rgba(5, 150, 105, 0.15)',
    shadowHeavy: '0 10px 15px -3px rgba(5, 150, 105, 0.2)',

    overlay: 'rgba(6, 78, 59, 0.5)',
    modalOverlay: 'rgba(6, 78, 59, 0.75)',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  breakpoints: baseBreakpoints,
};

// ============================================================================
// THEME PRESETS ARRAY
// ============================================================================
export const themePresets: ThemePreset[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright theme perfect for daytime use',
    preview: '/themes/light-preview.png',
    config: lightTheme,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes, perfect for low-light environments',
    preview: '/themes/dark-preview.png',
    config: darkTheme,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate blue and gray theme for business environments',
    preview: '/themes/professional-preview.png',
    config: professionalTheme,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Vibrant purple and teal for a contemporary look',
    preview: '/themes/modern-preview.png',
    config: modernTheme,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calming blue tones inspired by the sea',
    preview: '/themes/ocean-preview.png',
    config: oceanTheme,
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green tones for a fresh, organic feel',
    preview: '/themes/forest-preview.png',
    config: forestTheme,
  },
];

export const getThemeById = (id: string): ThemePreset | undefined => {
  return themePresets.find((preset) => preset.id === id);
};

export const getThemeByMode = (mode: string): CustomThemeConfig => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'light':
    default:
      return lightTheme;
  }
};
