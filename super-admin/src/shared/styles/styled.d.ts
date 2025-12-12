import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark'
    colors: {
      background: string
      surface: string
      card: string
      border: string
      text: string
      muted: string
      primary: string
      primaryContrast: string
      secondary: string
      secondaryContrast: string
      accent: string
      accentContrast: string
      destructive: string
      destructiveContrast: string
      success: string
      warning: string
      overlay: string
    }
    radii: {
      sm: string
      md: string
      lg: string
    }
    shadow: {
      sm: string
      md: string
      lg: string
    }
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
    font: {
      family: string
    }
  }
}
