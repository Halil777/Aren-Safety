import {
  Building2,
  ChevronDown,
  ClipboardList,
  Factory,
  FolderKanban,
  GitBranch,
  Layers,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Tag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";
import { useUiStore } from "@/shared/store/ui-store";
import { useAuthStore } from "@/shared/store/auth-store";
import { Button } from "@/shared/ui/button";
import { LanguageSwitch } from "@/shared/ui/language-switch";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
// import Logo from "@/assets/logo/logo.png";
import Logo from "@/assets/logo/esta-logo.png";

type NavItem = {
  to?: string;
  labelKey: string;
  icon: LucideIcon;
  end?: boolean;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard, end: true },
  { to: "/supervisors", labelKey: "nav.supervisors", icon: Users },
  { to: "/observations", labelKey: "nav.observations", icon: ClipboardList },
  { to: "/tasks", labelKey: "nav.tasks", icon: ListChecks },
  {
    labelKey: "nav.source",
    icon: Layers,
    children: [
      { to: "/projects", labelKey: "nav.projects", icon: FolderKanban },
      { to: "/branches", labelKey: "nav.branches", icon: Tag },
      { to: "/companies", labelKey: "nav.companies", icon: Factory },
      { to: "/departments", labelKey: "nav.departments", icon: Building2 },
      { to: "/categories", labelKey: "nav.categories", icon: Layers },
      { to: "/subcategories", labelKey: "nav.subcategories", icon: GitBranch },
      { to: "/locations", labelKey: "nav.locations", icon: Building2 },
    ],
  },
];

type TenantLayoutProps = {
  children?: ReactNode;
};

export function TenantLayout({ children }: TenantLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const closeSidebar = useUiStore((state) => state.closeSidebar);
  const role = useAuthStore((state) => state.tenant?.role ?? "ADMIN");
  const isSupervisor = role === "SUPERVISOR";
  const allowedPaths = isSupervisor
    ? new Set<string>(["/", "/observations", "/tasks"])
    : null;

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      closeSidebar();
    }
  }, [location.pathname, closeSidebar]);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar
        items={navItems}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        brandTitle={t("layout.brand")}
        brandSubtitle={t("layout.subtitle")}
        translate={t}
        isSupervisor={isSupervisor}
        allowedPaths={allowedPaths}
      />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-200",
          isSidebarOpen ? "md:pl-72" : "md:pl-20"
        )}
      >
        <Topbar
          onToggleSidebar={toggleSidebar}
          brandTitle={t("layout.brand")}
          brandSubtitle={t("layout.subtitle")}
        />
        <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

type SidebarProps = {
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  brandTitle: string;
  brandSubtitle: string;
  translate: (key: string, options?: Record<string, unknown>) => string;
  isSupervisor: boolean;
  allowedPaths: Set<string> | null;
};

