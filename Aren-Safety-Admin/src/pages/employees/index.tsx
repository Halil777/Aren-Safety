/**
 * Employees Page
 *
 * Comprehensive employee management for the tenant
 */

import { useState } from 'react';
import { useTheme } from '@/app/providers/theme-provider';
import styled from 'styled-components';
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Card,
  Statistic,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge,
  Modal,
  Descriptions,
} from 'antd';
import {
  Search,
  UserPlus,
  Download,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import {
  MOCK_EMPLOYEES,
  getActiveEmployees,
  getEmployeesWithExpiredTraining,
  getEmployeesWithUpcomingTrainingExpiry,
  DEPARTMENTS,
  WORK_LOCATIONS,
  type Employee,
} from '@/shared/config/mock-employees';

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
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderLeft = styled.div`
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

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const StatsCard = styled(Card) <{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  border: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : '#e2e8f0')};

  .ant-card-body {
    padding: 20px;
  }

  .ant-statistic-title {
    color: ${({ $isDark }) => ($isDark ? '#94a3b8' : '#64748b')};
  }

  .ant-statistic-content {
    color: ${({ $isDark}) => ($isDark ? '#f1f5f9' : '#0f172a')};
  }
`;

const StyledTable = styled(Table) <{ $isDark: boolean }>`
  .ant-table {
    background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
    border-radius: 8px;
  }

  .ant-table-thead > tr > th {
    background: ${({ $isDark }) => ($isDark ? '#0f172a' : '#f8fafc')};
    color: ${({ $isDark }) => ($isDark ? '#f1f5f9' : '#0f172a')};
    border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : '#e2e8f0')};
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : '#e2e8f0')};
    color: ${({ $isDark }) => ($isDark ? '#e2e8f0' : '#334155')};
  }

  .ant-table-tbody > tr:hover > td {
    background: ${({ $isDark }) => ($isDark ? '#334155' : '#f1f5f9')};
  }
`;

export function EmployeesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filter employees
  const _filteredEmployees = MOCK_EMPLOYEES.filter((emp) => {
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    const matchesDepartment =
      departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesLocation =
      locationFilter === 'all' || emp.workLocation === locationFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesLocation;
  });

  // Calculate statistics
  const activeCount = getActiveEmployees().length;
  const onLeaveCount = MOCK_EMPLOYEES.filter((e) => e.status === 'on_leave').length;
  const expiredTrainingCount = getEmployeesWithExpiredTraining().length;
  const upcomingExpiryCount = getEmployeesWithUpcomingTrainingExpiry(30).length;

  // Status color mapping
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'on_leave':
        return 'warning';
      case 'suspended':
        return 'error';
      case 'terminated':
        return 'default';
      default:
        return 'default';
    }
  };

  // Safety role color mapping
  const getSafetyRoleColor = (role?: Employee['safetyRole']) => {
    switch (role) {
      case 'head_of_safety':
        return 'purple';
      case 'inspector':
        return 'blue';
      case 'safety_team':
        return 'cyan';
      case 'worker':
        return 'default';
      default:
        return 'default';
    }
  };

  // Table columns
  const _columns: ColumnsType<Employee> = [
    {
      title: 'Employee',
      key: 'employee',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: record.status === 'active' ? '#10b981' : '#94a3b8',
            }}
          >
            {record.firstName[0]}
            {record.lastName[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{record.employeeNumber}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 180,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 160,
    },
    {
      title: 'Location',
      dataIndex: 'workLocation',
      key: 'workLocation',
      width: 140,
    },
    {
      title: 'Safety Role',
      dataIndex: 'safetyRole',
      key: 'safetyRole',
      width: 140,
      render: (role?: Employee['safetyRole']) =>
        role ? (
          <Tag color={getSafetyRoleColor(role)}>
            {role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Employee['status']) => (
        <Tag color={getStatusColor(status)}>
          {status.replace(/_/g, ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Training',
      key: 'training',
      width: 120,
      render: (_, record) => {
        const hasExpiredTraining = record.trainingExpiryDate &&
          new Date(record.trainingExpiryDate) < new Date();
        const hasUpcomingExpiry = record.trainingExpiryDate &&
          new Date(record.trainingExpiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        if (hasExpiredTraining) {
          return (
            <Tooltip title="Training expired">
              <Badge status="error" text="Expired" />
            </Tooltip>
          );
        }
        if (hasUpcomingExpiry) {
          return (
            <Tooltip title="Training expiring soon">
              <Badge status="warning" text="Due Soon" />
            </Tooltip>
          );
        }
        return <Badge status="success" text="Current" />;
      },
    },
    {
      title: 'Certifications',
      dataIndex: 'certifications',
      key: 'certifications',
      width: 120,
      render: (certs: string[]) => (
        <Tooltip title={certs.join(', ')}>
          <Tag>{certs.length} Certs</Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Incidents',
      dataIndex: 'incidentCount',
      key: 'incidentCount',
      width: 100,
      align: 'center',
      render: (count: number) => (
        <Tag color={count === 0 ? 'success' : count < 3 ? 'warning' : 'error'}>
          {count}
        </Tag>
      ),
    },
    {
      title: 'Observations',
      dataIndex: 'observationsSubmitted',
      key: 'observationsSubmitted',
      width: 120,
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => setSelectedEmployee(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <PageContainer $isDark={isDark}>
      <Header>
        <HeaderLeft>
          <Title $isDark={isDark}>Employees</Title>
          <Subtitle $isDark={isDark}>
            Manage employee records, training, and safety assignments
          </Subtitle>
        </HeaderLeft>
        <Space>
          <Button type="default" icon={<Download size={16} />}>
            Export
          </Button>
          <Button type="primary" icon={<UserPlus size={16} />}>
            Add Employee
          </Button>
        </Space>
      </Header>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard $isDark={isDark}>
            <Statistic
              title="Total Employees"
              value={MOCK_EMPLOYEES.length}
              prefix={<Users size={20} />}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard $isDark={isDark}>
            <Statistic
              title="Active"
              value={activeCount}
              prefix={<UserCheck size={20} />}
              valueStyle={{ color: '#10b981' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard $isDark={isDark}>
            <Statistic
              title="On Leave"
              value={onLeaveCount}
              prefix={<UserX size={20} />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard $isDark={isDark}>
            <Statistic
              title="Training Alerts"
              value={expiredTrainingCount + upcomingExpiryCount}
              prefix={<AlertTriangle size={20} />}
              valueStyle={{ color: '#ef4444' }}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* Filters */}
      <FilterSection>
        <Input
          placeholder="Search employees..."
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'on_leave', label: 'On Leave' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'terminated', label: 'Terminated' },
          ]}
        />
        <Select
          value={departmentFilter}
          onChange={setDepartmentFilter}
          style={{ width: 200 }}
          options={[
            { value: 'all', label: 'All Departments' },
            ...DEPARTMENTS.map((dept) => ({ value: dept, label: dept })),
          ]}
        />
        <Select
          value={locationFilter}
          onChange={setLocationFilter}
          style={{ width: 180 }}
          options={[
            { value: 'all', label: 'All Locations' },
            ...WORK_LOCATIONS.map((loc) => ({ value: loc, label: loc })),
          ]}
        />
        {(searchText || statusFilter !== 'all' || departmentFilter !== 'all' || locationFilter !== 'all') && (
          <Button onClick={() => {
            setSearchText('');
            setStatusFilter('all');
            setDepartmentFilter('all');
            setLocationFilter('all');
          }}>
            Clear Filters
          </Button>
        )}
      </FilterSection>

      {/* Employees Table */}
      <StyledTable
        $isDark={isDark}
        columns={_columns as ColumnsType<unknown>}
        dataSource={_filteredEmployees as unknown[]}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} employees`,
        }}
        scroll={{ x: 1400 }}
      />

      {/* Employee Details Modal */}
      <Modal
        title={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : 'Employee Details'}
        open={!!selectedEmployee}
        onCancel={() => setSelectedEmployee(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedEmployee(null)}>
            Close
          </Button>,
          <Button key="edit" type="primary">
            Edit Employee
          </Button>,
        ]}
        width={800}
      >
        {selectedEmployee && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Employee Number">
              {selectedEmployee.employeeNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedEmployee.status)}>
                {selectedEmployee.status.replace(/_/g, ' ').toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Email">{selectedEmployee.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedEmployee.phone}</Descriptions.Item>
            <Descriptions.Item label="Position">{selectedEmployee.position}</Descriptions.Item>
            <Descriptions.Item label="Department">
              {selectedEmployee.department}
            </Descriptions.Item>
            <Descriptions.Item label="Work Location">
              {selectedEmployee.workLocation}
            </Descriptions.Item>
            <Descriptions.Item label="Shift">
              {selectedEmployee.shift
                ? selectedEmployee.shift.charAt(0).toUpperCase() +
                  selectedEmployee.shift.slice(1)
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Hire Date">{selectedEmployee.hireDate}</Descriptions.Item>
            <Descriptions.Item label="Safety Role">
              {selectedEmployee.safetyRole ? (
                <Tag color={getSafetyRoleColor(selectedEmployee.safetyRole)}>
                  {selectedEmployee.safetyRole
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Tag>
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Last Training">
              {selectedEmployee.lastTrainingDate || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Training Expiry">
              {selectedEmployee.trainingExpiryDate || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Certifications" span={2}>
              <Space wrap>
                {selectedEmployee.certifications.map((cert) => (
                  <Tag key={cert}>{cert}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Incident Count">
              <Tag
                color={
                  selectedEmployee.incidentCount === 0
                    ? 'success'
                    : selectedEmployee.incidentCount < 3
                    ? 'warning'
                    : 'error'
                }
              >
                {selectedEmployee.incidentCount}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Observations Submitted">
              {selectedEmployee.observationsSubmitted}
            </Descriptions.Item>
            {selectedEmployee.emergencyContact && (
              <>
                <Descriptions.Item label="Emergency Contact" span={2}>
                  <strong>{selectedEmployee.emergencyContact.name}</strong> (
                  {selectedEmployee.emergencyContact.relationship}) -{' '}
                  {selectedEmployee.emergencyContact.phone}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
}
