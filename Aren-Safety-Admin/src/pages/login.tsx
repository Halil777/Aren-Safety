/**
 * Login Page
 *
 * Simple login page with mock authentication
 * Allows login as Super Admin or Tenant User
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Form, Input, Button, Space, Alert, Divider } from 'antd';
import { LogIn, User, Lock } from 'lucide-react';
import styled from 'styled-components';
import { useAuthStore } from '../shared/stores/auth-store';
import type { User as UserType } from '../shared/types/tenant';

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

const QuickLoginSection = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 8px;
`;

const QuickLoginTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors[theme.mode].textSecondary};
`;

// Mock users for quick login
const MOCK_USERS: Array<{
  id: string;
  email: string;
  password: string;
  user: UserType;
  redirectTo: string;
}> = [
  {
    id: 'super_admin',
    email: 'admin@platform.com',
    password: 'admin123',
    user: {
      id: 'admin_1',
      email: 'admin@platform.com',
      firstName: 'Super',
      lastName: 'Admin',
      isSuperAdmin: true,
      tenants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    redirectTo: '/super-admin',
  },
  {
    id: 'acme_owner',
    email: 'owner@acme.com',
    password: 'acme123',
    user: {
      id: 'user_acme_owner',
      email: 'owner@acme.com',
      firstName: 'John',
      lastName: 'Doe',
      isSuperAdmin: false,
      tenants: [
        {
          tenantId: 'tenant_acme',
          tenantName: 'ACME Construction',
          tenantSlug: 'acme',
          role: 'tenant_owner',
          isActive: true,
          invitedAt: new Date().toISOString(),
        },
      ],
      currentTenantId: 'tenant_acme',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    redirectTo: '/t/acme',
  },
  {
    id: 'techcorp_admin',
    email: 'admin@techcorp.com',
    password: 'tech123',
    user: {
      id: 'user_techcorp_admin',
      email: 'admin@techcorp.com',
      firstName: 'Jane',
      lastName: 'Smith',
      isSuperAdmin: false,
      tenants: [
        {
          tenantId: 'tenant_techcorp',
          tenantName: 'TechCorp Industries',
          tenantSlug: 'techcorp',
          role: 'tenant_admin',
          isActive: true,
          invitedAt: new Date().toISOString(),
        },
      ],
      currentTenantId: 'tenant_techcorp',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    redirectTo: '/t/techcorp',
  },
  {
    id: 'multi_tenant_user',
    email: 'user@example.com',
    password: 'user123',
    user: {
      id: 'user_multi',
      email: 'user@example.com',
      firstName: 'Multi',
      lastName: 'Tenant',
      isSuperAdmin: false,
      tenants: [
        {
          tenantId: 'tenant_acme',
          tenantName: 'ACME Construction',
          tenantSlug: 'acme',
          role: 'inspector',
          isActive: true,
          invitedAt: new Date().toISOString(),
        },
        {
          tenantId: 'tenant_techcorp',
          tenantName: 'TechCorp Industries',
          tenantSlug: 'techcorp',
          role: 'head_of_safety',
          isActive: true,
          invitedAt: new Date().toISOString(),
        },
      ],
      currentTenantId: 'tenant_acme',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    redirectTo: '/t/acme',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user by email and password
    const mockUser = MOCK_USERS.find(
      (u) => u.email === values.email && u.password === values.password
    );

    if (mockUser) {
      // Login successful
      login(mockUser.user, 'mock_token_' + mockUser.id);
      navigate(mockUser.redirectTo);
    } else {
      // Login failed
      setError('Invalid email or password. Please try one of the quick login options below.');
      setLoading(false);
    }
  };

  const handleQuickLogin = (mockUser: typeof MOCK_USERS[0]) => {
    login(mockUser.user, 'mock_token_' + mockUser.id);
    navigate(mockUser.redirectTo);
  };

  return (
    <LoginContainer>
      <LoginCard title="Safety Management Platform">
        <Logo>🛡️</Logo>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<User size={16} />}
              placeholder="admin@platform.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
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
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>Quick Login (Demo)</Divider>

        <QuickLoginSection>
          <QuickLoginTitle>Demo Accounts:</QuickLoginTitle>

          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {MOCK_USERS.map((mockUser) => (
              <Button
                key={mockUser.id}
                block
                onClick={() => handleQuickLogin(mockUser)}
                style={{ textAlign: 'left' }}
              >
                <div>
                  <strong>{mockUser.user.firstName} {mockUser.user.lastName}</strong>
                  <br />
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    {mockUser.email}
                    {mockUser.user.isSuperAdmin
                      ? ' (Super Admin)'
                      : ` (${mockUser.user.tenants[0]?.role})`}
                  </span>
                </div>
              </Button>
            ))}
          </Space>

          <Alert
            type="info"
            message="Development Mode"
            description="These are demo accounts for testing. In production, use real credentials."
            style={{ marginTop: 16 }}
            showIcon
          />
        </QuickLoginSection>
      </LoginCard>
    </LoginContainer>
  );
}