function Sidebar({
  items,
  isOpen,
  onToggle,
  brandSubtitle,
  translate,
  isSupervisor,
  allowedPaths,
}: SidebarProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const filteredItems = isSupervisor
    ? (items
        .map((item) => {
          if (item.children) {
            const filteredChildren = item.children.filter(
              (child) => allowedPaths?.has(child.to ?? "") ?? true
            );
            if (!filteredChildren.length) return null;
            return { ...item, children: filteredChildren };
          }
          return allowedPaths?.has(item.to ?? "") ? item : null;
        })
        .filter(Boolean) as NavItem[])
    : items;

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-card/95 backdrop-blur transition-all duration-200 ease-in-out",
          isOpen
            ? "border-r border-border shadow-sm md:w-72"
            : "md:w-20 shadow-none border-none",
          "md:translate-x-0",
          "max-md:w-72",
          isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col">
          <div
            className={cn(
              "flex items-center gap-3 pb-4 pt-5",
              isOpen ? "px-4" : "md:justify-center md:px-2 max-md:px-4"
            )}
          >
            <div
              className={cn(
                "flex flex-col",
                !isOpen && "max-md:flex md:hidden"
              )}
            >
              <span className="text-base font-semibold leading-tight text-foreground">
                {"ADMIN"}
              </span>
              <span className="text-xs text-muted-foreground">
                {brandSubtitle}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn("ml-auto md:hidden", !isOpen && "max-md:flex")}
              aria-label="Close sidebar"
              onClick={onToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <nav
            className={cn(
              "flex-1 flex flex-col",
              isOpen ? "space-y-1 px-3" : "space-y-3 px-3 py-2 md:items-center"
            )}
          >
            {filteredItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);

              // =========================
              // GROUP ITEM (children)
              // =========================
              if (hasChildren) {
                const isGroupOpen = openGroup === item.labelKey;

                // ✅ Sidebar CLOSED: only parent icon, hover opens flyout (desktop)
                if (!isOpen) {
                  const groupLabel = translate(item.labelKey, {
                    defaultValue: item.labelKey,
                  });

                  return (
                    <div
                      key={item.labelKey}
                      className="relative"
                      onMouseEnter={() => setOpenGroup(item.labelKey)}
                      onMouseLeave={() => setOpenGroup(null)}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "flex items-center text-sm font-medium transition-colors text-white",
                              "md:gap-0 md:justify-center md:mx-auto",
                              "md:h-12 md:w-12 md:rounded-xl",
                              "bg-[#6e2e34]/80 hover:bg-[#6e2e34]"
                            )}
                            aria-haspopup="menu"
                            aria-expanded={isGroupOpen}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {/* mobile-da text görkez (isleseň pozup bilersiň) */}
                            <span className="uppercase max-md:flex md:hidden ml-3">
                              {groupLabel}
                            </span>
                          </button>
                        </TooltipTrigger>

                        <TooltipContent
                          side="right"
                          className="hidden md:block"
                        >
                          <p className="uppercase">{groupLabel}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Flyout children (desktop only) */}
                      <div
                        className={cn(
                          "absolute left-full top-0 ml-2 hidden md:block mt-[30px]",
                          "min-w-56 rounded-xl border border-border bg-card/95 backdrop-blur shadow-lg",
                          "transition-all duration-150",
                          isGroupOpen
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-1 pointer-events-none"
                        )}
                        role="menu"
                      >
                        <div className="p-2 space-y-1">
                          {item.children?.map((child) => (
                            <NavLink
                              key={child.to ?? child.labelKey}
                              to={child.to ?? "#"}
                              end={child.end}
                              onClick={() => setOpenGroup(null)}
                              className={({ isActive }) =>
                                cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ring-1 ring-inset text-white",
                                  isActive
                                    ? "bg-[#347248] ring-[#347248]/40"
                                    : "bg-[#347248]/80 ring-[#347248]/60 hover:bg-[#347248] hover:ring-[#347248]/80"
                                )
                              }
                            >
                              <child.icon className="h-4 w-4" />
                              <span className="uppercase">
                                {translate(child.labelKey, {
                                  defaultValue: child.labelKey,
                                })}
                              </span>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ✅ Sidebar OPEN: grouped dropdown (your existing)
                return (
                  <div
                    key={item.labelKey}
                    className="relative"
                    onMouseEnter={() => setOpenGroup(item.labelKey)}
                    onMouseLeave={() => setOpenGroup(null)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOpenGroup((current) =>
                          current === item.labelKey ? null : item.labelKey
                        );
                      }}
                      className={cn(
                        "flex w-full items-center rounded-xl py-2.5 text-sm font-medium transition-colors ring-1 ring-inset text-white",
                        "gap-3 px-3",
                        isGroupOpen
                          ? "bg-[#6e2e34]/80 hover:bg-[#6e2e34]"
                          : "bg-[#6e2e34]/80 hover:bg-[#6e2e34]"
                      )}
                      aria-expanded={isGroupOpen}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 text-left uppercase">
                        {translate(item.labelKey, {
                          defaultValue: item.labelKey,
                        })}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isGroupOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "rounded-xl bg-muted/50 shadow-sm transition-all overflow-hidden",
                        isGroupOpen
                          ? "mt-1 space-y-1 p-2 opacity-100"
                          : "max-h-0 p-0 mt-1 opacity-0 pointer-events-none"
                      )}
                    >
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.to ?? child.labelKey}
                          to={child.to ?? "#"}
                          end={child.end}
                          onClick={() => setOpenGroup(null)}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ring-1 ring-inset text-white",
                              isActive
                                ? "bg-[#347248] ring-[#347248]/40"
                                : "bg-[#347248]/80 ring-[#347248]/60 hover:bg-[#347248] hover:ring-[#347248]/80"
                            )
                          }
                        >
                          <child.icon className="h-4 w-4" />
                          <span className="uppercase">
                            {translate(child.labelKey, {
                              defaultValue: child.labelKey,
                            })}
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              }

              // =========================
              // SINGLE ITEM
              // =========================
              if (!item.to) return null;

              const itemLabel = translate(item.labelKey, {
                defaultValue: item.labelKey,
              });

              const navLink = (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center text-sm font-medium transition-colors text-white",
                      isOpen
                        ? "gap-3 px-3 rounded-xl py-2.5 ring-1 ring-inset"
                        : "md:gap-0 md:justify-center md:mx-auto md:h-12 md:w-12 md:rounded-xl max-md:gap-3 max-md:px-3 max-md:rounded-xl max-md:py-2.5",
                      isOpen
                        ? isActive
                          ? "bg-[#6e2e34] ring-[#6e2e34]/40"
                          : "bg-[#6e2e34]/80 ring-[#6e2e34]/60 hover:bg-[#6e2e34] hover:ring-[#6e2e34]/80"
                        : isActive
                        ? "bg-[#6e2e34]"
                        : "bg-[#6e2e34]/80 hover:bg-[#6e2e34]"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "uppercase",
                      !isOpen && "max-md:flex md:hidden"
                    )}
                  >
                    {itemLabel}
                  </span>
                </NavLink>
              );

              if (!isOpen) {
                return (
                  <Tooltip key={item.to}>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent side="right" className="hidden md:block">
                      <p className="uppercase">{itemLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return navLink;
            })}
          </nav>

          <div
            className={cn(
              "border-t border-dashed border-border",
              !isOpen && "border-none"
            )}
          >
            <div className="flex items-center justify-center">
              <img
                src={Logo}
                alt="Tenant logo"
                className={cn(
                  "w-auto object-contain opacity-90 transition-all",
                  isOpen ? "h-[60px]" : "h-[60px]"
                )}
              />
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          role="presentation"
          onClick={onToggle}
        />
      )}
    </TooltipProvider>
  );
}

type TopbarProps = {
  onToggleSidebar: () => void;
  brandTitle: string;
  brandSubtitle: string;
};

function Topbar({ onToggleSidebar }: TopbarProps) {
  const tenant = useAuthStore((state) => state.tenant);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSwitch />
          <ThemeToggle />
          <UserBadge tenantName={tenant?.fullname} onLogout={logout} />
        </div>
      </div>
    </header>
  );
}

function UserBadge({
  tenantName,
  onLogout,
}: {
  tenantName?: string;
  onLogout: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
      <div className="hidden leading-tight sm:block">
        <p className="text-sm font-medium text-foreground uppercase">
          {tenantName ?? "Tenant Admin"}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Logout"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
