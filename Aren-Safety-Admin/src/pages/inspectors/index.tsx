import { useTheme } from '@/app/providers/theme-provider';
import styled from 'styled-components';
import {
  InspectorsManager,
  initialInspectors,
  useInspectors,
} from '@/features/employees';

const PageContainer = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : '#f8fafc')};
  min-height: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1<{ $isDark: boolean }>`
  margin: 0;
  font-size: 28px;
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(135deg, #a5b4fc 0%, #67e8f9 100%)'
      : 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p<{ $isDark: boolean }>`
  margin: 0;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : '#475569')};
`;

export function InspectorsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { inspectors, addInspector, summary } = useInspectors(initialInspectors);

  return (
    <PageContainer $isDark={isDark}>
      <Header>
        <Title $isDark={isDark}>Compliance Inspectors</Title>
        <Subtitle $isDark={isDark}>
          Manage inspectors responsible for monitoring adherence to safety policies and corrective actions
        </Subtitle>
      </Header>

      <InspectorsManager inspectors={inspectors} summary={summary} onAdd={addInspector} />
    </PageContainer>
  );
}
