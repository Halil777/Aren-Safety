import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.mode === 'dark' ? '#1e293b' : '#f1f5f9'};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.mode === 'dark' ? '#475569' : '#cbd5e1'};
    border-radius: 6px;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? '#64748b' : '#94a3b8'};
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  /* Ant Design overrides for smoother animations */
  .ant-table {
    animation: fadeIn 0.3s ease-in-out;
  }

  .ant-card {
    animation: fadeIn 0.3s ease-in-out;
  }

  .ant-menu-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .ant-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  /* Modal animations */
  .ant-modal {
    .ant-modal-content {
      animation: fadeIn 0.3s ease-in-out;
    }
  }

  /* Dropdown animations */
  .ant-dropdown {
    animation: fadeIn 0.2s ease-in-out;
  }

  /* Tooltip animations */
  .ant-tooltip {
    animation: fadeIn 0.2s ease-in-out;
  }

  /* Selection animations */
  ::selection {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.3)'};
    color: ${({ theme }) => theme.mode === 'dark' ? '#f1f5f9' : '#0f172a'};
  }

  /* Focus visible for accessibility */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#818cf8' : '#6366f1'};
    outline-offset: 2px;
  }

  /* Smooth layout transitions */
  .ant-layout,
  .ant-layout-sider,
  .ant-layout-header {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
`;
