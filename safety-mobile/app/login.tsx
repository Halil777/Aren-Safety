import { useState, type ReactNode } from "react";
import { Text, View, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/auth";
import { useTheme } from "../contexts/theme";
import { Screen } from "../components/layout/Screen";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../contexts/language";
import { SnowBackground } from "@/components/SnowBackground";

type Language = "tr" | "ru" | "en";

const translations: Record<
  Language,
  {
    title: string;
    loginPlaceholder: string;
    passwordPlaceholder: string;
    button: string;
    languageLabel: string;
    languagePlaceholder: string;
    themeLabel: string;
  }
> = {
  en: {
    title: "Login",
    loginPlaceholder: "Enter username",
    passwordPlaceholder: "Enter password",
    button: "Sign In",
    languageLabel: "Language",
    languagePlaceholder: "Select language",
    themeLabel: "Theme",
  },
  tr: {
    title: "Giri\u015f yap",
    loginPlaceholder: "Kullan\u0131c\u0131 ad\u0131",
    passwordPlaceholder: "\u015eifre",
    button: "Giri\u015f",
    languageLabel: "Dil",
    languagePlaceholder: "Dil se\u00e7in",
    themeLabel: "Tema",
  },
  ru: {
    title:
      "\u0412\u0445\u043e\u0434 \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0443",
    loginPlaceholder:
      "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043b\u043e\u0433\u0438\u043d",
    passwordPlaceholder:
      "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c",
    button: "\u0412\u043e\u0439\u0442\u0438",
    languageLabel: "\u042f\u0437\u044b\u043a",
    languagePlaceholder:
      "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044f\u0437\u044b\u043a",
    themeLabel: "\u0422\u0435\u043c\u0430",
  },
};

export default function LoginScreen() {
  const { colors, mode, setMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = translations[language];

  const primaryColor = mode === "dark" ? "#4E8DFF" : colors.primary;
  const panelColor = mode === "dark" ? "#0F1C31" : colors.surface;
  const borderColor = mode === "dark" ? "#1E3357" : colors.subtle;
  const iconColor = mode === "dark" ? "#7AA5FF" : colors.primary;

  const submit = async () => {
    try {
      setLoading(true);
      await login(form.login.trim(), form.password);
      router.replace("/(app)/home");
    } catch (err) {
      Alert.alert(
        "Login failed",
        err instanceof Error ? err.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false} scrollable keyboardOffset={60}>
      <SnowBackground count={60} opacity={mode === "dark" ? 0.16 : 0.12} />
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 80, gap: 32 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/logo/logo.png")}
            style={{ width: "100%", height: 200 }}
            resizeMode="contain"
          />
        </View>

        <View style={{ gap: 18 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: "700",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {t.title}
          </Text>

          <View style={{ gap: 12 }}>
            <LinedInput
              icon="person-outline"
              placeholder={t.loginPlaceholder}
              value={form.login}
              onChangeText={(loginVal) =>
                setForm((s) => ({ ...s, login: loginVal }))
              }
            />
            <LinedInput
              icon="lock-closed-outline"
              placeholder={t.passwordPlaceholder}
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(password) =>
                setForm((s) => ({ ...s, password }))
              }
              accessory={
                <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={iconColor}
                  />
                </TouchableOpacity>
              }
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Select
                  label={t.languageLabel}
                  placeholder={t.languagePlaceholder}
                  value={language}
                  onValueChange={(value) => setLanguage(value as Language)}
                  options={[
                    { label: "English", value: "en" },
                    { label: "Turkish", value: "tr" },
                    { label: "Russian", value: "ru" },
                  ]}
                />
              </View>
              <View style={{ gap: 6, alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  {t.themeLabel}
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setMode("light")}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        mode === "light" ? primaryColor : panelColor,
                      borderWidth: 1,
                      borderColor:
                        mode === "light" ? primaryColor : borderColor,
                    }}
                  >
                    <Ionicons
                      name="sunny"
                      size={20}
                      color={mode === "light" ? colors.background : iconColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setMode("dark")}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        mode === "dark" ? primaryColor : panelColor,
                      borderWidth: 1,
                      borderColor:
                        mode === "dark" ? primaryColor : borderColor,
                    }}
                  >
                    <Ionicons
                      name="moon"
                      size={20}
                      color={mode === "dark" ? colors.background : iconColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Button
              label={t.button}
              onPress={submit}
              loading={loading}
              fullWidth
              style={{
                backgroundColor: primaryColor,
                borderColor: primaryColor,
                marginTop: 6,
              }}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}

type LinedInputProps = {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  accessory?: ReactNode;
};

function LinedInput({
  icon,
  placeholder,
  value,
  secureTextEntry,
  onChangeText,
  accessory,
}: LinedInputProps) {
  const { colors, mode } = useTheme();
  const backgroundColor = mode === "dark" ? "#0F1C31" : colors.surface;
  const borderColor = mode === "dark" ? "#1E3357" : colors.subtle;
  const iconColor = mode === "dark" ? "#7AA5FF" : colors.primary;
  const placeholderColor = mode === "dark" ? "#6B7DA5" : colors.muted;

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 14,
        borderWidth: 1,
        borderColor,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        height: 54,
      }}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Input
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={placeholderColor}
          style={{
            borderWidth: 0,
            backgroundColor: "transparent",
            paddingHorizontal: 0,
            paddingVertical: 0,
            color: colors.text,
          }}
        />
      </View>
      {accessory}
    </View>
  );
}
