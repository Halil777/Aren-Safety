import styled from 'styled-components';
import { Card } from 'antd';

export const PageContainer = styled.div<{ $isDark: boolean }>`
  padding: 32px;
  min-height: calc(100vh - 72px);
  background: ${({ $isDark }) => ($isDark ? '#0a0f1e' : '#fafbfc')};
  transition: all 0.3s ease;
`;

export const FilterSection = styled(Card)<{ $isDark: boolean }>`
  margin-bottom: 24px;
  border-radius: 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 4px 16px rgba(0, 0, 0, 0.3)'
      : '0 4px 16px rgba(15, 23, 42, 0.04)'};
  transition: all 0.3s ease;

  .ant-card-body {
    padding: 20px;
  }

  &:hover {
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? '0 8px 24px rgba(0, 0, 0, 0.4)'
        : '0 8px 24px rgba(15, 23, 42, 0.08)'};
  }
`;

export const TableContainer = styled(Card)<{ $isDark: boolean; showFilters?: boolean }>`
  border-radius: 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 4px 16px rgba(0, 0, 0, 0.3)'
      : '0 4px 16px rgba(15, 23, 42, 0.04)'};
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }

  .ant-table-wrapper {
    border-radius: 16px;
  }
`;
