import React from 'react';
import { Card, Form, Switch, Button, Space, Divider, message } from 'antd';
import { Bell, Mail, MessageSquare } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('Notification settings:', values);
      message.success('Notification settings saved successfully!');
    } catch (error) {
      message.error('Failed to save settings');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        emailNewObservation: true,
        emailObservationUpdate: true,
        emailWarning: true,
        emailReport: false,
        pushNewObservation: true,
        pushObservationUpdate: false,
        pushWarning: true,
        pushDeadline: true,
        inAppAll: true,
        inAppMentions: true,
        inAppAssignments: true,
      }}
    >
      {/* Email Notifications */}
      <Card
        title={
          <Space>
            <Mail size={18} />
            Email Notifications
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>New Observations</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Get notified when new observations are created
              </p>
            </div>
            <Form.Item name="emailNewObservation" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Observation Updates</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Get notified when observations are updated
              </p>
            </div>
            <Form.Item name="emailObservationUpdate" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Warnings & Fines</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Get notified about new warnings and fines
              </p>
            </div>
            <Form.Item name="emailWarning" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Weekly Reports</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Receive weekly summary reports via email
              </p>
            </div>
            <Form.Item name="emailReport" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>
        </Space>
      </Card>

      {/* Push Notifications */}
      <Card
        title={
          <Space>
            <Bell size={18} />
            Push Notifications
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>New Observations</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Browser notifications for new observations
              </p>
            </div>
            <Form.Item name="pushNewObservation" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Observation Updates</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Browser notifications for observation updates
              </p>
            </div>
            <Form.Item name="pushObservationUpdate" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Warnings</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Immediate notifications for warnings
              </p>
            </div>
            <Form.Item name="pushWarning" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Deadline Reminders</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Reminders for approaching deadlines
              </p>
            </div>
            <Form.Item name="pushDeadline" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>
        </Space>
      </Card>

      {/* In-App Notifications */}
      <Card
        title={
          <Space>
            <MessageSquare size={18} />
            In-App Notifications
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>All Activity</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                Show all notifications in the app
              </p>
            </div>
            <Form.Item name="inAppAll" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Mentions</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                When someone mentions you in comments
              </p>
            </div>
            <Form.Item name="inAppMentions" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Assignments</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                When tasks are assigned to you
              </p>
            </div>
            <Form.Item name="inAppAssignments" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>
        </Space>
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
