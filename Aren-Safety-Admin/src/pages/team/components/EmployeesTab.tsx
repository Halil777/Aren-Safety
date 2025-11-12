import React, { useState, useMemo, useCallback } from 'react';
import { Card, Descriptions, Drawer, Space, Table, Tag, Alert, Spin, Button, Popconfirm, message, Tooltip, Typography } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEmployees, useUpdateEmployee, useDeleteEmployee } from '@/features/employees/api';
import { createEmployeeColumns } from '../utils/tableColumns';
import type { Employee } from '@/shared/config/mock-employees';

const { Text } = Typography;

const EmployeesTabComponent: React.FC = () => {
  // Fetch employees data
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  // Employee details drawer
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');

  // Get unique values for column filters
  const departments = useMemo(
    () => Array.from(new Set(employees.map((emp) => emp.department))),
    [employees]
  );

  const locations = useMemo(
    () => Array.from(new Set(employees.map((emp) => emp.workLocation))),
    [employees]
  );

  // Memoized callback for showing employee details
  const handleViewEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setDrawerMode('view');
    setIsDrawerVisible(true);
  }, []);

  // Memoized callback for editing employee
  const handleEditEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setDrawerMode('edit');
    setIsDrawerVisible(true);
  }, []);

  // Memoized callback for deleting employee
  const handleDeleteEmployee = useCallback((employee: Employee) => {
    deleteEmployeeMutation.mutate(employee.id, {
      onSuccess: () => {
        message.success('Employee deleted successfully');
      },
      onError: (err) => {
        message.error('Failed to delete employee: ' + (err instanceof Error ? err.message : 'Unknown error'));
      },
    });
  }, [deleteEmployeeMutation]);

  // Memoized callback for closing drawer
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerVisible(false);
    setSelectedEmployee(null);
  }, []);

  // Table columns with built-in filters and actions
  const columns = useMemo(() => {
    const baseColumns = createEmployeeColumns(departments, locations, handleViewEmployee);

    // Add actions column
    return [
      ...baseColumns,
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right' as const,
        width: 120,
        render: (_: any, record: Employee) => (
          <Space size="small">
            <Tooltip title="View">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewEmployee(record)}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditEmployee(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete employee"
                description="Are you sure you want to delete this employee?"
                onConfirm={() => handleDeleteEmployee(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  loading={deleteEmployeeMutation.isPending}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];
  }, [departments, locations, handleViewEmployee, handleEditEmployee, handleDeleteEmployee, deleteEmployeeMutation.isPending]);

  // Show error state
  if (isError) {
    return (
      <Card>
        <Alert
          message="Error Loading Employees"
          description={error instanceof Error ? error.message : 'Failed to load employees'}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <>
      {/* Employees Table */}
      <Card>
        <Spin spinning={isLoading} tip="Loading employees...">
          <Table
            columns={columns}
            dataSource={employees}
            rowKey="id"
            scroll={{ x: 1500 }}
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} employees`,
            }}
          />
        </Spin>
      </Card>

      {/* Employee Details Drawer */}
      <Drawer
        title={
          <Space>
            {drawerMode === 'view' ? (
              <>
                <EyeOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                <span style={{ fontSize: '18px', fontWeight: 600 }}>Employee Details</span>
              </>
            ) : (
              <>
                <EditOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                <span style={{ fontSize: '18px', fontWeight: 600 }}>Edit Employee</span>
              </>
            )}
          </Space>
        }
        placement="right"
        width="70%"
        onClose={handleCloseDrawer}
        open={isDrawerVisible}
        styles={{
          body: { paddingBottom: 80, background: '#f5f5f5' }
        }}
      >
        {selectedEmployee && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header Card with Avatar */}
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </div>
                <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  {selectedEmployee.employeeNumber}
                </Tag>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  ID: {selectedEmployee.id}
                </Text>
              </Space>
            </Card>

            {/* Basic Information */}
            <Card title={<Text strong style={{ fontSize: '16px' }}>Basic Information</Text>} bordered={false}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label={<Text strong>Position</Text>}>
                  {selectedEmployee.position}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Department</Text>}>
                  <Tag color="blue">{selectedEmployee.department}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Work Location</Text>}>
                  <Tag color="green">{selectedEmployee.workLocation}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Status</Text>}>
                  <Tag color={selectedEmployee.status === 'active' ? 'success' : 'warning'}>
                    {selectedEmployee.status.replace('_', ' ').toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Hire Date</Text>}>
                  {new Date(selectedEmployee.hireDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Shift</Text>}>
                  {selectedEmployee.shift ? (
                    <Tag color="purple">{selectedEmployee.shift.toUpperCase()}</Tag>
                  ) : '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Contact Information */}
            <Card title={<Text strong style={{ fontSize: '16px' }}>Contact Information</Text>} bordered={false}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label={<Text strong>Email</Text>}>
                  <a href={`mailto:${selectedEmployee.email}`}>{selectedEmployee.email}</a>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Phone</Text>}>
                  <a href={`tel:${selectedEmployee.phone}`}>{selectedEmployee.phone}</a>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Safety Information */}
            <Card title={<Text strong style={{ fontSize: '16px' }}>Safety Information</Text>} bordered={false}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label={<Text strong>Safety Role</Text>} span={2}>
                  {selectedEmployee.safetyRole ? (
                    <Tag color="purple" style={{ fontSize: '13px', padding: '4px 12px' }}>
                      {selectedEmployee.safetyRole.replace('_', ' ').toUpperCase()}
                    </Tag>
                  ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Certifications</Text>} span={2}>
                  <Space wrap>
                    {selectedEmployee.certifications?.map((cert) => (
                      <Tag key={cert} color="cyan">
                        {cert}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Last Training</Text>}>
                  {selectedEmployee.lastTrainingDate
                    ? new Date(selectedEmployee.lastTrainingDate).toLocaleDateString()
                    : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Training Expiry</Text>}>
                  {selectedEmployee.trainingExpiryDate
                    ? new Date(selectedEmployee.trainingExpiryDate).toLocaleDateString()
                    : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Incidents</Text>}>
                  <Tag color={selectedEmployee.incidentCount > 0 ? 'error' : 'success'}>
                    {selectedEmployee.incidentCount}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Observations</Text>}>
                  <Tag color="processing">{selectedEmployee.observationsSubmitted}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Emergency Contact */}
            {selectedEmployee.emergencyContact && (
              <Card title={<Text strong style={{ fontSize: '16px' }}>Emergency Contact</Text>} bordered={false}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label={<Text strong>Name</Text>}>
                    {selectedEmployee.emergencyContact.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Text strong>Relationship</Text>}>
                    {selectedEmployee.emergencyContact.relationship}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Text strong>Phone</Text>} span={2}>
                    <a href={`tel:${selectedEmployee.emergencyContact.phone}`}>
                      {selectedEmployee.emergencyContact.phone}
                    </a>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Space>
        )}
      </Drawer>
    </>
  );
};

EmployeesTabComponent.displayName = 'EmployeesTab';

export const EmployeesTab = React.memo(EmployeesTabComponent);
