import { useMemo, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
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
  useCreateTaskMutation,
  useDepartmentsQuery,
  useLocationsQuery,
  useProjectsQuery,
  useSupervisorsQuery,
} from "../../query/hooks";

type Attachment = {
  uri: string;
  type: "IMAGE" | "VIDEO" | "FILE";
  base64?: string;
  mime?: string;
};

const ensureDataUri = (value: string, mime: string) =>
  value.startsWith("data:") ? value : `data:${mime};base64,${value}`;

type Language = "en" | "tr" | "ru";

type CreateTaskTexts = {
  title: string;
  subtitle: string;
  loading: string;
  supervisorOnly: string;
  errorTitle: string;
  loginAgain: string;
  requiredFields: string;
  enterDescription: string;
  permissionTitle: string;
  permissionBody: string;
  videoReadError: string;
  fileReadError: string;
  doneTitle: string;
  taskCreated: string;
  creationFailed: string;
  couldNotCreate: string;
  project: string;
  projectPlaceholder: string;
  department: string;
  departmentPlaceholder: string;
  location: string;
  locationOptional: string;
  locationPlaceholder: string;
  selectProjectFirst: string;
  supervisor: string;
  supervisorPlaceholder: string;
  category: string;
  categoryPlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  attachments: string;
  image: string;
  imageCamera: string;
  video: string;
  videoCamera: string;
  file: string;
  noAttachments: string;
  deadline: string;
  date: string;
  time: string;
  submit: string;
  submitting: string;
};

