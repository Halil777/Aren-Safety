import React, { useState, useMemo } from 'react';
import { Drawer, Form, Input, Select, DatePicker, InputNumber, Button, Space, message, AutoComplete, Divider, Card, Typography } from 'antd';
import { UserAddOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useCreateEmployee, useEmployees } from '@/features/employees/api';
import { useDepartmentsQuery } from '@/features/tenant/api/departments';
import type { Employee } from '@/shared/config/mock-employees';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface CreateEmployeeDrawerProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const CreateEmployeeModal: React.FC<CreateEmployeeDrawerProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const createEmployeeMutation = useCreateEmployee();
  const [selectedRole, setSelectedRole] = useState<string>('worker');

  // Fetch existing employees for autocomplete suggestions
  const { data: existingEmployees = [] } = useEmployees();

  // Fetch real departments from backend
  const { data: departmentsData = [], isLoading: departmentsLoading } = useDepartmentsQuery();

  // Extract unique departments from backend (active only)
  const departments = useMemo(
    () => departmentsData
      .filter((dept) => dept.status) // Only active departments
      .map((dept) => ({ value: dept.title_en })),
    [departmentsData]
  );

  const positions = useMemo(
    () => Array.from(new Set(existingEmployees.map((emp) => emp.position))).map((pos) => ({ value: pos })),
    [existingEmployees]
  );

  const workLocations = useMemo(
    () => Array.from(new Set(existingEmployees.map((emp) => emp.workLocation))).map((loc) => ({ value: loc })),
    [existingEmployees]
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert date to ISO string
      const hireDate = values.hireDate ? values.hireDate.toISOString() : new Date().toISOString();

      // Generate employee number if not provided
      const employeeNumber = values.employeeNumber || `EMP-${Date.now()}`;

      // Prepare employee data
      const newEmployee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
        employeeNumber,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        position: values.position,
        department: values.department,
        hireDate,
        status: values.status || 'active',
        workLocation: values.workLocation,
        safetyRole: values.safetyRole,
        certifications: values.certifications ? values.certifications.split(',').map((c: string) => c.trim()) : [],
        incidentCount: 0,
        observationsSubmitted: 0,
        shift: values.shift,

        // Inspector-specific
        licenseId: values.licenseId,
        region: values.region,
        assignedSites: values.assignedSites,
        lastAuditDate: values.lastAuditDate ? values.lastAuditDate.toISOString() : undefined,

        // Safety staff-specific
        expertise: values.expertise,
        certificationLevel: values.certificationLevel,
        yearsOfExperience: values.yearsOfExperience,

        // Emergency contact (optional)
        emergencyContact: values.emergencyContactName ? {
          name: values.emergencyContactName,
          relationship: values.emergencyContactRelationship || '',
          phone: values.emergencyContactPhone || '',
        } : undefined,
      };

      createEmployeeMutation.mutate(newEmployee, {
        onSuccess: () => {
          message.success('Employee created successfully!');
          form.resetFields();
          onSuccess?.();
          onCancel();
        },
        onError: (error) => {
          message.error(
            'Failed to create employee: ' + (error instanceof Error ? error.message : 'Unknown error')
          );
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Drawer
      title={
        <Space>
          <UserAddOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>Create New Employee</span>
        </Space>
      }
      placement="right"
      width="70%"
      onClose={handleCancel}
      open={open}
      extra={
        <Space>
          <Button icon={<CloseOutlined />} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={createEmployeeMutation.isPending}
            onClick={handleSubmit}
          >
            Create Employee
          </Button>
        </Space>
      }
      styles={{
        body: { paddingBottom: 80, background: '#f5f5f5' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'active',
          safetyRole: 'worker',
        }}
      >
        <Card
          title={<Text strong>Basic Information</Text>}
          style={{ marginBottom: 16 }}
          bordered={false}
        >
          <Form.Item
            label={<Text strong>Employee Number (Unique ID)</Text>}
            name="employeeNumber"
            tooltip="Leave empty to auto-generate"
            help="Optional: Provide a unique employee number or leave blank to auto-generate"
          >
            <Input size="large" placeholder="EMP-12345 (auto-generated if empty)" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label={<Text strong>First Name</Text>}
              name="firstName"
              rules={[{ required: true, message: 'Please enter first name' }]}
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="John" />
            </Form.Item>

            <Form.Item
              label={<Text strong>Last Name</Text>}
              name="lastName"
              rules={[{ required: true, message: 'Please enter last name' }]}
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="Smith" />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label={<Text strong>Email</Text>}
              name="email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' },
              ]}
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="john.smith@company.com" />
            </Form.Item>

            <Form.Item
              label={<Text strong>Phone</Text>}
              name="phone"
              rules={[{ required: true, message: 'Please enter phone number' }]}
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="+1 (555) 123-4567" />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label={<Text strong>Position</Text>}
              name="position"
              rules={[{ required: true, message: 'Please enter position' }]}
              style={{ flex: 1 }}
            >
              <AutoComplete
                size="large"
                options={positions}
                placeholder="Safety Officer"
                filterOption={(inputValue, option) =>
                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </Form.Item>

            <Form.Item
              label={<Text strong>Department</Text>}
              name="department"
              rules={[{ required: true, message: 'Please select department' }]}
              style={{ flex: 1 }}
            >
              <AutoComplete
                size="large"
                options={departments}
                placeholder={departmentsLoading ? 'Loading departments...' : 'Select or type department'}
                disabled={departmentsLoading}
                filterOption={(inputValue, option) =>
                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label={<Text strong>Work Location</Text>}
              name="workLocation"
              rules={[{ required: true, message: 'Please enter work location' }]}
              style={{ flex: 1 }}
            >
              <AutoComplete
                size="large"
                options={workLocations}
                placeholder="Main Office"
                filterOption={(inputValue, option) =>
                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </Form.Item>

            <Form.Item
              label={<Text strong>Hire Date</Text>}
              name="hireDate"
              style={{ flex: 1 }}
            >
              <DatePicker size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label={<Text strong>Status</Text>}
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
              style={{ flex: 1 }}
            >
              <Select size="large">
                <Option value="active">Active</Option>
                <Option value="on_leave">On Leave</Option>
                <Option value="suspended">Suspended</Option>
                <Option value="terminated">Terminated</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<Text strong>Safety Role</Text>}
              name="safetyRole"
              rules={[{ required: true, message: 'Please select safety role' }]}
              style={{ flex: 1 }}
            >
              <Select size="large" onChange={(value) => setSelectedRole(value)}>
                <Option value="worker">Worker</Option>
                <Option value="safety_team">Safety Team</Option>
                <Option value="inspector">Inspector</Option>
                <Option value="head_of_safety">Head of Safety</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            label={<Text strong>Shift</Text>}
            name="shift"
          >
            <Select size="large" allowClear placeholder="Select shift">
              <Option value="day">Day</Option>
              <Option value="night">Night</Option>
              <Option value="rotating">Rotating</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<Text strong>Certifications (comma-separated)</Text>}
            name="certifications"
          >
            <TextArea
              size="large"
              rows={3}
              placeholder="OSHA 30, First Aid, CPR"
            />
          </Form.Item>
        </Card>

        {/* Inspector-specific fields */}
        {selectedRole === 'inspector' && (
          <Card
            title={<Text strong>Inspector Information</Text>}
            style={{ marginBottom: 16 }}
            bordered={false}
          >
            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                label={<Text strong>License ID</Text>}
                name="licenseId"
                style={{ flex: 1 }}
              >
                <Input size="large" placeholder="LIC-12345" />
              </Form.Item>

              <Form.Item
                label={<Text strong>Region</Text>}
                name="region"
                style={{ flex: 1 }}
              >
                <Input size="large" placeholder="North Region" />
              </Form.Item>
            </Space>

            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                label={<Text strong>Assigned Sites</Text>}
                name="assignedSites"
                style={{ flex: 1 }}
              >
                <InputNumber size="large" min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label={<Text strong>Last Audit Date</Text>}
                name="lastAuditDate"
                style={{ flex: 1 }}
              >
                <DatePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Space>
          </Card>
        )}

        {/* Safety Team-specific fields */}
        {selectedRole === 'safety_team' && (
          <Card
            title={<Text strong>Safety Team Information</Text>}
            style={{ marginBottom: 16 }}
            bordered={false}
          >
            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                label={<Text strong>Expertise</Text>}
                name="expertise"
                style={{ flex: 1 }}
              >
                <Input size="large" placeholder="Fire Safety, PPE Management" />
              </Form.Item>

              <Form.Item
                label={<Text strong>Certification Level</Text>}
                name="certificationLevel"
                style={{ flex: 1 }}
              >
                <Select size="large">
                  <Option value="basic">Basic</Option>
                  <Option value="advanced">Advanced</Option>
                  <Option value="expert">Expert</Option>
                </Select>
              </Form.Item>
            </Space>

            <Form.Item
              label={<Text strong>Years of Experience</Text>}
              name="yearsOfExperience"
            >
              <InputNumber size="large" min={0} max={50} style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        )}

        <Card
          title={<Text strong>Emergency Contact (Optional)</Text>}
          style={{ marginBottom: 16 }}
          bordered={false}
        >
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label={<Text strong>Contact Name</Text>}
              name="emergencyContactName"
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="Jane Doe" />
            </Form.Item>

            <Form.Item
              label={<Text strong>Relationship</Text>}
              name="emergencyContactRelationship"
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="Spouse" />
            </Form.Item>
          </Space>

          <Form.Item
            label={<Text strong>Contact Phone</Text>}
            name="emergencyContactPhone"
          >
            <Input size="large" placeholder="+1 (555) 987-6543" />
          </Form.Item>
        </Card>
      </Form>
    </Drawer>
  );
};
