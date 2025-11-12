/**
 * Advanced Theme Configuration Types
 * Comprehensive theme system for tenant customization
 */

export type ThemeMode = 'light' | 'dark' | 'custom';

export interface ThemeColors {
  // Primary Colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryLight: string;
  primaryDark: string;

  // Accent Colors
  accent: string;
  accentHover: string;
  accentLight: string;

  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Sidebar
  sidebarBackground: string;
  sidebarBorder: string;
  sidebarText: string;
  sidebarTextHover: string;
  sidebarTextActive: string;
  sidebarItemHover: string;
  sidebarItemActive: string;

  // Header
  headerBackground: string;
  headerBorder: string;
  headerText: string;
  headerIconColor: string;

  // Card
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;

  // Border
  border: string;
  borderLight: string;
  borderDark: string;

  // Status Colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Semantic Colors
  successLight: string;
  warningLight: string;
  errorLight: string;
  infoLight: string;

  // Interactive
  hover: string;
  active: string;
  focus: string;
  disabled: string;

  // Shadows
  shadowLight: string;
  shadowMedium: string;
  shadowHeavy: string;

  // Overlay
  overlay: string;
  modalOverlay: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyHeading: string;
  fontFamilyMono: string;

  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };

  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };

  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };

  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ThemeBreakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface CustomThemeConfig {
  mode: ThemeMode;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  breakpoints: ThemeBreakpoints;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: string; // Preview image URL
  config: CustomThemeConfig;
}

export interface TenantThemeSettings {
  selectedTheme: ThemeMode;
  customTheme?: CustomThemeConfig;
  enableDarkMode: boolean;
  allowUserThemeToggle: boolean;
}
