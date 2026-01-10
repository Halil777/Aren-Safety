import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ChartPie,
  Building2,
  Tags,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileImage,
  FileText,
  ChevronDown,
  GitBranch,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useObservationsQuery } from "@/features/observations/api/hooks";
import { useSupervisorsQuery } from "@/features/supervisors/api/hooks";
import { CHART_COLORS, buildStatusCardConfig } from "./dashboard-constants";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  LineChart,
  Line,
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
  const { data: supervisors } = useSupervisorsQuery();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<number | "all">(
    "all"
  );
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<
    string | "all"
  >("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const chartOptions = [
    {
      id: "projects",
      label: t("dashboard.observationsByProject"),
      icon: <ChartPie className="h-4 w-4" />,
    },
    {
      id: "departments",
      label: t("dashboard.observationsByDepartment"),
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      id: "categories",
      label:
        t("dashboard.observationsByCategory") || "Observations by Category",
      icon: <Tags className="h-4 w-4" />,
    },
    {
      id: "locations",
      label: t("dashboard.observationsByLocation"),
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      id: "supervisors",
      label: t("dashboard.top5Supervisors"),
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "branches",
      label: t("Branch") || "Observations by Branch",
      icon: <GitBranch className="h-4 w-4" />,
    },
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

    if (selectedSupervisorId !== "all") {
      filtered = filtered.filter(
        (obs) => obs.supervisorId === selectedSupervisorId
      );
    }

    return filtered;
  }, [observations, dateRange, selectedRiskLevel, selectedSupervisorId]);

  // Status card configuration
  const statusCardConfig = useMemo(() => buildStatusCardConfig(t), [t]);

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

  // Branch data for chart
  const branchData = useMemo(() => {
    const branchMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const branchName = obs.branch?.typeName || "Unknown";
      branchMap.set(branchName, (branchMap.get(branchName) || 0) + 1);
    });

    return Array.from(branchMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, startDate: e.target.value }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, endDate: e.target.value }));
  };

  const resetFilters = () => {
    setDateRange({ startDate: "", endDate: "" });
    setSelectedRiskLevel("all");
    setSelectedSupervisorId("all");
    setSelectedCharts([]);
  };

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % totalSlides;
    goToSlide(next);
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  }, [currentSlide, totalSlides, goToSlide]);

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
  }, [isPaused, totalSlides, nextSlide]);

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

      if (selectedCharts.includes("branches") && branchData.length > 0) {
        const branchesData = [
          ["Branch", "Count"],
          ...branchData.map((b) => [b.name, b.count]),
        ];
        const branchesWs = XLSX.utils.aoa_to_sheet(branchesData);
        XLSX.utils.book_append_sheet(wb, branchesWs, "Branches");
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
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-0 py-0.5 shadow-sm flex-1 min-w-[50px]">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col flex-1 items-center">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("dashboard.from")}
                      </span>
                      <div className="relative">
                        <Calendar className="h-4 w-4 text-primary flex-shrink-0 pointer-events-none" />
                        <input
                          type="date"
                          value={dateRange.startDate}
                          onChange={handleStartDateChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-4 h-4"
                        />
                      </div>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex flex-col flex-1 items-center">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("dashboard.to")}
                      </span>
                      <div className="relative">
                        <Calendar className="h-4 w-4 text-primary flex-shrink-0 pointer-events-none" />
                        <input
                          type="date"
                          value={dateRange.endDate}
                          onChange={handleEndDateChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-4 h-4"
                        />
                      </div>
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

                {/* Supervisor Filter - Compact */}
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm min-w-[100px]">
                  <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <select
                    value={selectedSupervisorId}
                    onChange={(e) => setSelectedSupervisorId(e.target.value)}
                    className="text-xs font-medium border-0 p-0 focus:outline-none focus:ring-0 bg-transparent flex-1"
                  >
                    <option value="all">
                      {t("Responsible") || "All Supervisors"}
                    </option>
                    {supervisors?.map((supervisor) => (
                      <option key={supervisor.id} value={supervisor.id}>
                        {supervisor.fullName}
                      </option>
                    ))}
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
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByProject")}
                  </CardTitle>
                </div>
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
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByDepartment")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {departmentData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={departmentData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient
                            id="obsDept"
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
                          fill="url(#obsDept)"
                          strokeWidth={2}
                        />
                      </AreaChart>
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
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByCategory") ||
                      "Observations by Category"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
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
                        <Bar
                          dataKey="count"
                          fill="#8b5cf6"
                          radius={[8, 8, 0, 0]}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#6d28d9"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#6d28d9" }}
                          activeDot={{ r: 6 }}
                        />
                      </ComposedChart>
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
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByLocation")}
                  </CardTitle>
                </div>
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
                  <CardTitle className="text-base">
                    {t("dashboard.top5Supervisors")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {supervisorData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
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

          {/* Branches Chart */}
          {selectedCharts.includes("branches") && (
            <Card className="border-border/50 shadow-lg bg-card animate-fadeIn">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">
                    {t("dashboard.observationsByBranch") ||
                      "Observations by Branch"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {branchData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    {t("dashboard.noDataAvailable")}
                  </div>
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={branchData}
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
                          {branchData.map((_, index) => (
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
                  <CardTitle className="text-lg">
                    {t("dashboard.observationsByProject")}
                  </CardTitle>
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
                  <CardTitle className="text-lg">
                    {t("dashboard.observationsByDepartment")}
                  </CardTitle>
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
                        <AreaChart
                          data={departmentData}
                          margin={{ left: 0, right: 0, top: 10, bottom: 40 }}
                        >
                          <defs>
                            <linearGradient
                              id="obsDeptExport"
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
                            fill="url(#obsDeptExport)"
                            strokeWidth={2}
                          />
                        </AreaChart>
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
                  <CardTitle className="text-lg">
                    {t("dashboard.observationsByCategory") ||
                      "Observations by Category"}
                  </CardTitle>
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
                        <ComposedChart
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
                          <Bar
                            dataKey="count"
                            fill="#8b5cf6"
                            radius={[8, 8, 0, 0]}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#6d28d9"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "#6d28d9" }}
                            activeDot={{ r: 6 }}
                          />
                        </ComposedChart>
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
                  <CardTitle className="text-lg">
                    {t("dashboard.observationsByLocation")}
                  </CardTitle>
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
                  <CardTitle className="text-lg">
                    {t("dashboard.top5Supervisors")}
                  </CardTitle>
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
                        <LineChart
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

            {/* Branches Chart */}
            {selectedCharts.includes("branches") && (
              <Card className="border-border/50 shadow-lg bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {t("dashboard.observationsByBranch") ||
                      "Observations by Branch"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {branchData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.noDataAvailable")}
                      </p>
                    </div>
                  ) : (
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={branchData}
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
                            {branchData.map((_, index) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
