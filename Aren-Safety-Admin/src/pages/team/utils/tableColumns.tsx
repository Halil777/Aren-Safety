import { Avatar, Badge, Button, Input, Space, Tag, Tooltip } from 'antd';
import type { ColumnsType, FilterDropdownProps, Key } from 'antd/es/table/interface';
import { Search, Filter } from 'lucide-react';
import type { Employee } from '../types';

// Column filter helper - Search input
export const getColumnSearchProps = (dataIndex: keyof Employee, placeholder: string) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${placeholder}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>
          Search
        </Button>
        <Button onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <Search size={14} style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value: boolean | Key, record: Employee) => {
    const fieldValue = record[dataIndex];
    return fieldValue
      ? String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
      : false;
  },
});

// Column filter helper - Select dropdown
export const getColumnSelectProps = (dataIndex: keyof Employee, options: string[]) => ({
  filters: options.map((opt) => ({ text: opt, value: opt })),
  onFilter: (value: boolean | Key, record: Employee) => record[dataIndex] === value,
  filterIcon: (filtered: boolean) => (
    <Filter size={14} style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
});

// Create employee table columns
export const createEmployeeColumns = (
  departments: string[],
  locations: string[],
  onViewEmployee: (employee: Employee) => void
): ColumnsType<Employee> => [
  {
    title: 'Employee',
    dataIndex: 'firstName',
    key: 'employee',
    fixed: 'left',
    width: 250,
    ...getColumnSearchProps('firstName', 'Name'),
    render: (_: string, record: Employee) => (
      <Space>
        <Avatar src={record.avatar} size={40}>
          {record.firstName[0]}
          {record.lastName[0]}
        </Avatar>
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.firstName} {record.lastName}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.employeeNumber}</div>
        </div>
      </Space>
    ),
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    width: 180,
    ...getColumnSearchProps('position', 'Position'),
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: 150,
    ...getColumnSelectProps('department', departments),
    render: (dept: string) => <Tag color="blue">{dept}</Tag>,
  },
  {
    title: 'Location',
    dataIndex: 'workLocation',
    key: 'workLocation',
    width: 150,
    ...getColumnSelectProps('workLocation', locations),
    render: (location: string) => <Tag color="green">{location}</Tag>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    ...getColumnSelectProps('status', ['active', 'on_leave', 'suspended', 'terminated']),
    render: (status: string) => {
      const colors: Record<string, string> = {
        active: 'success',
        on_leave: 'warning',
        suspended: 'error',
        terminated: 'default',
      };
      return <Tag color={colors[status]}>{status.replace('_', ' ').toUpperCase()}</Tag>;
    },
  },
  {
    title: 'Safety Role',
    dataIndex: 'safetyRole',
    key: 'safetyRole',
    width: 150,
    filters: [
      { text: 'Worker', value: 'worker' },
      { text: 'Safety Team', value: 'safety_team' },
      { text: 'Inspector', value: 'inspector' },
      { text: 'Head of Safety', value: 'head_of_safety' },
    ],
    onFilter: (value: boolean | Key, record: Employee) =>
      record.safetyRole === value,
    render: (role?: string) =>
      role ? <Tag color="purple">{role.replace('_', ' ').toUpperCase()}</Tag> : '-',
  },
  {
    title: 'Training',
    dataIndex: 'trainingExpiryDate',
    key: 'training',
    width: 120,
    sorter: (a: Employee, b: Employee) => {
      if (!a.trainingExpiryDate) return 1;
      if (!b.trainingExpiryDate) return -1;
      return (
        new Date(a.trainingExpiryDate).getTime() - new Date(b.trainingExpiryDate).getTime()
      );
    },
    render: (date?: string) => {
      if (!date) return '-';
      const expiry = new Date(date);
      const isExpired = expiry < new Date();
      const daysUntilExpiry = Math.ceil(
        (expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return (
        <Tooltip title={`Expires: ${expiry.toLocaleDateString()}`}>
          {isExpired ? (
            <Badge status="error" text="Expired" />
          ) : daysUntilExpiry <= 30 ? (
            <Badge status="warning" text={`${daysUntilExpiry}d`} />
          ) : (
            <Badge status="success" text="Valid" />
          )}
        </Tooltip>
      );
    },
  },
  {
    title: 'Certifications',
    dataIndex: 'certifications',
    key: 'certifications',
    width: 120,
    sorter: (a: Employee, b: Employee) => a.certifications.length - b.certifications.length,
    render: (certs: string[]) => (
      <Tooltip title={certs.join(', ')}>
        <Tag color="cyan">{certs.length} cert(s)</Tag>
      </Tooltip>
    ),
  },
  {
    title: 'Incidents',
    dataIndex: 'incidentCount',
    key: 'incidentCount',
    width: 100,
    sorter: (a: Employee, b: Employee) => a.incidentCount - b.incidentCount,
    render: (count: number) =>
      count > 0 ? (
        <Badge count={count} style={{ backgroundColor: '#ff4d4f' }} />
      ) : (
        <span style={{ color: '#52c41a' }}>0</span>
      ),
  },
];
