import React from 'react';
import { Table, Tag, Button, Space, Avatar, Popconfirm, Switch, Tooltip, Input } from 'antd';
import { Edit, Trash2, Mail, Calendar, Clock, Search } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { AdminUser } from '../types';
import { ROLE_NAMES } from '../config/rolePermissions';

interface UsersTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      super_admin: 'red',
      tenant_owner: 'purple',
      tenant_admin: 'geekblue',
      head_of_safety: 'blue',
      inspector: 'cyan',
      department_supervisor: 'green',
      manager: 'orange',
      viewer: 'default',
    };
    return colors[role] || 'default';
  };

  // Column search filter
  const getColumnSearchProps = (dataIndex: keyof AdminUser, placeholder: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${placeholder}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<Search size={14} />}
            size="small"
            style={{ width: 90 }}
          >
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
    onFilter: (value: any, record: AdminUser) => {
      const fieldValue = record[dataIndex];
      return fieldValue
        ? String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
        : false;
    },
  });

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'User',
      key: 'user',
      fixed: 'left',
      width: 250,
      ...getColumnSearchProps('firstName', 'name or email'),
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.avatar}
            size={40}
            style={{ backgroundColor: '#1890ff' }}
          >
            {record.firstName[0]}
            {record.lastName[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} />
              {record.email}
            </div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 180,
      filters: Object.entries(ROLE_NAMES).map(([value, text]) => ({ text, value })),
      onFilter: (value, record) => record.role === value,
      render: (role: string) => (
        <Tag color={getRoleColor(role)} style={{ fontWeight: 500 }}>
          {ROLE_NAMES[role as keyof typeof ROLE_NAMES] || role}
        </Tag>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      ...getColumnSearchProps('department', 'department'),
      render: (dept?: string) => dept || '-',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 180,
      ...getColumnSearchProps('position', 'position'),
      render: (position?: string) => position || '-',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          onChange={() => onToggleStatus(record.id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      width: 180,
      sorter: (a, b) => {
        if (!a.lastLoginAt) return 1;
        if (!b.lastLoginAt) return -1;
        return new Date(a.lastLoginAt).getTime() - new Date(b.lastLoginAt).getTime();
      },
      render: (date?: string) => {
        if (!date) return <span style={{ color: '#8c8c8c' }}>Never</span>;
        const loginDate = new Date(date);
        return (
          <Tooltip title={loginDate.toLocaleString()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
              <Clock size={12} />
              {loginDate.toLocaleDateString()}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
            <Calendar size={12} />
            {new Date(date).toLocaleDateString()}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit User">
            <Button
              type="text"
              size="small"
              icon={<Edit size={16} />}
              onClick={() => onEdit(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete User">
              <Button
                type="text"
                size="small"
                icon={<Trash2 size={16} />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      scroll={{ x: 1400 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} users`,
      }}
      style={{
        background: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};