const translations: Record<Language, CreateTaskTexts> = {
  en: {
    title: "Create task",
    subtitle: "Send a new task to another supervisor",
    loading: "Loading...",
    supervisorOnly: "Only supervisors can create tasks.",
    errorTitle: "Error",
    loginAgain: "Please log in again",
    requiredFields: "Fill in the required fields",
    enterDescription: "Enter a description",
    permissionTitle: "Permission needed",
    permissionBody: "Allow media access to attach files.",
    videoReadError: "Could not read video",
    fileReadError: "Could not read file",
    doneTitle: "Done",
    taskCreated: "Task created",
    creationFailed: "Creation failed",
    couldNotCreate: "Could not create task",
    project: "Project",
    projectPlaceholder: "Select project",
    department: "Department",
    departmentPlaceholder: "Select department",
    location: "Area",
    locationOptional: "Area (optional)",
    locationPlaceholder: "Select area",
    selectProjectFirst: "Select project first",
    supervisor: "Responsible",
    supervisorPlaceholder: "Select responsible",
    category: "Category",
    categoryPlaceholder: "Select category",
    description: "Description",
    descriptionPlaceholder: "Describe the task",
    attachments: "Attachments",
    image: "Image from gallery",
    imageCamera: "Image from camera",
    video: "Video from gallery",
    videoCamera: "Video from camera",
    file: "File",
    noAttachments: "No attachments",
    deadline: "Deadline",
    date: "Date",
    time: "Time",
    submit: "Submit task",
    submitting: "Submitting...",
  },
  tr: {
    title: "Görev oluştur",
    subtitle: "Başka bir sorumluya yeni görev gönder",
    loading: "Yükleniyor...",
    supervisorOnly: "Sadece sorumlular görev oluşturabilir.",
    errorTitle: "Hata",
    loginAgain: "Lütfen tekrar giriş yapın",
    requiredFields: "Zorunlu alanları doldurun",
    enterDescription: "Açıklama girin",
    permissionTitle: "İzin gerekli",
    permissionBody: "Dosya eklemek için medya erişimine izin verin.",
    videoReadError: "Video okunamadı",
    fileReadError: "Dosya okunamadı",
    doneTitle: "Tamam",
    taskCreated: "Görev oluşturuldu",
    creationFailed: "Oluşturma hatası",
    couldNotCreate: "Görev oluşturulamadı",
    project: "Proje",
    projectPlaceholder: "Proje seçin",
    department: "Departman",
    departmentPlaceholder: "Departman seçin",
    location: "Alan",
    locationOptional: "Alan (opsiyonel)",
    locationPlaceholder: "Alan seçin",
    selectProjectFirst: "Önce proje seçin",
    supervisor: "Sorumlu",
    supervisorPlaceholder: "Sorumlu seçin",
    category: "Kategori",
    categoryPlaceholder: "Kategori seçin",
    description: "Açıklama",
    descriptionPlaceholder: "Görevi açıklayın",
    attachments: "Ekler",
    image: "Galeriden görsel",
    imageCamera: "Kameradan görsel",
    video: "Galeriden video",
    videoCamera: "Kameradan video",
    file: "Dosya",
    noAttachments: "Ek yok",
    deadline: "Bitiş tarihi",
    date: "Tarih",
    time: "Saat",
    submit: "Görevi gönder",
    submitting: "Gönderiliyor...",
  },
  ru: {
    title: "Создать задачу",
    subtitle: "Отправить новую задачу другому руководителю",
    loading: "Загрузка...",
    supervisorOnly: "Только руководители могут создавать задачи.",
    errorTitle: "Ошибка",
    loginAgain: "Пожалуйста, войдите снова",
    requiredFields: "Заполните обязательные поля",
    enterDescription: "Введите описание",
    permissionTitle: "Требуется разрешение",
    permissionBody: "Разрешите доступ к медиафайлам для вложений.",
    videoReadError: "Не удалось прочитать видео",
    fileReadError: "Не удалось прочитать файл",
    doneTitle: "Готово",
    taskCreated: "Задача создана",
    creationFailed: "Ошибка создания",
    couldNotCreate: "Не удалось создать задачу",
    project: "Проект",
    projectPlaceholder: "Выберите проект",
    department: "Отдел",
    departmentPlaceholder: "Выберите отдел",
    location: "Зона",
    locationOptional: "Зона (необязательно)",
    locationPlaceholder: "Выберите зону",
    selectProjectFirst: "Сначала выберите проект",
    supervisor: "Ответственный",
    supervisorPlaceholder: "Выберите ответственного",
    category: "Категория",
    categoryPlaceholder: "Выберите категорию",
    description: "Описание",
    descriptionPlaceholder: "Опишите задачу",
    attachments: "Вложения",
    image: "Фото из галереи",
    imageCamera: "Фото с камеры",
    video: "Видео из галереи",
    videoCamera: "Видео с камеры",
    file: "Файл",
    noAttachments: "Нет вложений",
    deadline: "Срок",
    date: "Дата",
    time: "Время",
    submit: "Отправить задачу",
    submitting: "Отправка...",
  },
};

