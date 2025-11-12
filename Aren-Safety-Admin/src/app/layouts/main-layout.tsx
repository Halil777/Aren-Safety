import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import styled from "styled-components";

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const ContentLayout = styled(Layout)`
  background: ${({ theme }) => theme.colors[theme.mode].background} !important;
`;

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <StyledLayout>
      <Sidebar collapsed={collapsed} />
      <ContentLayout>
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <Outlet />
      </ContentLayout>
    </StyledLayout>
  );
}
