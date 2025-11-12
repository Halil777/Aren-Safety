/**
 * Login Page (Backend)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Form, Input, Button, Space, Alert, Divider } from 'antd';
import { LogIn, User, Lock } from 'lucide-react';
import styled from 'styled-components';
import { useLoginMutation } from '@/features/auth/api';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  .ant-card-head {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border-bottom: none;

    .ant-card-head-title {
      color: white;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
    }
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLoginMutation();
  const [error, setError] = useState('');

  const handleLogin = async (values: { login: string; password: string }) => {
    setError('');
    try {
      const data = await mutateAsync(values);
      if (data.user.isSuperAdmin) {
        navigate('/super-admin');
      } else if (data.user.tenants && data.user.tenants.length > 0) {
        navigate(`/t/${data.user.tenants[0].tenantSlug}`);
      } else {
        navigate('/');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <LoginContainer>
      <LoginCard title="Safety Management Platform">
        <Logo>Safety</Logo>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Login"
            name="login"
            initialValue="superadmin@gmail.com"
            rules={[
              { required: true, message: 'Please enter your login' },
            ]}
          >
            <Input
              prefix={<User size={16} />}
              placeholder="superadmin@gmail.com"
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            initialValue="superAdmin123!"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<Lock size={16} />}
              placeholder="Enter password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          {error && (
            <Alert
              type="error"
              message={error}
              style={{ marginBottom: 16 }}
              closable
              onClose={() => setError('')}
            />
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LogIn size={16} />}
              size="large"
              block
              loading={isPending}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>Tip</Divider>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert type="info" message="Use superadmin@gmail.com / superAdmin123!" showIcon />
        </Space>
      </LoginCard>
    </LoginContainer>
  );
}
