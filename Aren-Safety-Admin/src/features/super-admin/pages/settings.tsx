/**
 * Platform Settings Page
 *
 * Super Admin page for platform-wide settings
 */

import { useTranslation } from 'react-i18next';
import { Card, Tabs, Form, Input, Switch, Button, message, Divider } from 'antd';
import { Save } from 'lucide-react';
import styled from 'styled-components';

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors[theme.mode].textSecondary};
  margin: 0 0 16px 0;
  font-size: 14px;
`;

export default function PlatformSettingsPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success(t('superAdmin.settings.saveSuccess', 'Settings saved successfully'));
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>{t('superAdmin.settings.title', 'Platform Settings')}</PageTitle>
        <PageDescription>
          {t(
            'superAdmin.settings.description',
            'Configure platform-wide settings and preferences'
          )}
        </PageDescription>
      </PageHeader>

      <Card>
        <Tabs
          items={[
            {
              key: 'general',
              label: t('superAdmin.settings.tabs.general', 'General'),
              children: (
                <Form form={form} layout="vertical" onFinish={handleSave}>
                  <Form.Item
                    name="platformName"
                    label={t('superAdmin.settings.platformName', 'Platform Name')}
                    initialValue="Safety Management Platform"
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    name="supportEmail"
                    label={t('superAdmin.settings.supportEmail', 'Support Email')}
                    initialValue="support@platform.com"
                  >
                    <Input type="email" size="large" />
                  </Form.Item>

                  <Divider />

                  <Form.Item
                    name="allowSelfSignup"
                    label={t('superAdmin.settings.allowSelfSignup', 'Allow Self Sign-up')}
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="requireEmailVerification"
                    label={t(
                      'superAdmin.settings.requireEmailVerification',
                      'Require Email Verification'
                    )}
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<Save size={16} />} size="large">
                      {t('common.save', 'Save Changes')}
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'notifications',
              label: t('superAdmin.settings.tabs.notifications', 'Notifications'),
              children: (
                <div style={{ padding: 24 }}>
                  <p>
                    {t(
                      'superAdmin.settings.notificationsPlaceholder',
                      'Notification settings will be configured here.'
                    )}
                  </p>
                </div>
              ),
            },
            {
              key: 'integrations',
              label: t('superAdmin.settings.tabs.integrations', 'Integrations'),
              children: (
                <div style={{ padding: 24 }}>
                  <p>
                    {t(
                      'superAdmin.settings.integrationsPlaceholder',
                      'Third-party integrations (Stripe, email providers, etc.) will be configured here.'
                    )}
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
