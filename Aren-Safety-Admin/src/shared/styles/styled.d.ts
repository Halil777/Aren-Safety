import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark';
    colors: {
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
    };
  }
}
