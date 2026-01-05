import { useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Screen } from "../../components/layout/Screen";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { useTheme } from "../../contexts/theme";
import { useAuth } from "../../contexts/auth";
import { useLanguage } from "../../contexts/language";
import {
  useCategoriesQuery,
  useCreateObservationMutation,
  useDepartmentsQuery,
  useLocationsQuery,
  useProjectsQuery,
  useSubcategoriesQuery,
  useSupervisorsQuery,
} from "../../query/hooks";

type MediaAttachment = {
  uri: string;
  base64?: string;
  mime?: string;
  kind: "IMAGE" | "VIDEO";
};

type Language = "en" | "tr" | "ru";

type FormTexts = {
  title: string;
  subtitle: string;
  loading: string;
  supervisorBlocked: string;
  errorTitle: string;
  loginAgain: string;
  requiredFields: string;
  workerFields: string;
  rightsTitle: string;
  rightsBody: string;
  imageReadError: string;
  videoReadError: string;
  createdTitle: string;
  createdBody: string;
  createErrorTitle: string;
  createErrorBody: string;
  project: string;
  projectPlaceholder: string;
  department: string;
  departmentPlaceholder: string;
  supervisor: string;
  supervisorPlaceholder: string;
  location: string;
  locationPlaceholder: string;
  category: string;
  categoryPlaceholder: string;
  subcategory: string;
  subcategoryPlaceholder: string;
  subcategoryEmpty: string;
  subcategoryChooseCategory: string;
  workerName: string;
  workerNamePlaceholder: string;
  workerProfession: string;
  workerProfessionPlaceholder: string;
  riskTitle: string;
  riskLabelPrefix: string;
  riskLevels: string[];
  description: string;
  descriptionPlaceholder: string;
  mediaTitle: string;
  gallery: string;
  camera: string;
  imagesEmpty: string;
  videosEmpty: string;
  imageLabel: string;
  videoLabel: string;
  deadline: string;
  dateLabel: string;
  timeLabel: string;
  submit: string;
  submitting: string;
};

