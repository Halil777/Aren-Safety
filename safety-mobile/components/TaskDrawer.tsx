import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "../contexts/theme";
import { useAuth } from "../contexts/auth";
import {
  useAnswerTaskMutation,
  useCloseTaskMutation,
  useRejectTaskMutation,
  useTaskQuery,
} from "../query/hooks";
import { type TaskDto } from "../services/api";
import { AnswerModal, type AnswerPayload } from "./AnswerModal";
import { Button } from "./ui/Button";

type Language = "en" | "tr" | "ru";

type DrawerTexts = {
  headerTitle: string;
  headerSubtitle: string;
  loading: string;
  notFound: string;
  descriptionFallback: string;
  riskPrefix: string;
  mediaTitle: string;
  answerTitle: string;
  sendAnswer: string;
  closeTask: string;
  rejectTask: string;
  rejectPlaceholder: string;
  sendReject: string;
  rejectionLabel: string;
  addRejectImage: string;
  addRejectFile: string;
  attachmentsEmpty: string;
  statuses: {
    NEW: string;
    IN_PROGRESS: string;
    FIXED_PENDING_CHECK: string;
    REJECTED: string;
    CLOSED: string;
    UNKNOWN: string;
  };
  meta: {
    project: string;
    department: string;
    category: string;
    company: string;
    supervisor: string;
    status: string;
    deadline: string;
    created: string;
  };
};

const translations: Record<Language, DrawerTexts> = {
  en: {
    headerTitle: "Task",
    headerSubtitle: "Details & updates",
    loading: "Loading...",
    notFound: "Task not found.",
    descriptionFallback: "No description",
    riskPrefix: "Risk",
    mediaTitle: "Media / Files",
    answerTitle: "Supervisor response",
    sendAnswer: "Add response",
    closeTask: "Confirm & close",
    rejectTask: "Reject & request fix",
    rejectPlaceholder: "Describe what needs to be fixed",
    sendReject: "Send rejection",
    rejectionLabel: "Rejection note",
    addRejectImage: "Add image",
    addRejectFile: "Add file",
    attachmentsEmpty: "No attachments",
    statuses: {
      NEW: "New",
      IN_PROGRESS: "In progress",
      FIXED_PENDING_CHECK: "Fixed pending check",
      REJECTED: "Rejected",
      CLOSED: "Closed",
      UNKNOWN: "Unknown",
    },
    meta: {
      project: "Project",
      department: "Department",
      category: "Category",
      company: "Company",
      supervisor: "Supervisor",
      status: "Status",
      deadline: "Deadline",
      created: "Created",
    },
  },
  tr: {
    headerTitle: "G\u00f6rev",
    headerSubtitle: "Detaylar ve g\u00fcncellemeler",
    loading: "Y\u00fckleniyor...",
    notFound: "G\u00f6rev bulunamad\u0131.",
    descriptionFallback: "A\u00e7\u0131klama yok",
    riskPrefix: "Risk",
    mediaTitle: "Medya / Dosyalar",
    answerTitle: "Sorumlu yan\u0131t\u0131",
    sendAnswer: "Yan\u0131t ekle",
    closeTask: "Onayla ve kapat",
    rejectTask: "Reddet ve d\u00fczeltme iste",
    rejectPlaceholder: "Neyin d\u00fczeltilmesi gerekti\u011fini yaz\u0131n",
    sendReject: "Red g\u00f6nder",
    rejectionLabel: "Red notu",
    addRejectImage: "G\u00f6rsel ekle",
    addRejectFile: "Dosya ekle",
    attachmentsEmpty: "Ek yok",
    statuses: {
      NEW: "Yeni",
      IN_PROGRESS: "Devam ediyor",
      FIXED_PENDING_CHECK: "Kontrol bekliyor",
      REJECTED: "Reddedildi",
      CLOSED: "Kapal\u0131",
      UNKNOWN: "Bilinmiyor",
    },
    meta: {
      project: "Proje",
      department: "Departman",
      category: "Kategori",
      company: "\u015eirket",
      supervisor: "Sorumlu",
      status: "Durum",
      deadline: "Son tarih",
      created: "Olu\u015fturulma",
    },
  },
  ru: {
    headerTitle: "\u0417\u0430\u0434\u0430\u0447\u0430",
    headerSubtitle: "\u0414\u0435\u0442\u0430\u043b\u0438 \u0438 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f",
    loading: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...",
    notFound: "\u0417\u0430\u0434\u0430\u0447\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430.",
    descriptionFallback: "\u041d\u0435\u0442 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u044f",
    riskPrefix: "\u0420\u0438\u0441\u043a",
    mediaTitle: "\u041c\u0435\u0434\u0438\u0430 / \u0424\u0430\u0439\u043b\u044b",
    answerTitle: "\u041e\u0442\u0432\u0435\u0442 \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f",
    sendAnswer: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043e\u0442\u0432\u0435\u0442",
    closeTask: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0438 \u0437\u0430\u043a\u0440\u044b\u0442\u044c",
    rejectTask: "\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c \u0438 \u0437\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u0438\u0441\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0430435",
    rejectPlaceholder: "\u041e\u043f\u0438\u0448\u0438\u0442\u0435, \u0447\u0442\u043e \u043d\u0443\u0436\u043d\u043e \u0438\u0441\u043f\u0440\u0430\u0432\u0438\u0442\u044c",
    sendReject: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043e\u0442\u043a\u0430\u0437",
    rejectionLabel: "\u041f\u0440\u0438\u0447\u0438\u043d\u0430 \u043e\u0442\u043a\u0430\u0437\u0430",
    addRejectImage: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435",
    addRejectFile: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0444\u0430\u0439\u043b",
    attachmentsEmpty: "\u041d\u0435\u0442 \u0432\u043b\u043e\u0436\u0435\u043d\u0438\u0439",
    statuses: {
      NEW: "\u041d\u043e\u0432\u0430\u044f",
      IN_PROGRESS: "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435",
      FIXED_PENDING_CHECK: "\u0418\u0441\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e, \u0436\u0434\u0451\u0442 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438",
      REJECTED: "\u041e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u043e",
      CLOSED: "\u0417\u0430\u043a\u0440\u044b\u0442\u0430",
      UNKNOWN: "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e",
    },
    meta: {
      project: "\u041f\u0440\u043e\u0435\u043a\u0442",
      department: "\u041e\u0442\u0434\u0435\u043b",
      category: "\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f",
      company: "\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f",
      supervisor: "\u0420\u0443\u043a\u043e\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c",
      status: "\u0421\u0442\u0430\u0442\u0443\u0441",
      deadline: "\u0421\u0440\u043e\u043a",
      created: "\u0421\u043e\u0437\u0434\u0430\u043d\u043e",
    },
  },
};

