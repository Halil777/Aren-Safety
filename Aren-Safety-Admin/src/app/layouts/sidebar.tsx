import { useMemo } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  Building2,
  FolderCode,
  GraduationCap,
  Settings,
  Shield,
  UserCheck,
  Tags,
  GitBranch,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { MenuProps } from "antd";
import { useTheme } from "@/app/providers/theme-provider";

const { Sider } = Layout;

const StyledSider = styled(Sider)<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#ffffff")} !important;
  border-right: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)"};
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? "0 4px 16px rgba(0, 0, 0, 0.3)"
      : "0 4px 16px rgba(15, 23, 42, 0.04)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 100;

  .ant-layout-sider-trigger {
    background: ${({ $isDark }) =>
      $isDark ? "#0f172a" : "#f8fafc"} !important;
    border-top: 1px solid
      ${({ $isDark }) =>
        $isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)"};
    transition: all 0.3s ease;

    &:hover {
      background: ${({ $isDark }) =>
        $isDark ? "#1e293b" : "#f1f5f9"} !important;
    }
  }

  .ant-menu {
    padding: 8px;
  }
`;

const LogoContainer = styled.div<{ $collapsed: boolean; $isDark: boolean }>`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  padding: ${({ $collapsed }) => ($collapsed ? "0" : "0 20px")};
  border-bottom: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: ${({ $isDark }) =>
      $isDark
        ? "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), transparent)"
        : "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.4), transparent)"};
  }
`;

const LogoIcon = styled.div<{ $isDark: boolean }>`
  width: 44px;
  height: 44px;
  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? "0 4px 16px rgba(0, 0, 0, 0.3)"
      : "0 4px 16px rgba(15, 23, 42, 0.04)"};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? "0 12px 24px rgba(99, 102, 241, 0.5)"
        : "0 12px 24px rgba(79, 70, 229, 0.5)"};
  }
`;

const LogoText = styled.h1<{ $isDark: boolean }>`
  margin: 0 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  white-space: nowrap;
`;

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  type MenuItem = Required<MenuProps>["items"][number];

  const basePath = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length >= 2 && segments[0] === "t") {
      return `/t/${segments[1]}`;
    }
    return "/";
  }, [location.pathname]);

  const buildPath = (segment?: string) =>
    segment ? `${basePath}/${segment}` : basePath;

  const items: MenuItem[] = [
    {
      key: buildPath("team"),
      icon: <Users size={20} />,
      label: t("nav.team"),
    },
    {
      key: buildPath("supervisors"),
      icon: <UserCheck size={20} />,
      label: t("nav.supervisors"),
    },
    {
      key: buildPath("observations"),
      icon: <AlertTriangle size={20} />,
      label: t("nav.observations"),
    },
    {
      key: buildPath("departments"),
      icon: <Building2 size={20} />,
      label: t("nav.departments"),
    },
    {
      key: buildPath("project-codes"),
      icon: <FolderCode size={20} />,
      label: t("nav.projectCodes"),
    },
    {
      key: buildPath("categories"),
      icon: <Tags size={20} />,
      label: t("nav.categories"),
    },
    {
      key: buildPath("branches"),
      icon: <GitBranch size={20} />,
      label: t("nav.branches"),
    },
    {
      key: buildPath("training"),
      icon: <GraduationCap size={20} />,
      label: t("nav.training"),
    },
    {
      type: "divider",
    },
    {
      key: buildPath("settings"),
      icon: <Settings size={20} />,
      label: t("nav.settings"),
    },
  ];

  const activeKey = useMemo(() => {
    if (location.pathname === basePath) {
      return basePath;
    }
    if (location.pathname.startsWith(`${basePath}/`)) {
      const relative = location.pathname.slice(basePath.length + 1);
      const [segment] = relative.split("/");
      return segment ? buildPath(segment) : basePath;
    }
    return location.pathname;
  }, [location.pathname, basePath]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(String(key));
  };

  return (
    <StyledSider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={260}
      $isDark={isDark}
    >
      <LogoContainer $collapsed={collapsed} $isDark={isDark}>
        <LogoIcon $isDark={isDark}>
          <Shield size={24} />
        </LogoIcon>
        {!collapsed && <LogoText $isDark={isDark}>Admin</LogoText>}
      </LogoContainer>
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        items={items}
        onClick={handleMenuClick}
        theme={isDark ? "dark" : "light"}
        style={{
          border: "none",
          marginTop: "16px",
          background: "transparent",
        }}
      />
    </StyledSider>
  );
}
