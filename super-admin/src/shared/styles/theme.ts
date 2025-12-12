import { type DefaultTheme } from 'styled-components'

const baseSpacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
}

const baseRadii = {
  sm: '6px',
  md: '10px',
  lg: '16px',
}

const baseShadow = {
  sm: '0 4px 12px rgba(15, 23, 42, 0.06)',
  md: '0 10px 30px rgba(15, 23, 42, 0.12)',
  lg: '0 18px 60px rgba(15, 23, 42, 0.16)',
}

const font = {
  family:
    '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

export const lightTheme: DefaultTheme = {
  mode: 'light',
  colors: {
    background: '#f6f7fb',
    surface: '#eef1f8',
    card: '#ffffff',
    border: '#e5e7eb',
    text: '#0f172a',
    muted: '#6b7280',
    primary: '#111827',
    primaryContrast: '#ffffff',
    secondary: '#f3f4f6',
    secondaryContrast: '#111827',
    accent: '#eef2ff',
    accentContrast: '#111827',
    destructive: '#ef4444',
    destructiveContrast: '#ffffff',
    success: '#22c55e',
    warning: '#f59e0b',
    overlay: 'rgba(0, 0, 0, 0.55)',
  },
  radii: baseRadii,
  shadow: baseShadow,
  spacing: baseSpacing,
  font,
}

export const darkTheme: DefaultTheme = {
  mode: 'dark',
  colors: {
    background: '#0b1221',
    surface: '#0f172a',
    card: '#111827',
    border: '#1f2937',
    text: '#e5e7eb',
    muted: '#9ca3af',
    primary: '#e5e7eb',
    primaryContrast: '#0b1221',
    secondary: '#1f2937',
    secondaryContrast: '#e5e7eb',
    accent: '#1f2937',
    accentContrast: '#e5e7eb',
    destructive: '#f87171',
    destructiveContrast: '#0b1221',
    success: '#4ade80',
    warning: '#fbbf24',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  radii: baseRadii,
  shadow: baseShadow,
  spacing: baseSpacing,
  font,
}
