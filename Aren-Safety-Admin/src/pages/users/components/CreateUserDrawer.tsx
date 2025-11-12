import React, { useMemo } from 'react';
import { Drawer, Form, Input, Select, Button, Space, message, AutoComplete, Card, Typography, Switch } from 'antd';
import { UserAddOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useCreateUser } from '@/features/users/api';
import { useDepartmentsQuery } from '@/features/tenant/api/departments';

const { Option } = Select;
const { Text } = Typography;

interface CreateUserDrawerProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const CreateUserDrawer: React.FC<CreateUserDrawerProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const createUserMutation = useCreateUser();

  // Fetch departments from backend
  const { data: departmentsData = [], isLoading: departmentsLoading } = useDepartmentsQuery();

  // Extract unique departments from backend (active only)
  const departments = useMemo(
    () => departmentsData
      .filter((dept) => dept.status) // Only active departments
      .map((dept) => ({ value: dept.title_en })),
    [departmentsData]
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const newUser = {
        username: values.username,
        password: values.password,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone || '',
        role: values.role,
        department: values.department,
        position: values.position,
        isActive: values.isActive ?? true,
      };

      createUserMutation.mutate(newUser, {
        onSuccess: () => {
          message.success('User created successfully!');
          form.resetFields();
          onSuccess?.();
          onCancel();
        },
        onError: (error) => {
          message.error(
            'Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error')
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
          <span style={{ fontSize: '18px', fontWeight: 600 }}>Create New User</span>
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
            loading={createUserMutation.isPending}
            onClick={handleSubmit}
          >
            Create User
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
          role: 'user',
          isActive: true,
        }}
      >
        <Card
          title={<Text strong>Account Information</Text>}
          style={{ marginBottom: 16 }}
          bordered={false}
        >
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label={<Text strong>Username</Text>}
              name="username"
              rules={[{ required: true, message: 'Please enter username' }]}
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="john.smith" />
            </Form.Item>

            <Form.Item
              label={<Text strong>Password</Text>}
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
              style={{ flex: 1 }}
            >
              <Input.Password size="large" placeholder="******" />
            </Form.Item>
          </Space>

          <Form.Item
            label={<Text strong>Email</Text>}
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' },
            ]}
          >
            <Input size="large" placeholder="john.smith@company.com" />
          </Form.Item>
        </Card>

        <Card
          title={<Text strong>Personal Information</Text>}
          style={{ marginBottom: 16 }}
          bordered={false}
        >
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

          <Form.Item
            label={<Text strong>Phone</Text>}
            name="phone"
          >
            <Input size="large" placeholder="+1 (555) 123-4567" />
          </Form.Item>
        </Card>

        <Card
          title={<Text strong>Role & Department</Text>}
          style={{ marginBottom: 16 }}
          bordered={false}
        >
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label={<Text strong>Role</Text>}
              name="role"
              rules={[{ required: true, message: 'Please select role' }]}
              style={{ flex: 1 }}
            >
              <Select size="large">
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="user">User</Option>
                <Option value="viewer">Viewer</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<Text strong>Department</Text>}
              name="department"
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

          <Form.Item
            label={<Text strong>Position</Text>}
            name="position"
          >
            <Input size="large" placeholder="Safety Manager" />
          </Form.Item>
        </Card>

        <Card
          title={<Text strong>Account Status</Text>}
          style={{ marginBottom: 16 }}
          bordered={false}
        >
          <Form.Item
            label={<Text strong>Active Status</Text>}
            name="isActive"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Card>
      </Form>
    </Drawer>
  );
};
