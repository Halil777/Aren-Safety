import { Row, Col, Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { GraduationCap, Users, CheckCircle, Clock, TrendingUp, Award } from 'lucide-react';
import styled from 'styled-components';
import type { TrainingSession } from '../types';

const StatsCard = styled(Card)<{ $isDark: boolean; $color: string }>`
  border-radius: 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(15, 23, 42, 0.04)'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ $color }) => $color};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ $isDark }) =>
      $isDark ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 8px 24px rgba(15, 23, 42, 0.08)'};
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const IconWrapper = styled.div<{ $color: string; $isDark: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color, $isDark }) => ($isDark ? `${$color}20` : `${$color}15`)};
  color: ${({ $color }) => $color};
  margin-bottom: 16px;
`;

const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatsTitle = styled.div<{ $isDark: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : '#64748b')};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TrendBadge = styled.div<{ $trend: 'up' | 'down' | 'stable'; $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $trend, $isDark }) => {
    if ($trend === 'up') return $isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)';
    if ($trend === 'down') return $isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)';
    return $isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.1)';
  }};
  color: ${({ $trend }) => {
    if ($trend === 'up') return '#10b981';
    if ($trend === 'down') return '#ef4444';
    return '#94a3b8';
  }};
`;

const StatsValue = styled.div<{ $isDark: boolean }>`
  font-size: 32px;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#f1f5f9' : '#0f172a')};
  line-height: 1.2;
`;

const StatsSubtext = styled.div<{ $isDark: boolean }>`
  font-size: 13px;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : '#64748b')};
  margin-top: 8px;
`;

interface TrainingStatsProps {
  data: TrainingSession[];
  isDark: boolean;
}

export function TrainingStats({ data, isDark }: TrainingStatsProps) {
  // Calculate statistics
  const totalSessions = data.length;
  const completedSessions = data.filter((s) => s.status === 'completed').length;
  const inProgressSessions = data.filter((s) => s.status === 'in-progress').length;
  const scheduledSessions = data.filter((s) => s.status === 'scheduled').length;
  const totalEnrolled = data.reduce((sum, s) => sum + s.enrolled, 0);
  const totalCapacity = data.reduce((sum, s) => sum + s.capacity, 0);
  const avgCompletionRate =
    data.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.completionRate, 0) /
    (completedSessions || 1);
  const certificatesIssued = data.filter((s) => s.certificate && s.status === 'completed').length;

  const stats = [
    {
      title: 'Total Sessions',
      value: totalSessions,
      change: 15.3,
      trend: 'up' as const,
      icon: <GraduationCap size={24} />,
      color: '#6366f1',
      subtext: `${scheduledSessions} upcoming`,
    },
    {
      title: 'Active Sessions',
      value: inProgressSessions,
      change: 0,
      trend: 'stable' as const,
      icon: <Clock size={24} />,
      color: '#f59e0b',
      subtext: 'In progress now',
    },
    {
      title: 'Completed',
      value: completedSessions,
      change: 8.7,
      trend: 'up' as const,
      icon: <CheckCircle size={24} />,
      color: '#10b981',
      subtext: `${((completedSessions / totalSessions) * 100).toFixed(0)}% completion rate`,
    },
    {
      title: 'Total Enrolled',
      value: totalEnrolled,
      change: 12.4,
      trend: 'up' as const,
      icon: <Users size={24} />,
      color: '#06b6d4',
      subtext: `${totalCapacity} total capacity`,
    },
    {
      title: 'Avg Completion',
      value: `${avgCompletionRate.toFixed(1)}%`,
      change: 3.2,
      trend: 'up' as const,
      icon: <TrendingUp size={24} />,
      color: '#8b5cf6',
      subtext: 'Student success rate',
    },
    {
      title: 'Certificates',
      value: certificatesIssued,
      change: 10.5,
      trend: 'up' as const,
      icon: <Award size={24} />,
      color: '#f59e0b',
      subtext: 'Issued to graduates',
    },
  ];

  return (
    <Row gutter={[24, 24]}>
      {stats.map((stat, index) => (
        <Col xs={24} sm={12} lg={8} xl={8} key={index}>
          <StatsCard $isDark={isDark} $color={stat.color}>
            <IconWrapper $color={stat.color} $isDark={isDark}>
              {stat.icon}
            </IconWrapper>
            <StatsHeader>
              <StatsTitle $isDark={isDark}>{stat.title}</StatsTitle>
              {stat.change !== 0 && (
                <TrendBadge $trend={stat.trend} $isDark={isDark}>
                  {stat.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(stat.change)}%
                </TrendBadge>
              )}
            </StatsHeader>
            <StatsValue $isDark={isDark}>{stat.value}</StatsValue>
            <StatsSubtext $isDark={isDark}>{stat.subtext}</StatsSubtext>
          </StatsCard>
        </Col>
      ))}
    </Row>
  );
}
