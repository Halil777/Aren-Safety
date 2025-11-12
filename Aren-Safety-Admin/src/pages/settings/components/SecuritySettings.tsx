import React from 'react';
import { Card, Form, Input, Button, Space, Divider, Switch, Alert, List, message } from 'antd';
import { Lock, Shield, Key, Smartphone } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const [form] = Form.useForm();

  const handleChangePassword = async () => {
    try {
      const values = await form.validateFields(['currentPassword', 'newPassword', 'confirmPassword']);

      if (values.newPassword !== values.confirmPassword) {
        message.error('New passwords do not match!');
        return;
      }

      console.log('Change password:', values);
      message.success('Password changed successfully!');
      form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    } catch (error) {
      message.error('Please check all fields');
    }
  };

  const sessions = [
    {
      device: 'Windows PC - Chrome',
      location: 'Istanbul, Turkey',
      lastActive: '2 minutes ago',
      current: true,
    },
    {
      device: 'iPhone 14 - Safari',
      location: 'Istanbul, Turkey',
      lastActive: '2 hours ago',
      current: false,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Change Password */}
      <Card
        title={
          <Space>
            <Lock size={18} />
            Change Password
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <Input.Password size="large" placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password size="large" placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            rules={[{ required: true, message: 'Please confirm new password' }]}
          >
            <Input.Password size="large" placeholder="Confirm new password" />
          </Form.Item>

          <Button
            type="primary"
            size="large"
            onClick={handleChangePassword}
            style={{ borderRadius: '6px', height: '44px' }}
          >
            Update Password
          </Button>
        </Form>

        <Alert
          message="Password Requirements"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginTop: '16px' }}
        />
      </Card>

      {/* Two-Factor Authentication */}
      <Card
        title={
          <Space>
            <Smartphone size={18} />
            Two-Factor Authentication
          </Space>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Enable 2FA</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div>

          <Alert
            message="Two-factor authentication is not enabled"
            description="Protect your account with an additional security layer. You'll need your phone to sign in."
            type="warning"
            showIcon
          />

          <Button size="large" icon={<Key size={18} />} disabled>
            Setup 2FA
          </Button>
        </Space>
      </Card>

      {/* Active Sessions */}
      <Card
        title={
          <Space>
            <Shield size={18} />
            Active Sessions
          </Space>
        }
      >
        <List
          dataSource={sessions}
          renderItem={(session) => (
            <List.Item
              actions={[
                session.current ? (
                  <span style={{ color: '#52c41a', fontWeight: 500 }}>Current</span>
                ) : (
                  <Button type="link" danger size="small">
                    Revoke
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                title={session.device}
                description={
                  <Space direction="vertical" size={0}>
                    <span>{session.location}</span>
                    <span style={{ fontSize: '12px' }}>Last active: {session.lastActive}</span>
                  </Space>
                }
              />
            </List.Item>
          )}
        />

        <Divider />

        <Button danger size="large" style={{ borderRadius: '6px', height: '44px' }}>
          Sign Out All Other Sessions
        </Button>
      </Card>
    </Space>
  );
};
