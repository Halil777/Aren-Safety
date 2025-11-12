import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Tabs,
  Space,
  Tag,
  Checkbox,
  Divider,
  Alert,
  Row,
  Col,
} from 'antd';
import { Mail, User, Briefcase, Building2, Shield, Lock } from 'lucide-react';
import type { AdminUser, UserFormData } from '../types';
import type { UserRole, Permission } from '@/shared/types/tenant';
import {
  ROLE_NAMES,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  PERMISSION_CATEGORIES,
  PERMISSION_NAMES,
} from '../config/rolePermissions';

interface UserModalProps {
  visible: boolean;
  user: AdminUser | null;
  onSave: (user: AdminUser) => void;
  onCancel: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  visible,
  user,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm<UserFormData>();
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer');
  const [customPermissions, setCustomPermissions] = useState<Permission[]>([]);
  const [useCustomPermissions, setUseCustomPermissions] = useState(false);

  useEffect(() => {
    if (visible && user) {
      // Editing existing user
      form.setFieldsValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        position: user.position,
        isActive: user.isActive,
      });
      setSelectedRole(user.role);
      if (user.permissions) {
        setCustomPermissions(user.permissions);
        setUseCustomPermissions(true);
      } else {
        setCustomPermissions(ROLE_PERMISSIONS[user.role] || []);
        setUseCustomPermissions(false);
      }
    } else if (visible) {
      // Creating new user
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        role: 'viewer',
      });
      setSelectedRole('viewer');
      setCustomPermissions(ROLE_PERMISSIONS['viewer']);
      setUseCustomPermissions(false);
    }
  }, [visible, user, form]);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (!useCustomPermissions) {
      setCustomPermissions(ROLE_PERMISSIONS[role] || []);
    }
  };

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    if (checked) {
      setCustomPermissions([...customPermissions, permission]);
    } else {
      setCustomPermissions(customPermissions.filter(p => p !== permission));
    }
    setUseCustomPermissions(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const userData: AdminUser = {
        id: user?.id || '',
        ...values,
        permissions: useCustomPermissions ? customPermissions : undefined,
        createdAt: user?.createdAt || new Date().toISOString(),
        lastLoginAt: user?.lastLoginAt,
      };
      onSave(userData);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const defaultPermissions = ROLE_PERMISSIONS[selectedRole] || [];
  const hasCustomPermissions = useCustomPermissions ||
    (customPermissions.length !== defaultPermissions.length ||
    !customPermissions.every(p => defaultPermissions.includes(p)));

  return (
    <Modal
      title={
        <Space>
          <User size={20} />
          {user ? 'Edit User' : 'Create New User'}
        </Space>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={800}
      okText={user ? 'Update' : 'Create'}
      cancelText="Cancel"
    >
      <Tabs
        defaultActiveKey="details"
        items={[
          {
            key: 'details',
            label: (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} />
                User Details
              </span>
            ),
            children: (
              <Form
                form={form}
                layout="vertical"
                style={{ marginTop: '20px' }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true, message: 'Please enter first name' }]}
                    >
                      <Input
                        prefix={<User size={16} />}
                        placeholder="John"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true, message: 'Please enter last name' }]}
                    >
                      <Input
                        prefix={<User size={16} />}
                        placeholder="Doe"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input
                    prefix={<Mail size={16} />}
                    placeholder="john.doe@example.com"
                    size="large"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="department"
                      label="Department"
                    >
                      <Input
                        prefix={<Building2 size={16} />}
                        placeholder="Safety"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="position"
                      label="Position"
                    >
                      <Input
                        prefix={<Briefcase size={16} />}
                        placeholder="Safety Manager"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="isActive"
                  label="Account Status"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'role',
            label: (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} />
                Role & Permissions
              </span>
            ),
            children: (
              <div style={{ marginTop: '20px' }}>
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="role"
                    label="User Role"
                    rules={[{ required: true, message: 'Please select a role' }]}
                  >
                    <Select
                      size="large"
                      onChange={handleRoleChange}
                      placeholder="Select a role"
                      options={Object.entries(ROLE_NAMES)
                        .filter(([key]) => key !== 'super_admin')
                        .map(([value, label]) => ({
                          value,
                          label: (
                            <div>
                              <div style={{ fontWeight: 500 }}>{label}</div>
                              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                {ROLE_DESCRIPTIONS[value as UserRole]}
                              </div>
                            </div>
                          ),
                        }))}
                    />
                  </Form.Item>
                </Form>

                <Divider orientation="left">
                  <Space>
                    <Lock size={16} />
                    Permissions
                    {hasCustomPermissions && (
                      <Tag color="orange">Custom</Tag>
                    )}
                  </Space>
                </Divider>

                <Alert
                  message={`Default permissions for ${ROLE_NAMES[selectedRole] || 'this role'}`}
                  description={ROLE_DESCRIPTIONS[selectedRole]}
                  type="info"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />

                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
                    <div key={category}>
                      <div style={{
                        fontWeight: 600,
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: '#1890ff',
                      }}>
                        {category}
                      </div>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {permissions.map((permission) => (
                          <Checkbox
                            key={permission}
                            checked={customPermissions.includes(permission)}
                            onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                            style={{ width: '100%' }}
                          >
                            <span style={{ fontSize: '13px' }}>
                              {PERMISSION_NAMES[permission]}
                            </span>
                          </Checkbox>
                        ))}
                      </Space>
                    </div>
                  ))}
                </Space>

                {hasCustomPermissions && (
                  <Alert
                    message="Custom Permissions Enabled"
                    description="This user has custom permissions that differ from the default role permissions."
                    type="warning"
                    showIcon
                    style={{ marginTop: '16px' }}
                  />
                )}
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};