type ThemeTokens = {
  panelBg: string;
  border: string;
  cardBg: string;
  chipBg: string;
  icon: string;
  surface: string;
};

function getThemeTokens(colors: ReturnType<typeof useTheme>["colors"]): ThemeTokens {
  return {
    panelBg: colors.card,
    border: colors.subtle,
    cardBg: colors.card,
    chipBg: colors.surface,
    icon: colors.primary,
    surface: colors.surface,
  };
}

const ensureDataUri = (value: string, mime: string) =>
  value.startsWith("data:") ? value : `data:${mime};base64,${value}`;

type Attachment = {
  uri: string;
  type: "IMAGE" | "VIDEO" | "FILE";
  base64?: string;
  mime?: string;
};

type Props = {
  visible: boolean;
  taskId: string | null;
  token: string | null;
  onClose: () => void;
  colors?: ReturnType<typeof useTheme>["colors"];
  language?: Language;
};

export function TaskDrawer({
  visible,
  taskId,
  token,
  onClose,
  colors: colorsProp,
  language = "en",
}: Props) {
  const { colors } = useTheme();
  const palette = colorsProp ?? colors;
  const theme = getThemeTokens(palette);
  const texts = translations[language] ?? translations.en;
  const { user } = useAuth();

  const [answerOpen, setAnswerOpen] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [rejectionAttachments, setRejectionAttachments] = useState<Attachment[]>([]);

  const taskQuery = useTaskQuery({
    token,
    scope: user?.id,
    id: taskId,
    enabled: visible,
  });
  const task = taskQuery.data ?? null;
  const loading = taskQuery.isPending;

  const answerMutation = useAnswerTaskMutation({
    token,
    scope: user?.id,
    taskId,
  });
  const closeMutation = useCloseTaskMutation({
    token,
    scope: user?.id,
    taskId,
  });
  const rejectMutation = useRejectTaskMutation({
    token,
    scope: user?.id,
    taskId,
  });

  useEffect(() => {
    setShowReject(false);
    setRejectionNote("");
    setRejectionAttachments([]);
  }, [taskId, visible, task?.status]);

  const sendAnswer = async (payload: AnswerPayload) => {
    try {
      await answerMutation.mutateAsync(payload);
      Alert.alert("Answer sent", "Your response has been shared with the creator.");
      setAnswerOpen(false);
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Could not send answer");
    }
  };

  const closeForUser = async () => {
    if (!token || !taskId) return;
    try {
      await closeMutation.mutateAsync();
      Alert.alert("Task closed");
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Could not close task");
    }
  };

  const pickRejectImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow media access to attach files.");
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
    if (!base64) {
      Alert.alert("Error", "Could not read image");
      return;
    }
    setRejectionAttachments((prev) => [
      ...prev,
      {
        uri: asset.uri,
        type: "IMAGE",
        base64,
        mime: asset.mimeType ?? "image/jpeg",
      },
    ]);
  };

  const pickRejectFile = async () => {
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
      setRejectionAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          type: "FILE",
          base64,
          mime: asset.mimeType ?? "application/octet-stream",
        },
      ]);
    } catch (err) {
      console.warn("pickRejectFile failed:", err);
      Alert.alert("Error", "Could not read file");
    }
  };

  const rejectForUser = async () => {
    if (!token || !taskId) return;
    if (rejectionNote.trim().length < 2) {
      Alert.alert("Error", texts.rejectPlaceholder);
      return;
    }

    const media = rejectionAttachments.flatMap((att) => {
      if (!att.base64) return [];
      return [
        {
          url: ensureDataUri(att.base64, att.mime ?? "application/octet-stream"),
          type: att.type,
          isCorrective: true,
        },
      ];
    });

    try {
      await rejectMutation.mutateAsync({
        reason: rejectionNote.trim(),
        ...(media.length ? { media } : {}),
      });
      setShowReject(false);
      setRejectionNote("");
      setRejectionAttachments([]);
      Alert.alert("Rejection sent");
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Could not reject task");
    }
  };

  const formattedMeta = useMemo(
    () => [
      { label: texts.meta.project, value: task?.projectName || task?.projectId },
      { label: texts.meta.department, value: task?.departmentName || task?.departmentId },
      { label: texts.meta.category, value: task?.categoryName || task?.categoryId },
      { label: texts.meta.company, value: task?.companyName || task?.companyId },
      { label: texts.meta.supervisor, value: task?.supervisorName || task?.supervisorId },
      {
        label: texts.meta.status,
        value: task?.status
          ? texts.statuses[task.status as keyof DrawerTexts["statuses"]] ?? texts.statuses.UNKNOWN
          : undefined,
      },
      { label: texts.meta.deadline, value: formatDate(task?.deadline) },
      { label: texts.meta.created, value: formatDate(task?.createdAt) },
    ],
    [task, texts]
  );

  const media = task?.media ?? [];
  const initialMedia = media.filter((m) => !m.isCorrective);
  const correctiveMedia = media.filter((m) => m.isCorrective);
  const hasAnswer = Boolean(task?.supervisorAnswer) || correctiveMedia.length > 0;
  const isAssignee = task?.supervisorId === user?.id;
  const isCreator = task?.createdByUserId === user?.id;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={onClose}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
          <View style={{ flex: 1, backgroundColor: palette.background, paddingTop: 48 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <View>
                <Text style={{ color: palette.text, fontSize: 18, fontWeight: "800" }}>
                  {texts.headerTitle}
                </Text>
                <Text style={{ color: palette.muted, fontSize: 12 }}>{texts.headerSubtitle}</Text>
              </View>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={22} color={palette.text} />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={palette.primary} />
                <Text style={{ color: palette.muted, marginTop: 8 }}>{texts.loading}</Text>
              </View>
            ) : !task ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: palette.muted }}>{texts.notFound}</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                <View style={{ gap: 6 }}>
                  <Text style={{ color: palette.primary, fontSize: 20, fontWeight: "800" }}>
                    {task.categoryName || texts.headerTitle}
                  </Text>
                </View>

                <View
                  style={{
                    gap: 10,
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: 12,
                    padding: 12,
                    backgroundColor: theme.cardBg,
                  }}
                >
                  <Text style={{ color: palette.text, fontWeight: "700", marginBottom: 6 }}>
                    {task.description || texts.descriptionFallback}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {task.categoryName ? <Tag label={task.categoryName} colors={palette} theme={theme} /> : null}
                    {task.companyName ? <Tag label={task.companyName} colors={palette} theme={theme} /> : null}
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  {formattedMeta
                    .filter((m) => m.value)
                    .map((m) => (
                      <InfoRow key={m.label} label={m.label} value={String(m.value)} colors={palette} />
                    ))}
                </View>

                {initialMedia.length ? (
                  <View style={{ gap: 10 }}>
                    <Text style={{ color: palette.text, fontWeight: "700", fontSize: 16 }}>
                      {texts.mediaTitle}
                    </Text>
                    {initialMedia.map((item) => (
                      <TaskMediaItem key={item.id} media={item} label="Initial evidence" theme={theme} colors={palette} />
                    ))}
                  </View>
                ) : null}

                {hasAnswer ? (
                  <View
                    style={{
                      gap: 8,
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 12,
                      padding: 12,
                      backgroundColor: theme.cardBg,
                    }}
                  >
                    <Text style={{ color: palette.text, fontWeight: "800", fontSize: 16 }}>
                      {texts.answerTitle}
                    </Text>
                    {task.supervisorAnswer ? (
                      <Text style={{ color: palette.text }}>{task.supervisorAnswer}</Text>
                    ) : null}
                    {task.answeredAt ? (
                      <Text style={{ color: palette.muted, fontSize: 12 }}>{formatDate(task.answeredAt)}</Text>
                    ) : null}
                    {correctiveMedia.length ? (
                      <View style={{ gap: 8 }}>
                        {correctiveMedia.map((item) => (
                          <TaskMediaItem key={item.id} media={item} label="Corrective action" theme={theme} colors={palette} />
                        ))}
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {task.rejectionReason ? (
                  <View
                    style={{
                      gap: 6,
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 12,
                      padding: 12,
                      backgroundColor: theme.cardBg,
                    }}
                  >
                    <Text style={{ color: palette.text, fontWeight: "800", fontSize: 16 }}>
                      {texts.rejectionLabel}
                    </Text>
                    <Text style={{ color: palette.text }}>{task.rejectionReason}</Text>
                  </View>
                ) : null}

                {isAssignee && task.status !== "CLOSED" ? (
                  <Button
                    label={texts.sendAnswer}
                    onPress={() => setAnswerOpen(true)}
                    fullWidth
                    style={{ backgroundColor: palette.primary, borderColor: palette.primary }}
                  />
                ) : null}

                {isCreator && (task.status === "FIXED_PENDING_CHECK" || task.status === "REJECTED") ? (
                  <View style={{ gap: 10 }}>
                    <Button
                      label={texts.closeTask}
                      onPress={closeForUser}
                      loading={closeMutation.isPending}
                      fullWidth
                      backgroundColor={palette.success}
                      borderColor={palette.success}
                    />
                    <Button
                      label={texts.rejectTask}
                      onPress={() => setShowReject((v) => !v)}
                      fullWidth
                      variant="ghost"
                      borderColor={palette.danger}
                      textColor={palette.danger}
                    />
                    {showReject ? (
                      <View style={{ gap: 8 }}>
                        <TextInput
                          value={rejectionNote}
                          onChangeText={setRejectionNote}
                          placeholder={texts.rejectPlaceholder}
                          placeholderTextColor={palette.muted}
                          multiline
                          style={{
                            minHeight: 120,
                            color: palette.text,
                            backgroundColor: theme.surface,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: theme.border,
                            padding: 12,
                            textAlignVertical: "top",
                          }}
                        />

                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                          <PickButton label={texts.addRejectImage} onPress={pickRejectImage} />
                          <PickButton label={texts.addRejectFile} onPress={pickRejectFile} />
                        </View>

                        {rejectionAttachments.length ? (
                          <View style={{ gap: 8 }}>
                            {rejectionAttachments.map((att, idx) => (
                              <View
                                key={`${att.uri}-${idx}`}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: 10,
                                  borderRadius: 10,
                                  borderWidth: 1,
                                  borderColor: theme.border,
                                }}
                              >
                                <Text style={{ color: palette.text, flex: 1 }}>
                                  {att.type === "IMAGE" ? "Image" : "File"} {idx + 1}
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    setRejectionAttachments((prev) => prev.filter((_, i) => i !== idx))
                                  }
                                  hitSlop={8}
                                >
                                  <Ionicons name="trash-outline" size={18} color={palette.danger} />
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        ) : (
                          <Text style={{ color: palette.muted, fontSize: 12 }}>{texts.attachmentsEmpty}</Text>
                        )}

                        <Button
                          label={texts.sendReject}
                          onPress={rejectForUser}
                          loading={rejectMutation.isPending}
                          fullWidth
                          style={{ backgroundColor: palette.danger, borderColor: palette.danger }}
                        />
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {task ? (
        <AnswerModal visible={answerOpen} onClose={() => setAnswerOpen(false)} onSubmit={sendAnswer} />
      ) : null}
    </>
  );
}

const InfoRow = ({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>["colors"];
}) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
    <Text style={{ color: colors.muted, fontWeight: "700" }}>{label}</Text>
    <Text
      style={{
        color: colors.text,
        fontWeight: "700",
        flex: 1,
        textAlign: "right",
        textTransform: "uppercase",
      }}
    >
      {value}
    </Text>
  </View>
);

const Tag = ({
  label,
  colors,
  theme,
}: {
  label: string;
  colors: ReturnType<typeof useTheme>["colors"];
  theme: ThemeTokens;
}) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.chipBg,
      borderColor: theme.border,
      borderWidth: 1,
    }}
  >
    <Text style={{ color: colors.text, fontSize: 12 }}>{label}</Text>
  </View>
);

const PickButton = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.subtle,
        backgroundColor: colors.surface,
      }}
      activeOpacity={0.85}
    >
      <Text style={{ color: colors.text, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
};

const TaskMediaItem = ({
  media,
  label,
  theme,
  colors,
}: {
  media: NonNullable<TaskDto["media"]>[number];
  label: string;
  theme: ThemeTokens;
  colors: ReturnType<typeof useTheme>["colors"];
}) => {
  const [open, setOpen] = useState(false);
  const isImage = media.type === "IMAGE";
  const isFile = media.type === "FILE";

  const getUri = () => {
    if (!media.url) return "";
    if (
      media.url.startsWith("http://") ||
      media.url.startsWith("https://") ||
      media.url.startsWith("file://") ||
      media.url.startsWith("data:") ||
      media.url.startsWith("blob:")
    ) {
      return media.url;
    }
    const cleaned = media.url.replace(/^data:image\/[a-z]+;base64,/i, "");
    return `data:image/jpeg;base64,${cleaned}`;
  };

  const uri = getUri();

  return (
    <View
      style={{
        gap: 10,
        borderRadius: 12,
        backgroundColor: theme.cardBg,
        borderWidth: 1,
        borderColor: theme.border,
        padding: 10,
      }}
    >
      {isFile ? (
        <View
          style={{
            width: "100%",
            height: 160,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.surface,
          }}
        >
          <Ionicons name="document-outline" size={44} color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 8 }}>File</Text>
        </View>
      ) : isImage ? (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setOpen(true)}
            style={{ borderRadius: 10, overflow: "hidden" }}
          >
            <Image
              source={{ uri }}
              style={{ width: "100%", height: 220, backgroundColor: theme.surface }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Modal
            visible={open}
            transparent
            presentationStyle="overFullScreen"
            onRequestClose={() => setOpen(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.9)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={{ position: "absolute", top: 50, right: 24 }} onPress={() => setOpen(false)}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Image source={{ uri }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
            </View>
          </Modal>
        </>
      ) : (
        <View
          style={{
            width: "100%",
            height: 220,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.surface,
          }}
        >
          <Ionicons name="videocam-outline" size={48} color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 8 }}>Video</Text>
        </View>
      )}
      <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
    </View>
  );
};

const formatDate = (val?: string) => {
  if (!val) return "";
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
};
