import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth";
import { useTasksQuery } from "@/query/hooks";
import { TaskDrawer } from "@/components/TaskDrawer";
import { useLanguage } from "@/contexts/language";

type Language = "en" | "tr" | "ru";

type TasksTexts = {
  title: string;
  subtitle: string;
  create: string;
  loading: string;
  noTasks: string;
  task: string;
  deadline: string;
};

const translations: Record<Language, TasksTexts> = {
  en: {
    title: "Tasks",
    subtitle: "Assigned and submitted tasks.",
    create: "Create",
    loading: "Loading...",
    noTasks: "No tasks yet.",
    task: "Task",
    deadline: "Deadline",
  },
  tr: {
    title: "Görevler",
    subtitle: "Atanan ve gönderilen görevler.",
    create: "Oluştur",
    loading: "Yükleniyor...",
    noTasks: "Henüz görev yok.",
    task: "Görev",
    deadline: "Son tarih",
  },
  ru: {
    title: "Задачи",
    subtitle: "Назначенные и отправленные задачи.",
    create: "Создать",
    loading: "Загрузка...",
    noTasks: "Задач пока нет.",
    task: "Задача",
    deadline: "Срок",
  },
};

export default function TasksScreen() {
  const { colors } = useTheme();
  const { token, user, role } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const tasksQuery = useTasksQuery({ token, scope: user?.id });
  const data = tasksQuery.data ?? [];
  const loading = tasksQuery.isPending;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const statusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return colors.secondary;
      case "FIXED_PENDING_CHECK":
        return colors.accent;
      case "REJECTED":
        return colors.danger ?? colors.accent;
      case "CLOSED":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const formatDate = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={tasksQuery.isFetching && !tasksQuery.isPending}
            tintColor={colors.primary}
            onRefresh={async () => {
              await tasksQuery.refetch();
            }}
          />
        }
      >
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
                {t.title}
              </Text>
              <Text style={{ color: colors.muted }}>
                {t.subtitle}
              </Text>
            </View>
            {role === "SUPERVISOR" ? (
              <Button
                label={t.create}
                onPress={() => router.push("/(app)/create-task")}
                style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
              />
            ) : null}
          </View>
        </View>

        {loading ? (
          <View style={{ alignItems: "center", padding: 24 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : data.length === 0 ? (
          <View style={{ alignItems: "center", padding: 24 }}>
            <Text style={{ color: colors.muted }}>{t.noTasks}</Text>
          </View>
        ) : (
          data.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedId(item.id);
                setDrawerOpen(true);
              }}
            >
              <Card style={{ gap: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                    {item.categoryName || t.task}
                  </Text>
                  <Chip
                    label={String(item.status || "").replace(/_/g, " ")}
                    selected
                    style={{ backgroundColor: statusColor(String(item.status || "")) }}
                  />
                </View>
                <Text style={{ color: colors.muted, fontSize: 13 }}>{item.description}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {item.projectName ? (
                    <Chip label={item.projectName} style={{ backgroundColor: colors.surface }} />
                  ) : null}
                  {item.departmentName ? (
                    <Chip
                      label={item.departmentName}
                      style={{ backgroundColor: colors.surface }}
                    />
                  ) : null}
                </View>
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {t.deadline}: {formatDate(item.deadline)}
                </Text>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TaskDrawer
        visible={drawerOpen}
        taskId={selectedId}
        token={token}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedId(null);
        }}
        colors={colors}
      />
    </Screen>
  );
}
