import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  Calendar,
  RotateCcw,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileImage,
  FileText,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useTasksQuery } from "@/features/tasks/api/hooks";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  ComposedChart,
  AreaChart,
  Area,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { CHART_COLORS, buildStatusCardConfig } from "./dashboard-constants";

type DateRange = {
  startDate: string;
  endDate: string;
};

export function TasksDashboard() {
  const { t } = useTranslation();
  const { data: tasks, isLoading } = useTasksQuery();
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
  const [selectedTaskCharts, setSelectedTaskCharts] = useState<string[]>([]);
  const [showTaskExportMenu, setShowTaskExportMenu] = useState(false);
  const taskExportRef = useRef<HTMLDivElement>(null);

  const statusCardConfig = useMemo(() => buildStatusCardConfig(t), [t]);

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
      label: t("Category") || "Tasks by Category",
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
    setSelectedTaskCharts([]);
  };

  const goToTaskSlide = useCallback((index: number) => {
    setCurrentTaskSlide(index);
  }, []);

  const nextTaskSlide = useCallback(() => {
    const next = (currentTaskSlide + 1) % totalTaskSlides;
    goToTaskSlide(next);
  }, [currentTaskSlide, totalTaskSlides, goToTaskSlide]);

  const prevTaskSlide = useCallback(() => {
    const prev = (currentTaskSlide - 1 + totalTaskSlides) % totalTaskSlides;
    goToTaskSlide(prev);
  }, [currentTaskSlide, totalTaskSlides, goToTaskSlide]);

  useEffect(() => {
    if (currentTaskSlide >= totalTaskSlides && totalTaskSlides > 0) {
      setCurrentTaskSlide(0);
    }
  }, [totalTaskSlides, currentTaskSlide]);

  useEffect(() => {
    if (!isTaskPaused && totalTaskSlides > 0) {
      const interval = setInterval(() => {
        nextTaskSlide();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isTaskPaused, totalTaskSlides, nextTaskSlide]);

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
          {t("dashboard.loadingTasks") || "Loading tasks..."}
        </p>
      </div>
    );
  }

  return (
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
                  {t("dashboard.reset")}
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
                    {t("dashboard.selectChartsToDisplay")}
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
                    {Array.from({ length: totalTaskSlides }).map((_, index) => (
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
                    ))}
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
                  <CardTitle className="text-base">
                    {taskChartOptions.find((c) => c.id === "projects")?.label}
                  </CardTitle>
                </div>
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
                  <CardTitle className="text-base">
                    {
                      taskChartOptions.find((c) => c.id === "departments")
                        ?.label
                    }
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {taskDepartmentData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={taskDepartmentData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient
                            id="taskDept"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.7}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
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
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          fill="url(#taskDept)"
                          strokeWidth={2}
                        />
                      </AreaChart>
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
                  <CardTitle className="text-base">
                    {taskChartOptions.find((c) => c.id === "categories")?.label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {taskCategoryData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
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
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#f59e0b"
                          radius={[8, 8, 0, 0]}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#d97706"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#d97706" }}
                          activeDot={{ r: 6 }}
                        />
                      </ComposedChart>
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
                  <CardTitle className="text-base">
                    {
                      taskChartOptions.find((c) => c.id === "supervisors")
                        ?.label
                    }
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {taskSupervisorData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
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
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 5, strokeWidth: 2, fill: "#10b981" }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
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
                    <span className="text-xl">рџ“Љ</span>
                    <CardTitle className="text-lg">
                      {taskChartOptions.find((c) => c.id === "projects")?.label}
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
              <Card className="border-border/50 shadow-lg bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">рџЏў</span>
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
                        <AreaChart
                          data={taskDepartmentData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 40 }}
                        >
                          <defs>
                            <linearGradient
                              id="taskDeptExport"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.7}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
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
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#3b82f6"
                            fill="url(#taskDeptExport)"
                            strokeWidth={2}
                          />
                        </AreaChart>
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
                          layout="vertical"
                          margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis type="number" tick={{ fontSize: 12 }} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 12 }}
                            width={140}
                          />
                          <Tooltip />
                          <Bar
                            dataKey="count"
                            radius={[0, 8, 8, 0]}
                            fill="#f59e0b"
                          />
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
                    <span className="text-xl">рџ‘Ґ</span>
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
                        <LineChart
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
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 5, strokeWidth: 2, fill: "#10b981" }}
                            activeDot={{ r: 7 }}
                          />
                        </LineChart>
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
  );
}