const translations: Record<Language, FormTexts> = {
  en: {
    title: "Create observation",
    subtitle: "Log a new safety observation",
    loading: "Loading...",
    supervisorBlocked: "Only supervisors can create observations.",
    errorTitle: "Error",
    loginAgain: "Please log in again",
    requiredFields: "Fill in the required fields",
    workerFields: "Enter worker info and description",
    rightsTitle: "Permission needed",
    rightsBody: "Allow access to continue.",
    imageReadError: "Could not read image data",
    videoReadError: "Could not read video",
    createdTitle: "Done",
    createdBody: "Observation created",
    createErrorTitle: "Creation failed",
    createErrorBody: "Could not create observation",
    project: "Project",
    projectPlaceholder: "Select project",
    department: "Department",
    departmentPlaceholder: "Select department",
    supervisor: "Responsible",
    supervisorPlaceholder: "Select responsible",
    location: "Area",
    locationPlaceholder: "Select area",
    category: "Category",
    categoryPlaceholder: "Select category",
    subcategory: "Subcategory (optional)",
    subcategoryPlaceholder: "Select subcategory",
    subcategoryEmpty: "No subcategories",
    subcategoryChooseCategory: "Choose a category first",
    workerName: "Worker name",
    workerNamePlaceholder: "Enter name",
    workerProfession: "Worker profession",
    workerProfessionPlaceholder: "Enter profession",
    riskTitle: "Risk level",
    riskLabelPrefix: "Level",
    riskLevels: ["Very low", "Low", "Medium", "High", "Critical"],
    description: "Full description",
    descriptionPlaceholder: "Describe the observation",
    mediaTitle: "Image / Video",
    gallery: "Gallery",
    camera: "Camera",
    imagesEmpty: "No images",
    videosEmpty: "No videos",
    imageLabel: "Photo",
    videoLabel: "Video",
    deadline: "Deadline",
    dateLabel: "Date",
    timeLabel: "Time",
    submit: "Submit observation",
    submitting: "Submitting...",
  },
  tr: {
    title: "Gozlem olustur",
    subtitle: "Yeni bir guvenlik gozlemi ekle",
    loading: "Yukleniyor...",
    supervisorBlocked: "Sadece sorumlular gozlem olusturabilir.",
    errorTitle: "Hata",
    loginAgain: "Lutfen tekrar giris yapin",
    requiredFields: "Zorunlu alanlari doldurun",
    workerFields: "Calisan bilgisi ve aciklama girin",
    rightsTitle: "Izin gerekli",
    rightsBody: "Devam etmek icin erisim izni verin.",
    imageReadError: "Gorsel okunamadi",
    videoReadError: "Video okunamadi",
    createdTitle: "Tamam",
    createdBody: "Gozlem olusturuldu",
    createErrorTitle: "Olusturma hatasi",
    createErrorBody: "Gozlem olusturulamadi",
    project: "Proje",
    projectPlaceholder: "Proje secin",
    department: "Departman",
    departmentPlaceholder: "Departman secin",
    supervisor: "Sorumlu",
    supervisorPlaceholder: "Sorumlu secin",
    location: "Alan",
    locationPlaceholder: "Alan secin",
    category: "Kategori",
    categoryPlaceholder: "Kategori secin",
    subcategory: "Alt kategori (opsiyonel)",
    subcategoryPlaceholder: "Alt kategori secin",
    subcategoryEmpty: "Alt kategori yok",
    subcategoryChooseCategory: "Once kategori secin",
    workerName: "Calisan adi",
    workerNamePlaceholder: "Isim girin",
    workerProfession: "Calisan meslegi",
    workerProfessionPlaceholder: "Meslek girin",
    riskTitle: "Risk seviyesi",
    riskLabelPrefix: "Seviye",
    riskLevels: ["Cok dusuk", "Dusuk", "Orta", "Yuksek", "Kritik"],
    description: "Detayli aciklama",
    descriptionPlaceholder: "Gozlemi aciklayin",
    mediaTitle: "Gorsel / Video",
    gallery: "Galeri",
    camera: "Kamera",
    imagesEmpty: "Gorsel yok",
    videosEmpty: "Video yok",
    imageLabel: "Fotograf",
    videoLabel: "Video",
    deadline: "Bitis tarihi",
    dateLabel: "Tarih",
    timeLabel: "Saat",
    submit: "Gozlemi gonder",
    submitting: "Gonderiliyor...",
  },
  ru: {
    title: "Создать наблюдение",
    subtitle: "Добавить новое наблюдение по безопасности",
    loading: "Загрузка...",
    supervisorBlocked: "Только руководители могут создавать наблюдения.",
    errorTitle: "Ошибка",
    loginAgain: "Пожалуйста, войдите снова",
    requiredFields: "Заполните обязательные поля",
    workerFields: "Введите данные работника и описание",
    rightsTitle: "Требуется разрешение",
    rightsBody: "Разрешите доступ, чтобы продолжить.",
    imageReadError: "Не удалось прочитать изображение",
    videoReadError: "Не удалось прочитать видео",
    createdTitle: "Готово",
    createdBody: "Наблюдение создано",
    createErrorTitle: "Ошибка создания",
    createErrorBody: "Не удалось создать наблюдение",
    project: "Проект",
    projectPlaceholder: "Выберите проект",
    department: "Отдел",
    departmentPlaceholder: "Выберите отдел",
    supervisor: "Руководитель",
    supervisorPlaceholder: "Выберите руководителя",
    location: "Местоположение",
    locationPlaceholder: "Выберите местоположение",
    category: "Категория",
    categoryPlaceholder: "Выберите категорию",
    subcategory: "Подкатегория (необязательно)",
    subcategoryPlaceholder: "Выберите подкатегорию",
    subcategoryEmpty: "Подкатегорий нет",
    subcategoryChooseCategory: "Сначала выберите категорию",
    workerName: "Имя работника",
    workerNamePlaceholder: "Введите имя",
    workerProfession: "Профессия работника",
    workerProfessionPlaceholder: "Введите профессию",
    riskTitle: "Уровень риска",
    riskLabelPrefix: "Уровень",
    riskLevels: ["Очень низкий", "Низкий", "Средний", "Высокий", "Критический"],
    description: "Полное описание",
    descriptionPlaceholder: "Опишите наблюдение",
    mediaTitle: "Изображение / Видео",
    gallery: "Галерея",
    camera: "Камера",
    imagesEmpty: "Нет изображений",
    videosEmpty: "Нет видео",
    imageLabel: "Фото",
    videoLabel: "Видео",
    deadline: "Срок",
    dateLabel: "Дата",
    timeLabel: "Время",
    submit: "Отправить наблюдение",
    submitting: "Отправка...",
  },
};

