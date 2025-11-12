import React, { useState } from 'react';
import { Card, Form, Input, Upload, Button, Space, Divider, message, Avatar } from 'antd';
import { User, Mail, Phone, Upload as UploadIcon } from 'lucide-react';
import type { UploadFile, UploadProps } from 'antd';
import { useAuthStore } from '@/shared/stores/auth-store';

export const ProfileSettings: React.FC = () => {
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const [avatar, setAvatar] = useState<UploadFile[]>([]);

  const handleAvatarChange: UploadProps['onChange'] = ({ fileList }) => {
    setAvatar(fileList.slice(-1));
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    return false;
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('Profile settings:', values, avatar);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Please check all fields');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        position: '',
        department: '',
        bio: '',
      }}
    >
      {/* Profile Picture */}
      <Card title="Profile Picture" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Avatar
            size={100}
            src={avatar[0]?.thumbUrl || user?.avatar}
            style={{ backgroundColor: '#1890ff' }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Upload
            listType="picture"
            fileList={avatar}
            onChange={handleAvatarChange}
            beforeUpload={beforeUpload}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadIcon size={18} />} size="large">
              Change Avatar
            </Button>
          </Upload>
        </div>
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#8c8c8c' }}>
          Recommended: Square image, at least 200x200px
        </p>
      </Card>

      {/* Personal Information */}
      <Card
        title={
          <Space>
            <User size={18} />
            Personal Information
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input size="large" placeholder="John" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input size="large" placeholder="Doe" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' },
            ]}
          >
            <Input
              size="large"
              prefix={<Mail size={16} />}
              placeholder="john.doe@example.com"
              disabled
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input
              size="large"
              prefix={<Phone size={16} />}
              placeholder="+90 555 123 4567"
            />
          </Form.Item>
        </Space>
      </Card>

      {/* Work Information */}
      <Card title="Work Information" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="position"
            label="Position"
          >
            <Input size="large" placeholder="Safety Manager" />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
          >
            <Input size="large" placeholder="Safety" />
          </Form.Item>
        </div>

        <Form.Item
          name="bio"
          label="Bio"
          help="Brief description about yourself"
        >
          <Input.TextArea
            rows={4}
            placeholder="Tell us about yourself..."
            maxLength={500}
            showCount
          />
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
