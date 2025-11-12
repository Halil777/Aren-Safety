import React, { useEffect } from 'react';
import { Card, Form, Input, Select, Switch, Button, Space, Divider, message, Spin } from 'antd';
import { Globe, Clock } from 'lucide-react';
import { useSettings, useUpdateSettings } from '../api';

export const GeneralSettings: React.FC = () => {
  const [form] = Form.useForm();
  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        organizationName: settings.organizationName || 'Acme Corporation',
        timezone: settings.timezone || 'Europe/Istanbul',
        defaultLocale: settings.defaultLocale || 'en',
      });
    }
  }, [settings, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateSettingsMutation.mutateAsync(values);
      message.success('Settings saved successfully!');
    } catch (error) {
      message.error('Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        organizationName: 'Acme Corporation',
        timezone: 'Europe/Istanbul',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        enableNotifications: true,
        enableEmailReports: true,
        autoSaveInterval: 5,
      }}
    >
      {/* Organization */}
      <Card
        title={
          <Space>
            <Globe size={18} />
            Organization
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <Form.Item
          name="organizationName"
          label="Organization Name"
          rules={[{ required: true, message: 'Please enter organization name' }]}
        >
          <Input size="large" placeholder="Acme Corporation" />
        </Form.Item>

        <Form.Item
          name="organizationEmail"
          label="Organization Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input size="large" placeholder="contact@company.com" />
        </Form.Item>

        <Form.Item
          name="organizationPhone"
          label="Phone Number"
        >
          <Input size="large" placeholder="+90 555 123 4567" />
        </Form.Item>

        <Form.Item
          name="organizationAddress"
          label="Address"
        >
          <Input.TextArea
            rows={3}
            placeholder="Company address..."
          />
        </Form.Item>
      </Card>

      {/* Regional Settings */}
      <Card
        title={
          <Space>
            <Clock size={18} />
            Regional Settings
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <Form.Item
          name="timezone"
          label="Timezone"
          rules={[{ required: true, message: 'Please select timezone' }]}
        >
          <Select size="large" showSearch>
            <Select.Option value="Europe/Istanbul">Europe/Istanbul (GMT+3)</Select.Option>
            <Select.Option value="Europe/London">Europe/London (GMT+0)</Select.Option>
            <Select.Option value="America/New_York">America/New York (GMT-5)</Select.Option>
            <Select.Option value="Asia/Dubai">Asia/Dubai (GMT+4)</Select.Option>
            <Select.Option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="language"
          label="Default Language"
          rules={[{ required: true, message: 'Please select language' }]}
        >
          <Select size="large">
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="ru">Русский (Russian)</Select.Option>
            <Select.Option value="tr">Türkçe (Turkish)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="dateFormat"
          label="Date Format"
          rules={[{ required: true, message: 'Please select date format' }]}
        >
          <Select size="large">
            <Select.Option value="DD/MM/YYYY">DD/MM/YYYY</Select.Option>
            <Select.Option value="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
            <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="timeFormat"
          label="Time Format"
          rules={[{ required: true, message: 'Please select time format' }]}
        >
          <Select size="large">
            <Select.Option value="24h">24-hour (14:30)</Select.Option>
            <Select.Option value="12h">12-hour (2:30 PM)</Select.Option>
          </Select>
        </Form.Item>
      </Card>

      {/* System Preferences */}
      <Card title="System Preferences" style={{ marginBottom: '16px' }}>
        <Form.Item
          name="enableNotifications"
          label="Enable Notifications"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="enableEmailReports"
          label="Enable Email Reports"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="autoSaveInterval"
          label="Auto-save Interval (minutes)"
          help="How often to auto-save form data"
        >
          <Select size="large">
            <Select.Option value={1}>1 minute</Select.Option>
            <Select.Option value={5}>5 minutes</Select.Option>
            <Select.Option value={10}>10 minutes</Select.Option>
            <Select.Option value={15}>15 minutes</Select.Option>
          </Select>
        </Form.Item>
      </Card>

      <Divider />

      {/* Action Buttons */}
      <Space>
        <Button
          type="primary"
          size="large"
          onClick={handleSave}
          style={{ borderRadius: '6px', height: '44px' }}
        >
          Save Changes
        </Button>
        <Button
          size="large"
          onClick={() => form.resetFields()}
          style={{ borderRadius: '6px', height: '44px' }}
        >
          Reset
        </Button>
      </Space>
    </Form>
  );
};