type ThemeTokens = {
  panelBg: string;
  border: string;
  cardBg: string;
  chipBg: string;
  icon: string;
};

function getThemeTokens(
  colors: ReturnType<typeof useTheme>["colors"],
  mode: "dark" | "light"
): ThemeTokens {
  const isDark = mode === "dark";
  return {
    panelBg: isDark ? "#0F1C31" : "#EEF4EE",
    border: isDark ? "#1E3357" : "#D5E2D5",
    cardBg: isDark ? colors.card : "#F9FBF9",
    chipBg: isDark ? colors.subtle : "#E3EDE3",
    icon: isDark ? "#E5EDFF" : colors.text,
  };
}

export default function CreateObservationScreen() {
  const { colors, mode } = useTheme();
  const theme = getThemeTokens(colors, mode);
  const { token, user } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [form, setForm] = useState({
    projectId: "",
    departmentId: "",
    locationId: "",
    categoryId: "",
    subcategoryId: "",
    supervisorId: "",
    workerFullName: "",
    workerProfession: "",
    riskLevel: 1,
    description: "",
  });
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [images, setImages] = useState<MediaAttachment[]>([]);
  const [videos, setVideos] = useState<MediaAttachment[]>([]);

  const createObservationMutation = useCreateObservationMutation({
    token,
    scope: user?.id,
  });

  const projectsQuery = useProjectsQuery({ token, scope: user?.id });
  const departmentsQuery = useDepartmentsQuery({ token, scope: user?.id });
  const supervisorsQuery = useSupervisorsQuery({ token, scope: user?.id });
  const categoriesQuery = useCategoriesQuery({ token, scope: user?.id });
  const locationsQuery = useLocationsQuery({ token, scope: user?.id });
  const subcategoriesQuery = useSubcategoriesQuery({
    token,
    scope: user?.id,
    categoryId: form.categoryId || undefined,
  });

  const projects = projectsQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];
  const supervisors = supervisorsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const subcategories = subcategoriesQuery.data ?? [];
  const locations = locationsQuery.data ?? [];

  const saving = createObservationMutation.isPending;
  const loading =
    projectsQuery.isPending ||
    departmentsQuery.isPending ||
    supervisorsQuery.isPending ||
    categoriesQuery.isPending ||
    locationsQuery.isPending;

  const loadError =
    projectsQuery.error ||
    departmentsQuery.error ||
    supervisorsQuery.error ||
    categoriesQuery.error ||
    locationsQuery.error;
  const alertedLoadErrorRef = useRef(false);
  useEffect(() => {
    if (!loadError || alertedLoadErrorRef.current) return;
    alertedLoadErrorRef.current = true;
    Alert.alert(t.errorTitle, t.createErrorBody);
  }, [loadError, t.errorTitle, t.createErrorBody]);

  const ensureDataUri = (value: string, mime: string) =>
    value.startsWith("data:") ? value : `data:${mime};base64,${value}`;

  const pickImage = async (from: "camera" | "gallery") => {
    const perm =
      from === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t.rightsTitle, t.rightsBody);
      return;
    }
    const picker =
      from === "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    const result = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset) return;

    const base64 = asset.base64;
    if (!base64) {
      Alert.alert(t.errorTitle, t.imageReadError);
      return;
    }

    setImages((prev) => [
      ...prev,
      {
        uri: asset.uri,
        base64,
        mime: asset.mimeType ?? "image/jpeg",
        kind: "IMAGE",
      },
    ]);
  };

  const pickVideo = async (from: "camera" | "gallery") => {
    const perm =
      from === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t.rightsTitle, t.rightsBody);
      return;
    }
    const picker =
      from === "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    const result = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset) return;

    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: "base64",
      });
      setVideos((prev) => [
        ...prev,
        {
          uri: asset.uri,
          base64,
          mime: asset.mimeType ?? "video/mp4",
          kind: "VIDEO",
        },
      ]);
    } catch (err) {
      console.warn("Failed to read video:", err);
      Alert.alert(t.errorTitle, t.videoReadError);
    }
  };

  const submit = async () => {
    if (!token || !user) return Alert.alert(t.errorTitle, t.loginAgain);

    if (
      !form.projectId ||
      !form.departmentId ||
      !form.categoryId ||
      !form.supervisorId
    ) {
      return Alert.alert(t.errorTitle, t.requiredFields);
    }

    if (
      !form.workerFullName.trim() ||
      !form.workerProfession.trim() ||
      !form.description.trim()
    ) {
      return Alert.alert(t.errorTitle, t.workerFields);
    }

    const mediaPayload = [
      ...(images
        .map((img) =>
          img.base64
            ? {
                url: ensureDataUri(img.base64, img.mime ?? "image/jpeg"),
                type: "IMAGE" as const,
                isCorrective: false,
              }
            : null
        )
        .filter(Boolean) as {
        url: string;
        type: "IMAGE";
        isCorrective: boolean;
      }[]),
      ...(videos
        .map((video) =>
          video.base64
            ? {
                url: ensureDataUri(video.base64, video.mime ?? "video/mp4"),
                type: "VIDEO" as const,
                isCorrective: false,
              }
            : null
        )
        .filter(Boolean) as {
        url: string;
        type: "VIDEO";
        isCorrective: boolean;
      }[]),
    ];

    try {
      await createObservationMutation.mutateAsync({
        createdByUserId: user.id,
        projectId: form.projectId,
        departmentId: form.departmentId,
        // locationId excluded: backend does not accept this field
        categoryId: form.categoryId,
        ...(form.subcategoryId ? { subcategoryId: form.subcategoryId } : {}),
        supervisorId: form.supervisorId,
        workerFullName: form.workerFullName,
        workerProfession: form.workerProfession,
        riskLevel: form.riskLevel,
        description: form.description,
        deadline: deadline.toISOString(),
        status: "NEW",
        media: mediaPayload.length ? mediaPayload : undefined,
      });
      Alert.alert(t.createdTitle, t.createdBody);
      setForm({
        projectId: "",
        departmentId: "",
        locationId: "",
        categoryId: "",
        subcategoryId: "",
        supervisorId: "",
        workerFullName: "",
        workerProfession: "",
        riskLevel: 1,
        description: "",
      });
      setImages([]);
      setVideos([]);
      setDeadline(new Date());
      router.push("/(app)/home");
    } catch (err) {
      console.error("Failed to create observation:", err);
      const errorMessage =
        err instanceof Error ? err.message : t.createErrorBody;
      Alert.alert(t.createErrorTitle, errorMessage);
    }
  };
  const bind = (key: keyof typeof form) => (value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const availableLocations = locations.filter(
    (loc) => !form.projectId || loc.projectId === form.projectId
  );
  const selectableSupervisors = supervisors.filter((s) => s.id !== user?.id);

  if (loading) {
    return (
      <Screen>
        <Text style={{ color: colors.muted }}>{t.loading}</Text>
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <View style={{ gap: 8 }}>
        <Text
          style={{
            color: colors.primary,
            fontSize: 24,
            fontWeight: "800",
            textTransform: "uppercase",
          }}
        >
          {t.title}
        </Text>
        <Text style={{ color: colors.muted }}>{t.subtitle}</Text>
      </View>


      <Card
        style={{
          gap: 16,
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        }}
      >
        <Select
          label={t.project}
          value={form.projectId}
          placeholder={t.projectPlaceholder}
          options={projects.map((p) => ({ label: p.name, value: p.id }))}
          onValueChange={(value) => {
            setForm((prev) => ({
              ...prev,
              projectId: value,
              locationId: "",
            }));
          }}
        />

        <Select
          label={t.department}
          value={form.departmentId}
          placeholder={t.departmentPlaceholder}
          options={departments.map((d) => ({ label: d.name, value: d.id }))}
          onValueChange={bind("departmentId")}
        />

        <Select
          label={t.location}
          value={form.locationId}
          placeholder={
            !form.projectId ? t.projectPlaceholder : t.locationPlaceholder
          }
          options={availableLocations.map((loc) => ({
            label: loc.name,
            value: loc.id,
          }))}
          onValueChange={bind("locationId")}
          disabled={!form.projectId}
        />

        <Select
          label={t.supervisor}
          value={form.supervisorId}
          placeholder={t.supervisorPlaceholder}
          options={selectableSupervisors.map((s) => ({ label: s.fullName, value: s.id }))}
          onValueChange={bind("supervisorId")}
          disabled={!selectableSupervisors.length}
        />

        <Select
          label={t.category}
          value={form.categoryId}
          placeholder={t.categoryPlaceholder}
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
          onValueChange={(value) => {
            setForm((prev) => ({
              ...prev,
              categoryId: value,
              subcategoryId: "",
            }));
          }}
        />

        <Select
          label={t.subcategory}
          value={form.subcategoryId}
          placeholder={
            !form.categoryId
              ? t.subcategoryChooseCategory
              : subcategories.length === 0
              ? t.subcategoryEmpty
              : t.subcategoryPlaceholder
          }
          options={subcategories.map((sc) => ({
            label: sc.name,
            value: sc.id,
          }))}
          onValueChange={bind("subcategoryId")}
          disabled={!form.categoryId}
        />

        <Input
          label={t.workerName}
          value={form.workerFullName}
          onChangeText={bind("workerFullName")}
          placeholder={t.workerNamePlaceholder}
        />

        <Input
          label={t.workerProfession}
          value={form.workerProfession}
          onChangeText={bind("workerProfession")}
          placeholder={t.workerProfessionPlaceholder}
        />

        <View style={{ gap: 10 }}>
          <Text
            style={{ color: colors.primary, fontSize: 16, fontWeight: "700" }}
          >
            {t.riskTitle}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <RiskLevelButton
                key={level}
                level={level}
                selected={form.riskLevel === level}
                onPress={() =>
                  setForm((prev) => ({ ...prev, riskLevel: level }))
                }
                theme={theme}
                colors={colors}
              />
            ))}
          </View>
          <Text
            style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}
          >
            {t.riskLabelPrefix} {form.riskLevel} -{" "}
            {t.riskLevels[form.riskLevel - 1]}
          </Text>
        </View>

        <Input
          label={t.description}
          multiline
          value={form.description}
          onChangeText={bind("description")}
          placeholder={t.descriptionPlaceholder}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <View style={{ gap: 10 }}>
          <Text
            style={{ color: colors.primary, fontSize: 16, fontWeight: "700" }}
          >
            {t.mediaTitle}
          </Text>
          <View
            style={{
              backgroundColor: theme.panelBg,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 12,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              <MediaPickButton
                label={t.gallery}
                icon="image-outline"
                onPress={() => pickImage("gallery")}
                theme={theme}
              />
              <MediaPickButton
                label={t.camera}
                icon="camera-outline"
                onPress={() => pickImage("camera")}
                theme={theme}
              />
            </View>
            <AttachmentList
              items={images}
              emptyLabel={t.imagesEmpty}
              onRemove={(idx) =>
                setImages((prev) => prev.filter((_, i) => i !== idx))
              }
              theme={theme}
              colors={colors}
              t={t}
            />
          </View>

          <View
            style={{
              backgroundColor: theme.panelBg,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 12,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              <MediaPickButton
                label={t.gallery}
                icon="film-outline"
                onPress={() => pickVideo("gallery")}
                theme={theme}
              />
              <MediaPickButton
                label={t.camera}
                icon="videocam-outline"
                onPress={() => pickVideo("camera")}
                theme={theme}
              />
            </View>
            <AttachmentList
              items={videos}
              emptyLabel={t.videosEmpty}
              onRemove={(idx) =>
                setVideos((prev) => prev.filter((_, i) => i !== idx))
              }
              theme={theme}
              colors={colors}
              t={t}
            />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text
            style={{ color: colors.primary, fontWeight: "700", fontSize: 16 }}
          >
            {t.deadline}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                backgroundColor: theme.panelBg,
                borderWidth: 1,
                borderColor: theme.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={{ color: colors.text, flex: 1 }}>
                {deadline.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                backgroundColor: theme.panelBg,
                borderWidth: 1,
                borderColor: theme.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={{ color: colors.text, flex: 1 }}>
                {deadline.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setDeadline(selectedDate);
                }
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={deadline}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowTimePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setDeadline(selectedDate);
                }
              }}
            />
          )}
        </View>

        <Button
          label={saving ? t.submitting : t.submit}
          onPress={submit}
          loading={saving}
          fullWidth
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            paddingVertical: 16,
          }}
        />
      </Card>
    </Screen>
  );
}

