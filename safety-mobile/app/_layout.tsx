import { Stack } from "expo-router";
import { ThemeProvider } from "../contexts/theme";
import { AuthProvider } from "../contexts/auth";
import { LanguageProvider } from "../contexts/language";
import { QueryProvider } from "../query/QueryProvider";
import { OfflineProvider } from "../offline/OfflineProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <OfflineProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="(app)" />
              </Stack>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </OfflineProvider>
    </QueryProvider>
  );
}
