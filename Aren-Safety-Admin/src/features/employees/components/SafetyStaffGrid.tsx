import { Card, Col, Row, Tag, Typography, Space } from 'antd';
import styled from 'styled-components';
import type { SafetyStaffMember } from '../types';

const { Text, Title } = Typography;

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`;

const SummaryCard = styled(Card)`
  border-radius: 16px;
`;

interface SafetyStaffGridProps {
  members: SafetyStaffMember[];
  summary: {
    count: number;
    averageExperience: number;
    experts: number;
    dayShift: number;
  };
  isDark: boolean;
}

const certificationColor = (level: SafetyStaffMember['certificationLevel']) => {
  if (level === 'expert') return 'gold';
  if (level === 'advanced') return 'purple';
  return 'blue';
};

export function SafetyStaffGrid({ members, summary, isDark }: SafetyStaffGridProps) {
  const cardStyle = {
    borderRadius: 16,
    border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}`,
  };

  return (
    <GridWrapper>
      <SummaryRow>
        <SummaryCard>
          <Title level={4}>Overall Team</Title>
          <Text strong>{summary.count}</Text>
          <Text type="secondary" style={{ display: 'block' }}>
            Registered specialists
          </Text>
        </SummaryCard>
        <SummaryCard>
          <Title level={4}>Avg. Experience</Title>
          <Text strong>{summary.averageExperience} years</Text>
          <Text type="secondary" style={{ display: 'block' }}>
            Combined expertise level
          </Text>
        </SummaryCard>
        <SummaryCard>
          <Title level={4}>Expert Certified</Title>
          <Text strong>{summary.experts}</Text>
          <Text type="secondary" style={{ display: 'block' }}>
            Highest qualification
          </Text>
        </SummaryCard>
        <SummaryCard>
          <Title level={4}>Day Shift</Title>
          <Text strong>{summary.dayShift}</Text>
          <Text type="secondary" style={{ display: 'block' }}>
            Daytime coverage
          </Text>
        </SummaryCard>
      </SummaryRow>

      <Row gutter={[24, 24]}>
        {members.map((member) => (
          <Col key={member.id} xs={24} sm={12} lg={8} xl={6}>
            <Card style={cardStyle} title={member.fullName} bordered>
              <Space direction="vertical" size={6} style={{ width: '100%' }}>
                <Text type="secondary">{member.position}</Text>
                <Text>{member.department}</Text>
                <Tag color={member.shift === 'day' ? 'cyan' : 'geekblue'}>
                  {member.shift === 'day' ? 'Day shift' : 'Night shift'}
                </Tag>
                <Tag color={certificationColor(member.certificationLevel)}>
                  {member.certificationLevel.toUpperCase()}
                </Tag>
                <Text>
                  Expertise: <Text strong>{member.expertise}</Text>
                </Text>
                <Text>
                  Experience: <Text strong>{member.yearsOfExperience} years</Text>
                </Text>
                {member.email && <Text>Email: {member.email}</Text>}
                {member.phone && <Text>Phone: {member.phone}</Text>}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </GridWrapper>
  );
}