function MediaPickButton({
  label,
  icon,
  onPress,
  theme,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  theme: ThemeTokens;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: theme.panelBg,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function AttachmentList({
  items,
  emptyLabel,
  onRemove,
  theme,
  colors,
  t,
}: {
  items: MediaAttachment[];
  emptyLabel: string;
  onRemove: (idx: number) => void;
  theme: ThemeTokens;
  colors: ReturnType<typeof useTheme>["colors"];
  t: FormTexts;
}) {
  if (!items.length) {
    return (
      <Text style={{ color: colors.muted, fontSize: 12 }}>{emptyLabel}</Text>
    );
  }
  return (
    <View style={{ gap: 6 }}>
      {items.map((item, idx) => (
        <View
          key={`${item.uri}-${idx}`}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.cardBg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flex: 1,
            }}
          >
            <Ionicons
              name={item.kind === "IMAGE" ? "image-outline" : "film-outline"}
              size={18}
              color={colors.primary}
            />
            <Text style={{ color: colors.text, flex: 1 }}>
              {item.kind === "IMAGE" ? t.imageLabel : t.videoLabel} {idx + 1}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onRemove(idx)} hitSlop={8}>
            <Ionicons name="close-circle-outline" size={20} color="#FF7B95" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function RiskLevelButton({
  level,
  selected,
  onPress,
  theme,
  colors,
}: {
  level: number;
  selected: boolean;
  onPress: () => void;
  theme: ThemeTokens;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const riskColors = ["#00D68F", "#2A9D8F", "#264653", "#F4A261", "#E63946"];
  const backgroundColor = selected ? riskColors[level - 1] : theme.panelBg;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        flex: 1,
        aspectRatio: 1,
        backgroundColor,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: selected ? 0 : 1,
        borderColor: theme.border,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 28,
          fontWeight: "800",
        }}
      >
        {level}
      </Text>
    </TouchableOpacity>
  );
}