export default function CreateTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { token, user, role } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const [formState, setFormState] = useState({
    projectId: "",
    departmentId: "",
    locationId: "",
    supervisorId: "",
    categoryId: "",
    description: "",
  });

  const projectsQuery = useProjectsQuery({ token, scope: user?.id });
  const departmentsQuery = useDepartmentsQuery({ token, scope: user?.id });
  const locationsQuery = useLocationsQuery({ token, scope: user?.id });
  const supervisorsQuery = useSupervisorsQuery({ token, scope: user?.id });
  const categoriesQuery = useCategoriesQuery({ token, scope: user?.id, type: "task" });

  const createTaskMutation = useCreateTaskMutation({ token, scope: user?.id });

  const loading =
    projectsQuery.isPending ||
    departmentsQuery.isPending ||
    supervisorsQuery.isPending ||
    categoriesQuery.isPending ||
    locationsQuery.isPending;

  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    return d;
  });
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const selectableSupervisors = useMemo(
    () => (supervisorsQuery.data ?? []).filter((s) => s.id !== user?.id),
    [supervisorsQuery.data, user?.id]
  );

  const availableLocations = useMemo(
    () =>
      (locationsQuery.data ?? []).filter(
        (l) => !formState.projectId || l.projectId === formState.projectId
      ),
    [locationsQuery.data, formState.projectId]
  );

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t.permissionTitle, t.permissionBody);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    const base64 = asset.base64 ?? undefined;
    if (!base64) return;
    setAttachments((prev) => [
      ...prev,
      {
        uri: asset.uri,
        type: "IMAGE",
        base64,
        mime: asset.mimeType ?? "image/jpeg",
      },
    ]);
  };

  const pickImageCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t.permissionTitle, t.permissionBody);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    const base64 = asset.base64 ?? undefined;
    if (!base64) return;
    setAttachments((prev) => [
      ...prev,
      {
        uri: asset.uri,
        type: "IMAGE",
        base64,
        mime: asset.mimeType ?? "image/jpeg",
      },
    ]);
  };

  const pickVideo = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t.permissionTitle, t.permissionBody);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: "base64" });
      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          type: "VIDEO",
          base64,
          mime: asset.mimeType ?? "video/mp4",
        },
      ]);
    } catch (err) {
      console.warn("pickVideo failed:", err);
      Alert.alert(t.errorTitle, t.videoReadError);
    }
  };

  const pickVideoCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t.permissionTitle, t.permissionBody);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: "base64" });
      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          type: "VIDEO",
          base64,
          mime: asset.mimeType ?? "video/mp4",
        },
      ]);
    } catch (err) {
      console.warn("pickVideoCamera failed:", err);
      Alert.alert(t.errorTitle, t.videoReadError);
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: "*/*",
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: "base64" });
      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          type: "FILE",
          base64,
          mime: asset.mimeType ?? "application/octet-stream",
        },
      ]);
    } catch (err) {
      console.warn("pickFile failed:", err);
      Alert.alert(t.errorTitle, t.fileReadError);
    }
  };

  const submit = async () => {
    if (!token || !user) {
      Alert.alert(t.errorTitle, t.loginAgain);
      return;
    }
    if (role !== "SUPERVISOR") {
      Alert.alert(t.errorTitle, t.supervisorOnly);
      return;
    }
    if (!formState.projectId || !formState.departmentId || !formState.categoryId || !formState.supervisorId) {
      Alert.alert(t.errorTitle, t.requiredFields);
      return;
    }
    if (!formState.description.trim()) {
      Alert.alert(t.errorTitle, t.enterDescription);
      return;
    }

    const media = attachments.flatMap((att) => {
      if (!att.base64) return [];
      return [
        {
          url: ensureDataUri(att.base64, att.mime ?? "application/octet-stream"),
          type: att.type,
          isCorrective: false,
        },
      ];
    });

    try {
      await createTaskMutation.mutateAsync({
        createdByUserId: user.id,
        projectId: formState.projectId,
        departmentId: formState.departmentId,
        categoryId: formState.categoryId,
        supervisorId: formState.supervisorId,
        description: formState.description,
        deadline: deadline.toISOString(),
        status: "NEW",
        ...(media.length ? { media } : {}),
      });
      Alert.alert(t.doneTitle, t.taskCreated);
      setFormState({
        projectId: "",
        departmentId: "",
        locationId: "",
        supervisorId: "",
        categoryId: "",
        description: "",
      });
      const next = new Date();
      next.setHours(next.getHours() + 24);
      setDeadline(next);
      setAttachments([]);
      router.push("/(app)/tasks");
    } catch (err) {
      console.error("createTask failed:", err);
      Alert.alert(t.creationFailed, err instanceof Error ? err.message : t.couldNotCreate);
    }
  };

  if (loading) {
    return (
      <Screen>
        <Text style={{ color: colors.muted }}>{t.loading}</Text>
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <View style={{ gap: 14 }}>
        <View style={{ gap: 2 }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>{t.title}</Text>
          <Text style={{ color: colors.muted }}>{t.subtitle}</Text>
        </View>

        <Card style={{ gap: 12 }}>
          <Select
            label={`${t.project} *`}
            value={formState.projectId}
            placeholder={t.projectPlaceholder}
          options={(projectsQuery.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
          onValueChange={(v) =>
            setFormState((s) => ({
              ...s,
              projectId: v,
              departmentId: "",
              locationId: "",
              categoryId: "",
            }))
          }
        />

          <Select
            label={`${t.department} *`}
            value={formState.departmentId}
            placeholder={t.departmentPlaceholder}
            options={(departmentsQuery.data ?? []).map((d) => ({ value: d.id, label: d.name }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, departmentId: v }))}
          />

          <Select
            label={t.locationOptional}
            value={formState.locationId}
            placeholder={formState.projectId ? t.locationPlaceholder : t.selectProjectFirst}
            options={availableLocations.map((l) => ({ value: l.id, label: l.name }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, locationId: v }))}
            disabled={!formState.projectId}
          />

          <Select
            label={`${t.supervisor} *`}
            value={formState.supervisorId}
            placeholder={t.supervisorPlaceholder}
            options={selectableSupervisors.map((s) => ({ value: s.id, label: s.fullName }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, supervisorId: v }))}
          />

          <Select
            label={`${t.category} *`}
            value={formState.categoryId}
            placeholder={t.categoryPlaceholder}
            options={(categoriesQuery.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, categoryId: v }))}
          />
        </Card>

        <Card style={{ gap: 12 }}>
          <Input
            label={`${t.description} *`}
            value={formState.description}
            onChangeText={(v) => setFormState((s) => ({ ...s, description: v }))}
            placeholder={t.descriptionPlaceholder}
            multiline
            style={{ minHeight: 120, textAlignVertical: "top" as any }}
          />
        </Card>

        <Card style={{ gap: 12 }}>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{t.attachments}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <PickButton label={t.image} icon="image-outline" onPress={pickImage} />
            <PickButton label={t.imageCamera} icon="camera-outline" onPress={pickImageCamera} />
            <PickButton label={t.video} icon="videocam-outline" onPress={pickVideo} />
            <PickButton label={t.videoCamera} icon="videocam-outline" onPress={pickVideoCamera} />
            <PickButton label={t.file} icon="document-outline" onPress={pickFile} />
          </View>

          {attachments.length ? (
            <View style={{ gap: 8 }}>
              {attachments.map((att, idx) => (
                <View
                  key={`${att.uri}-${idx}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.subtle,
                  }}
                >
                  <Text style={{ color: colors.text, flex: 1 }}>
                    {att.type} {idx + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.danger ?? colors.accent} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: colors.muted }}>{t.noAttachments}</Text>
          )}
        </Card>

        <Card style={{ gap: 10 }}>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{t.deadline}</Text>
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            <Button
              label={`${t.date}: ${deadline.toISOString().slice(0, 10)}`}
              onPress={() => setShowDate(true)}
              variant="ghost"
              borderColor={colors.subtle}
              textColor={colors.text}
            />
            <Button
              label={`${t.time}: ${deadline.toTimeString().slice(0, 5)}`}
              onPress={() => setShowTime(true)}
              variant="ghost"
              borderColor={colors.subtle}
              textColor={colors.text}
            />
          </View>

          {showDate ? (
            <DateTimePicker
              value={deadline}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selected) => {
                setShowDate(false);
                if (!selected) return;
                const next = new Date(deadline);
                next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
                setDeadline(next);
              }}
            />
          ) : null}

          {showTime ? (
            <DateTimePicker
              value={deadline}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selected) => {
                setShowTime(false);
                if (!selected) return;
                const next = new Date(deadline);
                next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
                setDeadline(next);
              }}
            />
          ) : null}
        </Card>

        <Button
          label={createTaskMutation.isPending ? t.submitting : t.submit}
          fullWidth
          onPress={submit}
          loading={createTaskMutation.isPending}
          style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
        />
      </View>
    </Screen>
  );
}

function PickButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.subtle,
        backgroundColor: colors.surface,
      }}
    >
      <Ionicons name={icon} size={18} color={colors.text} />
      <Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}
