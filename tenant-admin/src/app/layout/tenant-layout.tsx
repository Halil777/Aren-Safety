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
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";
import { useUiStore } from "@/shared/store/ui-store";
import { useAuthStore } from "@/shared/store/auth-store";
import { Button } from "@/shared/ui/button";
import { LanguageSwitch } from "@/shared/ui/language-switch";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

type NavItem = {
  to?: string;
  labelKey: string;
  icon: LucideIcon;
  end?: boolean;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard, end: true },
  { to: "/users", labelKey: "nav.users", icon: Users },
  { to: "/observations", labelKey: "nav.observations", icon: ClipboardList },

  {
    labelKey: "nav.source",
    icon: Layers,
    children: [
      { to: "/projects", labelKey: "nav.projects", icon: FolderKanban },
      { to: "/departments", labelKey: "nav.departments", icon: Building2 },
      { to: "/companies", labelKey: "nav.companies", icon: Factory },
      { to: "/tasks", labelKey: "nav.tasks", icon: ListChecks },
      { to: "/locations", labelKey: "nav.locations", icon: Building2 },
      { to: "/categories", labelKey: "nav.categories", icon: Layers },
      { to: "/subcategories", labelKey: "nav.subcategories", icon: GitBranch },
      { to: "/types", labelKey: "nav.types", icon: Tag },
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

  useEffect(() => {
    closeSidebar();
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
      />

      <div className="flex flex-1 flex-col md:pl-72">
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
};

function Sidebar({
  items,
  isOpen,
  onToggle,
  brandSubtitle,
  translate,
}: SidebarProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 border-r border-border bg-card/95 shadow-sm backdrop-blur transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-4 pb-4 pt-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary">
              TA
            </div>
            <div className="flex flex-col">
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
              className="ml-auto md:hidden"
              aria-label="Close sidebar"
              onClick={onToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {items.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              if (hasChildren) {
                const isOpen = openGroup === item.labelKey;
                return (
                  <div
                    key={item.labelKey}
                    className="relative"
                    onMouseEnter={() => setOpenGroup(item.labelKey)}
                    onMouseLeave={() => setOpenGroup(null)}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenGroup((current) =>
                          current === item.labelKey ? null : item.labelKey
                        )
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isOpen
                          ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                      aria-expanded={isOpen}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1 text-left uppercase">
                        {translate(item.labelKey, {
                          defaultValue: item.labelKey,
                        })}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden rounded-xl bg-muted/50 shadow-sm transition-all",
                        isOpen
                          ? "mt-1 space-y-1 p-2 opacity-100"
                          : "max-h-0 p-0 opacity-0 pointer-events-none"
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
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
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

              if (!item.to) return null;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="uppercase">
                    {translate(item.labelKey, { defaultValue: item.labelKey })}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-dashed border-border px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {brandSubtitle}
            </p>
            <p className="text-sm text-foreground">Tenant safety workspace</p>
          </div>
        </div>
      </aside>
      {isOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          role="presentation"
          onClick={onToggle}
        />
      ) : null}
    </>
  );
}

type TopbarProps = {
  onToggleSidebar: () => void;
  brandTitle: string;
  brandSubtitle: string;
};

function Topbar({ onToggleSidebar, brandTitle, brandSubtitle }: TopbarProps) {
  const tenant = useAuthStore((state) => state.tenant);
  const logout = useAuthStore((state) => state.logout);
  const initials = useMemo(() => {
    if (!tenant?.fullname) return "TA";
    const parts = tenant.fullname.split(" ").filter(Boolean);
    const [first, second] = parts;
    const firstInitial = first?.[0];
    const secondInitial = second?.[0];
    return `${firstInitial ?? ""}${secondInitial ?? ""}`.toUpperCase() || "TA";
  }, [tenant?.fullname]);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open sidebar"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 text-base font-semibold">
            {initials}
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-foreground">
              {tenant?.fullname || brandTitle}
            </span>
            <span className="text-xs text-muted-foreground">
              {tenant?.email || brandSubtitle}
            </span>
          </div>
        </div>

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
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {(tenantName ?? "TA").slice(0, 2).toUpperCase()}
      </div>
      <div className="hidden leading-tight sm:block">
        <p className="text-sm font-medium text-foreground">
          {tenantName ?? "Tenant Admin"}
        </p>
        <p className="text-xs text-muted-foreground">Tenant</p>
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
