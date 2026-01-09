import type { TFunction } from "i18next";
import { AlertTriangle, CheckCircle2, Clock, RotateCcw } from "lucide-react";

export const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export type StatusCardConfig = {
  id: string;
  status: string;
  label: string;
  shortLabel: string;
  icon: typeof Clock;
  gradient: string;
};

export function buildStatusCardConfig(t: TFunction): StatusCardConfig[] {
  return [
    {
      id: "NEW",
      status: "NEW",
      label: t("dashboard.newObservations") || "New Observations",
      shortLabel: t("dashboard.new") || "New",
      icon: Clock,
      gradient: "from-[#32586E] to-[#264454]",
    },
    {
      id: "SEEN_BY_SUPERVISOR",
      status: "SEEN_BY_SUPERVISOR",
      label: t("dashboard.seenBySupervisor") || "Seen By Supervisor",
      shortLabel: t("dashboard.seenBySupervisor") || "Seen",
      icon: CheckCircle2,
      gradient: "from-[#5D8E6D] to-[#4A7157]",
    },
    {
      id: "IN_PROGRESS",
      status: "IN_PROGRESS",
      label: t("dashboard.inProgress") || "In Progress",
      shortLabel: t("dashboard.inProgress") || "In Progress",
      icon: RotateCcw,
      gradient: "from-[#4A7D9E] to-[#376380]",
    },
    {
      id: "FIXED_PENDING_CHECK",
      status: "FIXED_PENDING_CHECK",
      label: t("dashboard.fixedPendingCheck") || "Fixed Pending Check",
      shortLabel: t("dashboard.pendingCheck") || "Pending Check",
      icon: Clock,
      gradient: "from-[#8B7D4F] to-[#6E6340]",
    },
    {
      id: "REJECTED",
      status: "REJECTED",
      label: t("dashboard.rejected") || "Rejected",
      shortLabel: t("dashboard.rejected") || "Rejected",
      icon: AlertTriangle,
      gradient: "from-[#6E2E34] to-[#58252A]",
    },
    {
      id: "CLOSED",
      status: "CLOSED",
      label: t("dashboard.closedObservations") || "Closed Observations",
      shortLabel: t("dashboard.closed") || "Closed",
      icon: CheckCircle2,
      gradient: "from-[#5D8E6D] to-[#4A7157]",
    },
  ];
}
