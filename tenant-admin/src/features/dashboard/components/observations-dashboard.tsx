import { useMemo, useState, useRef, useEffect } from "react";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileImage,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useObservationsQuery } from "@/features/observations/api/hooks";
import { useTasksQuery } from "@/features/tasks/api/hooks";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type DateRange = {
  startDate: string;
  endDate: string;
};

export function ObservationsDashboard() {
  const { t } = useTranslation();
  const { data: observations, isLoading } = useObservationsQuery();
  const { data: tasks } = useTasksQuery();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<number | "all">(
    "all"
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>(["projects"]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Tasks Dashboard State
  const [taskDateRange, setTaskDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
  const [selectedTaskCreator, setSelectedTaskCreator] = useState<
    string | "all"
  >("all");
  const [currentTaskSlide, setCurrentTaskSlide] = useState(0);
  const [isTaskPaused, setIsTaskPaused] = useState(false);
  const [selectedTaskCharts, setSelectedTaskCharts] = useState<string[]>([
    "projects",
  ]);
  const [showTaskExportMenu, setShowTaskExportMenu] = useState(false);
  const taskExportRef = useRef<HTMLDivElement>(null);

  const chartOptions = [
    { id: "projects", label: t("dashboard.observationsByProject"), icon: "📊" },
    {
      id: "departments",
      label: t("dashboard.observationsByDepartment"),
      icon: "🏢",
    },
    {
      id: "categories",
      label:
        t("dashboard.observationsByCategory") || "Observations by Category",
      icon: "🏷",
    },
    {
      id: "locations",
      label: t("dashboard.observationsByLocation"),
      icon: "📍",
    },
    { id: "supervisors", label: t("dashboard.top5Supervisors"), icon: "👥" },
  ];

  const toggleChart = (chartId: string) => {
    setSelectedCharts((prev) =>
      prev.includes(chartId)
        ? prev.filter((id) => id !== chartId)
        : [...prev, chartId]
    );
  };

  // Filter observations based on date range and risk level
  const filteredObservations = useMemo(() => {
    if (!observations) return [];

    let filtered = observations;

    if (dateRange.startDate) {
      filtered = filtered.filter((obs) => {
        const createdAt = obs.createdAt ? new Date(obs.createdAt) : null;
        return createdAt && createdAt >= new Date(dateRange.startDate);
      });
    }

    if (dateRange.endDate) {
      filtered = filtered.filter((obs) => {
        const createdAt = obs.createdAt ? new Date(obs.createdAt) : null;
        return createdAt && createdAt <= new Date(dateRange.endDate);
      });
    }

    if (selectedRiskLevel !== "all") {
      filtered = filtered.filter((obs) => obs.riskLevel === selectedRiskLevel);
    }

    return filtered;
  }, [observations, dateRange, selectedRiskLevel]);

  // Status card configuration
  const statusCardConfig = useMemo(
    () => [
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
    ],
    [t]
  );

  // Calculate stats by status
  const statusStats = useMemo(() => {
    const stats = statusCardConfig.map((config) => ({
      ...config,
      count: filteredObservations.filter((obs) => obs.status === config.status)
        .length,
    }));

    // Filter to only show cards with count > 0
    return stats.filter((stat) => stat.count > 0);
  }, [filteredObservations, statusCardConfig]);

  // Dynamic total slides based on status cards
  const totalSlides = statusStats.length;

  // Department data for chart
  const departmentData = useMemo(() => {
    const departmentMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const deptName = obs.department?.name || "Unknown";
      departmentMap.set(deptName, (departmentMap.get(deptName) || 0) + 1);
    });

    return Array.from(departmentMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  // Project data for chart
  const projectData = useMemo(() => {
    const projectMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const projectName = obs.project?.name || "Unknown";
      projectMap.set(projectName, (projectMap.get(projectName) || 0) + 1);
    });

    return Array.from(projectMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  // Location data
  const locationData = useMemo(() => {
    const locationMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const locationName = obs.location?.name || "Unknown";
      locationMap.set(locationName, (locationMap.get(locationName) || 0) + 1);
    });

    return Array.from(locationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  // Category data
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const categoryName = obs.category?.categoryName || "Uncategorized";
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  // Top 5 Supervisors data
  const supervisorData = useMemo(() => {
    const supervisorMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const supervisorName = obs.supervisor?.fullName || "Unassigned";
      supervisorMap.set(
        supervisorName,
        (supervisorMap.get(supervisorName) || 0) + 1
      );
    });

    return Array.from(supervisorMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredObservations]);

  const CHART_COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  // ========== TASKS CALCULATIONS ==========

  // Filter tasks based on date range and task creator
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    let filtered = tasks;

    if (taskDateRange.startDate) {
      filtered = filtered.filter((task) => {
        const createdAt = task.createdAt ? new Date(task.createdAt) : null;
        return createdAt && createdAt >= new Date(taskDateRange.startDate);
      });
    }

    if (taskDateRange.endDate) {
      filtered = filtered.filter((task) => {
        const createdAt = task.createdAt ? new Date(task.createdAt) : null;
        return createdAt && createdAt <= new Date(taskDateRange.endDate);
      });
    }

    if (selectedTaskCreator !== "all") {
      filtered = filtered.filter(
        (task) => task.createdByUserId === selectedTaskCreator
      );
    }

    return filtered;
  }, [tasks, taskDateRange, selectedTaskCreator]);

  // Task creators for filter dropdown
  const taskCreators = useMemo(() => {
    if (!tasks) return [];
    const creatorsMap = new Map<string, { id: string; name: string }>();
    tasks.forEach((task) => {
      if (task.createdBy) {
        creatorsMap.set(task.createdBy.id, {
          id: task.createdBy.id,
          name: task.createdBy.fullName,
        });
      }
    });
    return Array.from(creatorsMap.values());
  }, [tasks]);

  // Task status stats
  const taskStatusStats = useMemo(() => {
    const stats = statusCardConfig.map((config) => ({
      ...config,
      count: filteredTasks.filter((task) => task.status === config.status)
        .length,
    }));
    return stats.filter((stat) => stat.count > 0);
  }, [filteredTasks, statusCardConfig]);

  const totalTaskSlides = taskStatusStats.length;

  // Task data by project
  const taskProjectData = useMemo(() => {
    const projectMap = new Map<string, number>();
    filteredTasks.forEach((task) => {
      const projectName = task.project?.name || "Unknown";
      projectMap.set(projectName, (projectMap.get(projectName) || 0) + 1);
    });
    return Array.from(projectMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTasks]);

  // Task data by department
  const taskDepartmentData = useMemo(() => {
    const departmentMap = new Map<string, number>();
    filteredTasks.forEach((task) => {
      const deptName = task.department?.name || "Unknown";
      departmentMap.set(deptName, (departmentMap.get(deptName) || 0) + 1);
    });
    return Array.from(departmentMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTasks]);

  // Task supervisors data
  const taskSupervisorData = useMemo(() => {
    const supervisorMap = new Map<string, number>();
    filteredTasks.forEach((task) => {
      const supervisorName = task.supervisor?.fullName || "Unassigned";
      supervisorMap.set(
        supervisorName,
        (supervisorMap.get(supervisorName) || 0) + 1
      );
    });
    return Array.from(supervisorMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredTasks]);

  // Task category data
  const taskCategoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    filteredTasks.forEach((task) => {
      const categoryName = task.category?.categoryName || "Uncategorized";
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTasks]);

  const taskChartOptions = [
    {
      id: "projects",
      label: t("dashboard.tasksByProject") || "Tasks by Project",
      icon: "📊",
    },
    {
      id: "departments",
      label: t("dashboard.tasksByDepartment") || "Tasks by Department",
      icon: "🏢",
    },
    {
      id: "categories",
      label: t("dashboard.tasksByCategory") || "Tasks by Category",
      icon: "🏷",
    },
    {
      id: "supervisors",
      label: t("dashboard.top5TaskSupervisors") || "Top 5 Supervisors",
      icon: "👥",
    },
  ];

  const toggleTaskChart = (chartId: string) => {
    setSelectedTaskCharts((prev) =>
      prev.includes(chartId)
        ? prev.filter((id) => id !== chartId)
        : [...prev, chartId]
    );
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, startDate: e.target.value }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, endDate: e.target.value }));
  };

  const resetFilters = () => {
    setDateRange({ startDate: "", endDate: "" });
    setSelectedRiskLevel("all");
  };

  // Tasks Dashboard Handlers
  const handleTaskStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTaskDateRange((prev) => ({ ...prev, startDate: e.target.value }));
  };

  const handleTaskEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDateRange((prev) => ({ ...prev, endDate: e.target.value }));
  };

  const resetTaskFilters = () => {
    setTaskDateRange({ startDate: "", endDate: "" });
    setSelectedTaskCreator("all");
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % totalSlides;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  };

  // Task slide navigation
  const goToTaskSlide = (index: number) => {
    setCurrentTaskSlide(index);
  };

  const nextTaskSlide = () => {
    const next = (currentTaskSlide + 1) % totalTaskSlides;
    goToTaskSlide(next);
  };

  const prevTaskSlide = () => {
    const prev = (currentTaskSlide - 1 + totalTaskSlides) % totalTaskSlides;
    goToTaskSlide(prev);
  };

  // Reset slide if it exceeds total slides
  useEffect(() => {
    if (currentSlide >= totalSlides && totalSlides > 0) {
      setCurrentSlide(0);
    }
  }, [totalSlides, currentSlide]);

  // Autoplay
  useEffect(() => {
    if (!isPaused && totalSlides > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentSlide, isPaused, totalSlides]);

  // Task slide reset if it exceeds total
  useEffect(() => {
    if (currentTaskSlide >= totalTaskSlides && totalTaskSlides > 0) {
      setCurrentTaskSlide(0);
    }
  }, [totalTaskSlides, currentTaskSlide]);

  // Task autoplay
  useEffect(() => {
    if (!isTaskPaused && totalTaskSlides > 0) {
      const interval = setInterval(() => {
        nextTaskSlide();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentTaskSlide, isTaskPaused, totalTaskSlides]);

  // Export to Excel
  const exportToExcel = async () => {
    try {
      const XLSX = await import("xlsx");

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Stats data by status
      const statsData = [
        ["Status", "Count"],
        ...statusStats.map((stat) => [stat.label, stat.count]),
        ["", ""],
        ["Total Observations", filteredObservations.length],
      ];
      const statsWs = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(wb, statsWs, "Statistics");

      // Add selected charts data
      if (selectedCharts.includes("projects") && projectData.length > 0) {
        const projectsData = [
          ["Project", "Count"],
          ...projectData.map((p) => [p.name, p.count]),
        ];
        const projectsWs = XLSX.utils.aoa_to_sheet(projectsData);
        XLSX.utils.book_append_sheet(wb, projectsWs, "Projects");
      }

      if (selectedCharts.includes("departments") && departmentData.length > 0) {
        const deptData = [
          ["Department", "Count"],
          ...departmentData.map((d) => [d.name, d.count]),
        ];
        const deptWs = XLSX.utils.aoa_to_sheet(deptData);
        XLSX.utils.book_append_sheet(wb, deptWs, "Departments");
      }

      if (selectedCharts.includes("categories") && categoryData.length > 0) {
        const catData = [
          ["Category", "Count"],
          ...categoryData.map((c) => [c.name, c.count]),
        ];
        const catWs = XLSX.utils.aoa_to_sheet(catData);
        XLSX.utils.book_append_sheet(wb, catWs, "Categories");
      }

      if (selectedCharts.includes("locations") && locationData.length > 0) {
        const locData = [
          ["Location", "Count"],
          ...locationData.map((l) => [l.name, l.count]),
        ];
        const locWs = XLSX.utils.aoa_to_sheet(locData);
        XLSX.utils.book_append_sheet(wb, locWs, "Locations");
      }

      if (selectedCharts.includes("supervisors") && supervisorData.length > 0) {
        const supData = [
          ["Supervisor", "Count"],
          ...supervisorData.map((s) => [s.name, s.count]),
        ];
        const supWs = XLSX.utils.aoa_to_sheet(supData);
        XLSX.utils.book_append_sheet(wb, supWs, "Supervisors");
      }

      // Download
      XLSX.writeFile(
        wb,
        `Observations_Dashboard_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      setShowExportMenu(false);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel. Please try again.");
    }
  };

  // Export to JPG
  const exportToJPG = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;

      if (exportRef.current) {
        const canvas = await html2canvas(exportRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const link = document.createElement("a");
        link.download = `Observations_Dashboard_${
          new Date().toISOString().split("T")[0]
        }.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
        setShowExportMenu(false);
      }
    } catch (error) {
      console.error("Error exporting to JPG:", error);
      alert("Failed to export to JPG. Please try again.");
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      if (exportRef.current) {
        const canvas = await html2canvas(exportRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(
          `Observations_Dashboard_${new Date().toISOString().split("T")[0]}.pdf`
        );
        setShowExportMenu(false);
      }
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF. Please try again.");
    }
  };

  // ========== TASKS EXPORT FUNCTIONS ==========

  // Export Tasks to Excel
  const exportTasksToExcel = async () => {
    try {
      const XLSX = await import("xlsx");

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Stats data by status
      const statsData = [
        ["Status", "Count"],
        ...taskStatusStats.map((stat) => [stat.label, stat.count]),
        ["", ""],
        ["Total Tasks", filteredTasks.length],
      ];
      const statsWs = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(wb, statsWs, "Statistics");

      // Add selected charts data
      if (
        selectedTaskCharts.includes("projects") &&
        taskProjectData.length > 0
      ) {
        const projectsData = [
          ["Project", "Count"],
          ...taskProjectData.map((p) => [p.name, p.count]),
        ];
        const projectsWs = XLSX.utils.aoa_to_sheet(projectsData);
        XLSX.utils.book_append_sheet(wb, projectsWs, "Projects");
      }

      if (
        selectedTaskCharts.includes("departments") &&
        taskDepartmentData.length > 0
      ) {
        const deptData = [
          ["Department", "Count"],
          ...taskDepartmentData.map((d) => [d.name, d.count]),
        ];
        const deptWs = XLSX.utils.aoa_to_sheet(deptData);
        XLSX.utils.book_append_sheet(wb, deptWs, "Departments");
      }

      if (
        selectedTaskCharts.includes("categories") &&
        taskCategoryData.length > 0
      ) {
        const catData = [
          ["Category", "Count"],
          ...taskCategoryData.map((c) => [c.name, c.count]),
        ];
        const catWs = XLSX.utils.aoa_to_sheet(catData);
        XLSX.utils.book_append_sheet(wb, catWs, "Categories");
      }

      if (
        selectedTaskCharts.includes("supervisors") &&
        taskSupervisorData.length > 0
      ) {
        const supData = [
          ["Supervisor", "Count"],
          ...taskSupervisorData.map((s) => [s.name, s.count]),
        ];
        const supWs = XLSX.utils.aoa_to_sheet(supData);
        XLSX.utils.book_append_sheet(wb, supWs, "Supervisors");
      }

      // Download
      XLSX.writeFile(
        wb,
        `Tasks_Dashboard_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      setShowTaskExportMenu(false);
    } catch (error) {
      console.error("Error exporting tasks to Excel:", error);
      alert("Failed to export to Excel. Please try again.");
    }
  };

  // Export Tasks to JPG
  const exportTasksToJPG = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;

      if (taskExportRef.current) {
        const canvas = await html2canvas(taskExportRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const link = document.createElement("a");
        link.download = `Tasks_Dashboard_${
          new Date().toISOString().split("T")[0]
        }.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
        setShowTaskExportMenu(false);
      }
    } catch (error) {
      console.error("Error exporting tasks to JPG:", error);
      alert("Failed to export to JPG. Please try again.");
    }
  };

  // Export Tasks to PDF
  const exportTasksToPDF = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      if (taskExportRef.current) {
        const canvas = await html2canvas(taskExportRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(
          `Tasks_Dashboard_${new Date().toISOString().split("T")[0]}.pdf`
        );
        setShowTaskExportMenu(false);
      }
    } catch (error) {
      console.error("Error exporting tasks to PDF:", error);
      alert("Failed to export to PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          {t("dashboard.loadingObservations")}
        </p>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight uppercase">
          {t("dashboard.observationsDashboard")}
        </h2>

        {/* Export Dropdown */}
        <div
          className="relative export-dropdown"
          onClick={() => setShowExportMenu((prev) => !prev)}
        >
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <Download className="h-4 w-4" />
            {t("dashboard.export")}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showExportMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl z-50 overflow-hidden animate-fadeIn">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>{t("dashboard.exportToExcel")}</span>
              </button>
              <button
                onClick={exportToJPG}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors border-t border-border/60"
              >
                <FileImage className="h-4 w-4 text-blue-600" />
                <span>{t("dashboard.exportToJPG")}</span>
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors border-t border-border/60"
              >
                <FileText className="h-4 w-4 text-red-600" />
                <span>{t("dashboard.exportToPDF")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Filters and Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4">
        {/* Filters & Chart Selection - Left Side */}
        <div className="space-y-4">
          {/* Compact Filters Card */}
          <Card className="border-border/50 shadow-lg bg-card">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Date Range - Compact */}
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm flex-1 min-w-[200px]">
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("dashboard.from")}
                      </span>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={handleStartDateChange}
                        className="text-xs font-medium border-0 p-0 focus:outline-none focus:ring-0 bg-transparent w-full"
                      />
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("dashboard.to")}
                      </span>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={handleEndDateChange}
                        className="text-xs font-medium border-0 p-0 focus:outline-none focus:ring-0 bg-transparent w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Risk Level - Compact */}
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm min-w-[180px]">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <select
                    value={selectedRiskLevel}
                    onChange={(e) =>
                      setSelectedRiskLevel(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value)
                      )
                    }
                    className="text-xs font-medium border-0 p-0 focus:outline-none focus:ring-0 bg-transparent flex-1"
                  >
                    <option value="all">{t("dashboard.allLevels")}</option>
                    <option value="1">{t("dashboard.level1Low")}</option>
                    <option value="2">{t("dashboard.level2")}</option>
                    <option value="3">{t("dashboard.level3Medium")}</option>
                    <option value="4">{t("dashboard.level4")}</option>
                    <option value="5">{t("dashboard.level5High")}</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-3 py-2 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t("dashboard.reset")}
                </button>

                {/* Count Badge */}
                <div className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                  {filteredObservations.length} / {observations?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Selection - Premium Pills */}
          <Card className="border-border/50 shadow-lg bg-card">
            <CardContent className="pt-4 pb-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-purple-500" />
                  <span className="text-xs font-semibold text-foreground">
                    {t("dashboard.selectChartsToDisplay")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {chartOptions.map((chart) => (
                    <button
                      key={chart.id}
                      onClick={() => toggleChart(chart.id)}
                      className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                        selectedCharts.includes(chart.id)
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105"
                          : "bg-card border border-border text-foreground hover:border-primary/40 hover:bg-muted/60"
                      }`}
                    >
                      <span className="text-base">{chart.icon}</span>
                      <span>{chart.label}</span>
                      {selectedCharts.includes(chart.id) && (
                        <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards Slider - Right Side (40%) */}
        <Card className="border-border/50 shadow-lg bg-card overflow-hidden">
          <CardContent className="p-4">
            {statusStats.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.noObservations")}
                </p>
              </div>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Navigation Arrows */}
                {totalSlides > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg transition-all hover:scale-110 hover:bg-muted/80"
                    >
                      <ChevronLeft className="h-4 w-4 text-foreground" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg transition-all hover:scale-110 hover:bg-muted/80"
                    >
                      <ChevronRight className="h-4 w-4 text-foreground" />
                    </button>
                  </>
                )}

                {/* Slider Container */}
                <div
                  className={`overflow-hidden ${
                    totalSlides > 1 ? "px-10" : ""
                  }`}
                >
                  <div
                    className="flex gap-3 transition-all duration-700 ease-in-out"
                    style={{
                      transform: `translateX(calc(-${currentSlide * 100}% - ${
                        currentSlide * 12
                      }px))`,
                    }}
                  >
                    {/* Dynamic Status Cards */}
                    {statusStats.map((stat) => {
                      const IconComponent = stat.icon;
                      return (
                        <div key={stat.id} className="w-full flex-shrink-0">
                          <div
                            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 shadow-xl text-white`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2.5">
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div className="text-right">
                                <div className="text-5xl font-bold leading-none mb-1">
                                  {stat.count}
                                </div>
                                <div className="text-xs font-medium text-white/80">
                                  {stat.shortLabel}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm font-semibold">
                              {stat.label}
                            </div>
                            <div className="text-xs text-white/70 mt-1">
                              {stat.status.replace(/_/g, " ").toLowerCase()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dots Navigation */}
                {totalSlides > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? "bg-gradient-to-r from-green-500 to-green-600 h-2 w-8 shadow-md"
                            : "bg-border/80 hover:bg-border h-2 w-2"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Charts Section - Only show selected charts */}
      {selectedCharts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Projects Chart */}
          {selectedCharts.includes("projects") && (
            <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByProject")}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("dashboard.distributionAcrossProjects")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projectData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Pie
                          data={projectData}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          label={(entry) => entry.name}
                        >
                          {projectData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Departments Chart */}
          {selectedCharts.includes("departments") && (
            <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏢</span>
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByDepartment")}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("dashboard.distributionAcrossDepartments")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {departmentData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#3b82f6"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Categories Chart */}
          {selectedCharts.includes("categories") && (
            <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏷</span>
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByCategory") ||
                      "Observations by Category"}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("dashboard.distributionAcrossCategories") ||
                    "Distribution across categories"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                          {categoryData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Locations Chart */}
          {selectedCharts.includes("locations") && (
            <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByLocation")}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("dashboard.numberOfObservationsAtEachLocation")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {locationData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={locationData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                        layout="horizontal"
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                          {locationData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Supervisors Chart */}
          {selectedCharts.includes("supervisors") && (
            <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <CardTitle className="text-base">
                    {t("dashboard.top5Supervisors")}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("dashboard.supervisorsWithMostObservations")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {supervisorData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={supervisorData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#10b981"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Hidden Export Layout */}
      <div
        ref={exportRef}
        className="fixed left-[-9999px] top-0 w-[1400px] bg-white p-8 space-y-6"
      >
        {/* Export Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-tight">
            {t("dashboard.observationsDashboard")}
          </h1>
        </div>

        {/* Stats Cards - Dynamic based on status */}
        <div
          className={`grid gap-4 mb-6 ${
            statusStats.length <= 3
              ? "grid-cols-3"
              : statusStats.length === 4
              ? "grid-cols-4"
              : "grid-cols-3"
          }`}
        >
          {statusStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 shadow-xl text-white`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-bold leading-none mb-2">
                      {stat.count}
                    </div>
                    <div className="text-sm font-medium text-white/80">
                      {stat.shortLabel}
                    </div>
                  </div>
                </div>
                <div className="text-base font-semibold">{stat.label}</div>
                <div className="text-sm text-white/70 mt-1">
                  {stat.status.replace(/_/g, " ").toLowerCase()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Charts Only */}
        {selectedCharts.length > 0 && (
          <div className="grid gap-6 grid-cols-2">
            {/* Projects Chart */}
            {selectedCharts.includes("projects") && (
              <Card className="border-border/50 shadow-lg bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <CardTitle className="text-lg">
                      {t("dashboard.observationsByProject")}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t("dashboard.distributionAcrossProjects")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projectData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.noDataAvailable")}
                      </p>
                    </div>
                  ) : (
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip />
                          <Pie
                            data={projectData}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={2}
                            label={(entry) => entry.name}
                          >
                            {projectData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Departments Chart */}
            {selectedCharts.includes("departments") && (
              <Card className="border-border/50 shadow-lg bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏢</span>
                    <CardTitle className="text-lg">
                      {t("dashboard.observationsByDepartment")}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t("dashboard.distributionAcrossDepartments")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {departmentData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.noDataAvailable")}
                      </p>
                    </div>
                  ) : (
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={departmentData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar
                            dataKey="count"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Categories Chart */}
            {selectedCharts.includes("categories") && (
              <Card className="border-border/50 shadow-lg bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏷</span>
                    <CardTitle className="text-lg">
                      {t("dashboard.observationsByCategory") ||
                        "Observations by Category"}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t("dashboard.distributionAcrossCategories") ||
                      "Distribution across categories"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.noDataAvailable")}
                      </p>
                    </div>
                  ) : (
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {categoryData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Locations Chart */}
            {selectedCharts.includes("locations") && (
              <Card className="border-border/50 shadow-lg bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    <CardTitle className="text-lg">
                      {t("dashboard.observationsByLocation")}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t("dashboard.numberOfObservationsAtEachLocation")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {locationData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.noDataAvailable")}
                      </p>
                    </div>
                  ) : (
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={locationData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {locationData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Supervisors Chart */}
            {selectedCharts.includes("supervisors") && (
              <Card className="border-border/50 shadow-lg bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <CardTitle className="text-lg">
                      {t("dashboard.top5Supervisors")}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t("dashboard.supervisorsWithMostObservations")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {supervisorData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.noDataAvailable")}
                      </p>
                    </div>
                  ) : (
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={supervisorData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar
                            dataKey="count"
                            fill="#10b981"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Elegant Divider */}

      {/* TASKS DASHBOARD */}
      <div className="space-y-6">
        {/* Header with Export Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight uppercase">
            {t("dashboard.tasksDashboard")}
          </h2>

          {/* Export Dropdown for Tasks */}
          <div
            className="relative export-dropdown"
            onClick={() => setShowTaskExportMenu((prev) => !prev)}
          >
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105">
              <Download className="h-4 w-4" />
              {t("dashboard.export")}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showTaskExportMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showTaskExportMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl z-50 overflow-hidden animate-fadeIn">
                <button
                  onClick={exportTasksToExcel}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <span>{t("dashboard.exportToExcel")}</span>
                </button>
                <button
                  onClick={exportTasksToJPG}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors border-t border-border/60"
                >
                  <FileImage className="h-4 w-4 text-blue-600" />
                  <span>{t("dashboard.exportToJPG")}</span>
                </button>
                <button
                  onClick={exportTasksToPDF}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors border-t border-border/60"
                >
                  <FileText className="h-4 w-4 text-red-600" />
                  <span>{t("dashboard.exportToPDF")}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Premium Filters and Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4">
          {/* Filters & Chart Selection - Left Side */}
          <div className="space-y-4">
            {/* Compact Filters Card */}
            <Card className="border-border/50 shadow-lg bg-card">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Date Range - Compact */}
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm flex-1 min-w-[200px]">
                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                          From
                        </span>
                        <input
                          type="date"
                          value={taskDateRange.startDate}
                          onChange={handleTaskStartDateChange}
                          className="text-xs font-medium border-0 p-0 focus:outline-none focus:ring-0 bg-transparent w-full"
                        />
                      </div>
                      <div className="h-4 w-px bg-border" />
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                          To
                        </span>
                        <input
                          type="date"
                          value={taskDateRange.endDate}
                          onChange={handleTaskEndDateChange}
                          className="text-xs font-medium border-0 p-0 focus:outline-none focus:ring-0 bg-transparent w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Task Creator - Compact */}
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm min-w-[180px]">
                    <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <select
                      value={selectedTaskCreator}
                      onChange={(e) => setSelectedTaskCreator(e.target.value)}
                      className="text-xs font-medium border-0 p-0 focus:outline-none focus:ring-0 bg-transparent flex-1"
                    >
                      <option value="all">
                        {t("dashboard.allCreators") || "All Creators"}
                      </option>
                      {taskCreators.map((creator) => (
                        <option key={creator.id} value={creator.id}>
                          {creator.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetTaskFilters}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-3 py-2 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>

                  {/* Count Badge */}
                  <div className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                    {filteredTasks.length} / {tasks?.length || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart Selection - Premium Pills */}
            <Card className="border-border/50 shadow-lg bg-card">
              <CardContent className="pt-4 pb-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-purple-500" />
                    <span className="text-xs font-semibold text-foreground">
                      Select Charts to Display
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {taskChartOptions.map((chart) => (
                      <button
                        key={chart.id}
                        onClick={() => toggleTaskChart(chart.id)}
                        className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                          selectedTaskCharts.includes(chart.id)
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105"
                            : "bg-card border border-border text-foreground hover:border-primary/40 hover:bg-muted/60"
                        }`}
                      >
                        <span className="text-base">{chart.icon}</span>
                        <span>{chart.label}</span>
                        {selectedTaskCharts.includes(chart.id) && (
                          <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards Slider - Right Side (40%) */}
          <Card className="border-border/50 shadow-lg bg-card overflow-hidden">
            <CardContent className="p-4">
              {taskStatusStats.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.noTasks") || "No tasks found"}
                  </p>
                </div>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setIsTaskPaused(true)}
                  onMouseLeave={() => setIsTaskPaused(false)}
                >
                  {/* Navigation Arrows */}
                  {totalTaskSlides > 1 && (
                    <>
                      <button
                        onClick={prevTaskSlide}
                        className="absolute left-0 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg transition-all hover:scale-110 hover:bg-muted/80"
                      >
                        <ChevronLeft className="h-4 w-4 text-foreground" />
                      </button>
                      <button
                        onClick={nextTaskSlide}
                        className="absolute right-0 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg transition-all hover:scale-110 hover:bg-muted/80"
                      >
                        <ChevronRight className="h-4 w-4 text-foreground" />
                      </button>
                    </>
                  )}

                  {/* Slider Container */}
                  <div
                    className={`overflow-hidden ${
                      totalTaskSlides > 1 ? "px-10" : ""
                    }`}
                  >
                    <div
                      className="flex gap-3 transition-all duration-700 ease-in-out"
                      style={{
                        transform: `translateX(calc(-${
                          currentTaskSlide * 100
                        }% - ${currentTaskSlide * 12}px))`,
                      }}
                    >
                      {/* Dynamic Task Status Cards */}
                      {taskStatusStats.map((stat) => {
                        const IconComponent = stat.icon;
                        return (
                          <div key={stat.id} className="w-full flex-shrink-0">
                            <div
                              className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 shadow-xl text-white`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2.5">
                                  <IconComponent className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                  <div className="text-5xl font-bold leading-none mb-1">
                                    {stat.count}
                                  </div>
                                  <div className="text-xs font-medium text-white/80">
                                    {stat.shortLabel}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm font-semibold">
                                {stat.label}
                              </div>
                              <div className="text-xs text-white/70 mt-1">
                                {stat.status.replace(/_/g, " ").toLowerCase()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dots Navigation */}
                  {totalTaskSlides > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      {Array.from({ length: totalTaskSlides }).map(
                        (_, index) => (
                          <button
                            key={index}
                            onClick={() => goToTaskSlide(index)}
                            className={`rounded-full transition-all duration-300 ${
                              currentTaskSlide === index
                                ? "bg-gradient-to-r from-green-500 to-green-600 h-2 w-8 shadow-md"
                                : "bg-border/80 hover:bg-border h-2 w-2"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Task Charts Section */}
        {selectedTaskCharts.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Tasks by Project Chart */}
            {selectedTaskCharts.includes("projects") && (
              <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <CardTitle className="text-base">
                      {taskChartOptions.find((c) => c.id === "projects")?.label}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Distribution across projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {taskProjectData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                      {t("dashboard.noDataAvailable")}
                    </div>
                  ) : (
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Pie
                            data={taskProjectData}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            label={(entry) => entry.name}
                          >
                            {taskProjectData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tasks by Department Chart */}
            {selectedTaskCharts.includes("departments") && (
              <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    <CardTitle className="text-base">
                      {
                        taskChartOptions.find((c) => c.id === "departments")
                          ?.label
                      }
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Distribution across departments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {taskDepartmentData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                      {t("dashboard.noDataAvailable")}
                    </div>
                  ) : (
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={taskDepartmentData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Bar
                            dataKey="count"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tasks by Category Chart */}
            {selectedTaskCharts.includes("categories") && (
              <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏷</span>
                    <CardTitle className="text-base">
                      {
                        taskChartOptions.find((c) => c.id === "categories")
                          ?.label
                      }
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {t("dashboard.distributionAcrossCategories") ||
                      "Distribution across categories"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {taskCategoryData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                      {t("dashboard.noDataAvailable")}
                    </div>
                  ) : (
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={taskCategoryData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {taskCategoryData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Top 5 Task Supervisors Chart */}
            {selectedTaskCharts.includes("supervisors") && (
              <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👥</span>
                    <CardTitle className="text-base">
                      {
                        taskChartOptions.find((c) => c.id === "supervisors")
                          ?.label
                      }
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Supervisors with most tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {taskSupervisorData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                      {t("dashboard.noDataAvailable")}
                    </div>
                  ) : (
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={taskSupervisorData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Bar
                            dataKey="count"
                            fill="#10b981"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Hidden Export Layout for Tasks */}
        <div
          ref={taskExportRef}
          className="fixed left-[-9999px] top-0 w-[1400px] bg-white p-8 space-y-6"
        >
          {/* Export Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold uppercase tracking-tight">
              {t("dashboard.tasksDashboard") || "TASKS DASHBOARD"}
            </h1>
          </div>

          {/* Task Stats Cards - Dynamic based on status */}
          <div
            className={`grid gap-4 mb-6 ${
              taskStatusStats.length <= 3
                ? "grid-cols-3"
                : taskStatusStats.length === 4
                ? "grid-cols-4"
                : "grid-cols-3"
            }`}
          >
            {taskStatusStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.id}
                  className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 shadow-xl text-white`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <div className="text-right">
                      <div className="text-6xl font-bold leading-none mb-2">
                        {stat.count}
                      </div>
                      <div className="text-sm font-medium text-white/80">
                        {stat.shortLabel}
                      </div>
                    </div>
                  </div>
                  <div className="text-base font-semibold">{stat.label}</div>
                  <div className="text-sm text-white/70 mt-1">
                    {stat.status.replace(/_/g, " ").toLowerCase()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Task Charts Only */}
          {selectedTaskCharts.length > 0 && (
            <div className="grid gap-6 grid-cols-2">
              {/* Tasks by Project Chart */}
              {selectedTaskCharts.includes("projects") && (
                <Card className="border-border/50 shadow-lg bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      <CardTitle className="text-lg">
                        {
                          taskChartOptions.find((c) => c.id === "projects")
                            ?.label
                        }
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      Distribution across projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {taskProjectData.length === 0 ? (
                      <div className="flex h-64 items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          {t("dashboard.noDataAvailable")}
                        </p>
                      </div>
                    ) : (
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Tooltip />
                            <Pie
                              data={taskProjectData}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={110}
                              paddingAngle={2}
                              label={(entry) => entry.name}
                            >
                              {taskProjectData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tasks by Department Chart */}
              {selectedTaskCharts.includes("departments") && (
                <Card className="border-border/50 shadow-lg bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏢</span>
                      <CardTitle className="text-lg">
                        {
                          taskChartOptions.find((c) => c.id === "departments")
                            ?.label
                        }
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      Distribution across departments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {taskDepartmentData.length === 0 ? (
                      <div className="flex h-64 items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          {t("dashboard.noDataAvailable")}
                        </p>
                      </div>
                    ) : (
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={taskDepartmentData}
                            margin={{ left: 0, right: 0, top: 10, bottom: 40 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              opacity={0.25}
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={100}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar
                              dataKey="count"
                              fill="#3b82f6"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tasks by Category Chart */}
              {selectedTaskCharts.includes("categories") && (
                <Card className="border-border/50 shadow-lg bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">??</span>
                      <CardTitle className="text-lg">
                        {
                          taskChartOptions.find((c) => c.id === "categories")
                            ?.label
                        }
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {t("dashboard.distributionAcrossCategories") ||
                        "Distribution across categories"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {taskCategoryData.length === 0 ? (
                      <div className="flex h-64 items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          {t("dashboard.noDataAvailable")}
                        </p>
                      </div>
                    ) : (
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={taskCategoryData}
                            margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              opacity={0.25}
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 11 }}
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              interval={0}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                              {taskCategoryData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Top 5 Task Supervisors Chart */}
              {selectedTaskCharts.includes("supervisors") && (
                <Card className="border-border/50 shadow-lg bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👥</span>
                      <CardTitle className="text-lg">
                        {
                          taskChartOptions.find((c) => c.id === "supervisors")
                            ?.label
                        }
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      Supervisors with most tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {taskSupervisorData.length === 0 ? (
                      <div className="flex h-64 items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          {t("dashboard.noDataAvailable")}
                        </p>
                      </div>
                    ) : (
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={taskSupervisorData}
                            margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              opacity={0.25}
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 11 }}
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              interval={0}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar
                              dataKey="count"
                              fill="#10b981"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
