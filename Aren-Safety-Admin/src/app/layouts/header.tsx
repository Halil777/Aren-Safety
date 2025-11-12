import { useState } from "react";
import {
  Layout,
  Avatar,
  Dropdown,
  Badge,
  Button,
  Select,
  Drawer,
  List,
  Tag,
} from "antd";
import {
  Menu,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  ClipboardList,
  AlertTriangle,
  ShieldCheck,
  X,
} from "lucide-react";
import { GlobalOutlined } from "@ant-design/icons";
import { useTheme } from "@/app/providers/theme-provider";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { MenuProps } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#ffffff")} !important;
  border-bottom: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)"};
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  position: sticky;
  top: 0;
  z-index: 99;
  backdrop-filter: blur(12px);
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? "0 4px 16px rgba(0, 0, 0, 0.3)"
      : "0 4px 16px rgba(15, 23, 42, 0.04)"};
  transition: all 0.3s ease;
`;

const LeftSection = styled.div`
  display: flex;
  aligners: center;
  gap: 16px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled(Button)<{ $isDark: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 12px !important;
  border: none !important;
  background: ${({ $isDark }) => ($isDark ? "#0f172a" : "#f8fafc")} !important;
  color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#64748b")} !important;
  transition: all 0.3s ease !important;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ $isDark }) =>
      $isDark
        ? "rgba(99, 102, 241, 0.2)"
        : "rgba(79, 70, 229, 0.1)"} !important;
    color: ${({ $isDark }) => ($isDark ? "#6366f1" : "#4f46e5")} !important;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledBadge = styled(Badge)<{ $isDark: boolean }>`
  .ant-badge-count {
    background: ${({ $isDark }) =>
      $isDark ? "#6366f1" : "#4f46e5"} !important;
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? "0 4px 8px rgba(99, 102, 241, 0.5)"
        : "0 4px 8px rgba(79, 70, 229, 0.5)"} !important;
  }
`;

const LanguageSelect = styled(Select)<{ $isDark: boolean }>`
  width: 140px;

  .ant-select-selector {
    border-radius: 12px !important;
    border: none !important;
    background: ${({ $isDark }) =>
      $isDark ? "#0f172a" : "#f8fafc"} !important;
    color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#64748b")} !important;
    height: 44px !important;
    padding: 0 16px !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: ${({ $isDark }) =>
        $isDark
          ? "rgba(99, 102, 241, 0.2)"
          : "rgba(79, 70, 229, 0.1)"} !important;
      color: ${({ $isDark }) => ($isDark ? "#6366f1" : "#4f46e5")} !important;
    }
  }

  .ant-select-arrow {
    color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#64748b")} !important;
  }
`;

const DrawerHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.7)"};
`;

const DrawerTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 22px;
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#0f172a")};
  margin: 0;
`;

const DrawerSubtitle = styled.p<{ $isDark: boolean }>`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ $isDark }) => ($isDark ? "#94a3b8" : "#64748b")};
`;

const DrawerCloseButton = styled(Button)<{ $isDark: boolean }>`
  border: none !important;
  box-shadow: none !important;
  color: ${({ $isDark }) => ($isDark ? "#94a3b8" : "#64748b")} !important;
  background: transparent !important;
  padding: 8px !important;

  &:hover {
    color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#334155")} !important;
    background: ${({ $isDark }) =>
      $isDark
        ? "rgba(148, 163, 184, 0.1)"
        : "rgba(100, 116, 139, 0.1)"} !important;
  }
`;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Header({ onToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const isDark = theme === "dark";

  const handleLanguageChange = (value: unknown) => {
    i18n.changeLanguage(value as string);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: t("header.profile"),
      onClick: () => navigate(`/t/${tenantId}/settings?tab=profile`),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: t("header.logout"),
      onClick: handleLogout,
    },
  ];

  const mockNotifications = [
    {
      id: 1,
      type: "task",
      title: t("notifications.taskAssigned"),
      description: t("notifications.taskAssignedDesc"),
      time: "5m ago",
    },
    {
      id: 2,
      type: "warning",
      title: t("notifications.safetyAlert"),
      description: t("notifications.safetyAlertDesc"),
      time: "1h ago",
    },
  ];

  return (
    <>
      <StyledHeader $isDark={isDark}>
        <LeftSection>
          <IconButton $isDark={isDark} onClick={onToggle}>
            <Menu size={20} />
          </IconButton>
        </LeftSection>

        <RightSection>
          <LanguageSelect
            $isDark={isDark}
            value={i18n.language}
            onChange={handleLanguageChange}
            suffixIcon={<GlobalOutlined />}
            options={[
              { value: "en", label: "English" },
              { value: "ru", label: "Русский" },
              { value: "tr", label: "Turkish" },
            ]}
          />

          <StyledBadge $isDark={isDark} count={mockNotifications.length}>
            <IconButton
              $isDark={isDark}
              onClick={() => setNotificationDrawerOpen(true)}
            >
              <Bell size={20} />
            </IconButton>
          </StyledBadge>

          <IconButton $isDark={isDark} onClick={toggleTheme}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              style={{
                backgroundColor: isDark ? "#6366f1" : "#4f46e5",
                cursor: "pointer",
              }}
            >
              {user?.firstName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </Dropdown>
        </RightSection>
      </StyledHeader>

      <Drawer
        title={
          <DrawerHeader $isDark={isDark}>
            <div>
              <DrawerTitle $isDark={isDark}>
                {t("notifications.title")}
              </DrawerTitle>
              <DrawerSubtitle $isDark={isDark}>
                {t("notifications.subtitle", {
                  count: mockNotifications.length,
                })}
              </DrawerSubtitle>
            </div>
            <DrawerCloseButton
              $isDark={isDark}
              icon={<X size={20} />}
              onClick={() => setNotificationDrawerOpen(false)}
            />
          </DrawerHeader>
        }
        placement="right"
        onClose={() => setNotificationDrawerOpen(false)}
        open={notificationDrawerOpen}
        width={420}
        closeIcon={null}
      >
        <List
          dataSource={mockNotifications}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  item.type === "task" ? (
                    <ClipboardList size={20} />
                  ) : item.type === "warning" ? (
                    <AlertTriangle size={20} />
                  ) : (
                    <ShieldCheck size={20} />
                  )
                }
                title={item.title}
                description={item.description}
              />
              <Tag color={isDark ? "blue" : "processing"}>{item.time}</Tag>
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}
