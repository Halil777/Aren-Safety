import React, { useMemo, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, Space, message, AutoComplete, Card, Typography, Switch } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useUpdateUser, type User } from '@/features/users/api';
import { useDepartmentsQuery } from '@/features/tenant/api/departments';

const { Option } = Select;
const { Text } = Typography;

interface EditUserDrawerProps {
  open: boolean;
  user: User | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EditUserDrawer: React.FC<EditUserDrawerProps> = ({
  open,
  user,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const updateUserMutation = useUpdateUser();

  // Fetch departments from backend
  const { data: departmentsData = [], isLoading: departmentsLoading } = useDepartmentsQuery();

  // Extract unique departments from backend (active only)
  const departments = useMemo(
    () => departmentsData
      .filter((dept) => dept.status) // Only active departments
      .map((dept) => ({ value: dept.title_en })),
    [departmentsData]
  );

  // Pre-fill form when user changes
  useEffect(() => {
    if (user && open) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        department: user.department,
        position: user.position,
        isActive: user.isActive,
      });
    }
  }, [user, open, form]);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const values = await form.validateFields();

      const updateData: any = {
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        role: values.role,
        department: values.department,
        position: values.position,
        isActive: values.isActive,
      };

      // Only include password if it was changed
      if (values.password && values.password.trim() !== '') {
        updateData.password = values.password;
      }

      updateUserMutation.mutate(
        { id: user.id, userData: updateData },
        {
          onSuccess: () => {
            message.success('User updated successfully!');
            form.resetFields();
            onSuccess?.();
            onCancel();
          },
          onError: (error) => {
            message.error(
              'Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error')
            );
          },
        }
      );
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
          <EditOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>Edit User</span>
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
            loading={updateUserMutation.isPending}
            onClick={handleSubmit}
          >
            Save Changes
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
              label={<Text strong>New Password</Text>}
              name="password"
              help="Leave empty to keep current password"
              style={{ flex: 1 }}
            >
              <Input.Password size="large" placeholder="Leave empty to keep current" />
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
