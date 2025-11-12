import React, { useState } from 'react';
import { Card, Form, Upload, Button, Input, message, Space, ColorPicker, Divider, Alert } from 'antd';
import { Upload as UploadIcon, Image as ImageIcon, Trash2, Info } from 'lucide-react';
import type { UploadFile, UploadProps } from 'antd';
import { useTheme } from '@/app/providers/theme-provider';

export const BrandingSettings: React.FC = () => {
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [logo, setLogo] = useState<UploadFile[]>([]);
  const [favicon, setFavicon] = useState<UploadFile[]>([]);
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#06b6d4');

  const handleLogoChange: UploadProps['onChange'] = ({ fileList }) => {
    setLogo(fileList.slice(-1)); // Keep only the last uploaded file
  };

  const handleFaviconChange: UploadProps['onChange'] = ({ fileList }) => {
    setFavicon(fileList.slice(-1));
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
    return false; // Prevent automatic upload
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Here you would upload the logo and save the settings to your backend
      console.log('Branding settings:', {
        ...values,
        logo: logo[0],
        favicon: favicon[0],
        primaryColor,
        accentColor,
      });

      message.success('Branding settings saved successfully!');
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please check all fields');
    }
  };

  const handleReset = () => {
    setLogo([]);
    setFavicon([]);
    setPrimaryColor('#6366f1');
    setAccentColor('#06b6d4');
    form.resetFields();
    message.info('Branding settings reset to default');
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Information Alert */}
      <Alert
        message="Tenant Branding"
        description="Customize your organization's appearance in the admin panel. Your logo will be displayed in the sidebar, login page, and other key areas."
        type="info"
        icon={<Info size={16} />}
        showIcon
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          displayName: '',
          companyName: '',
        }}
      >
        {/* Logo Upload */}
        <Card
          title={
            <Space>
              <ImageIcon size={18} />
              Company Logo
            </Space>
          }
          style={{ marginBottom: '16px' }}
        >
          <Form.Item
            label="Upload Logo"
            help="Recommended size: 200x60px. Max file size: 2MB. Formats: PNG, JPG, SVG"
          >
            <Upload
              listType="picture-card"
              fileList={logo}
              onChange={handleLogoChange}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {logo.length === 0 && (
                <div>
                  <UploadIcon size={24} />
                  <div style={{ marginTop: 8 }}>Upload Logo</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {logo.length > 0 && (
            <div
              style={{
                padding: '16px',
                background: isDarkMode ? '#141414' : '#f5f5f5',
                borderRadius: '8px',
                marginTop: '16px',
              }}
            >
              <p style={{ marginBottom: '8px', fontWeight: 500 }}>Logo Preview:</p>
              <div
                style={{
                  background: isDarkMode ? '#1f1f1f' : '#fff',
                  padding: '24px',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '120px',
                }}
              >
                {logo[0]?.thumbUrl && (
                  <img
                    src={logo[0].thumbUrl}
                    alt="Logo preview"
                    style={{ maxHeight: '80px', maxWidth: '100%' }}
                  />
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Favicon Upload */}
        <Card
          title="Favicon"
          style={{ marginBottom: '16px' }}
        >
          <Form.Item
            label="Upload Favicon"
            help="Recommended size: 32x32px or 64x64px. Formats: PNG, ICO"
          >
            <Upload
              listType="picture-card"
              fileList={favicon}
              onChange={handleFaviconChange}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {favicon.length === 0 && (
                <div>
                  <UploadIcon size={24} />
                  <div style={{ marginTop: 8 }}>Upload Favicon</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Card>

        {/* Company Information */}
        <Card title="Company Information" style={{ marginBottom: '16px' }}>
          <Form.Item
            name="displayName"
            label="Display Name"
            help="This name will appear in the admin panel"
          >
            <Input
              placeholder="e.g., Safety Management System"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="companyName"
            label="Company Name"
            help="Official company name for documents and reports"
          >
            <Input
              placeholder="e.g., Acme Corporation"
              size="large"
            />
          </Form.Item>
        </Card>

        {/* Color Scheme */}
        <Card title="Color Scheme" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Primary Color
              </label>
              <Space>
                <ColorPicker
                  value={primaryColor}
                  onChange={(color) => setPrimaryColor(color.toHexString())}
                  size="large"
                  showText
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{ width: '120px' }}
                  placeholder="#6366f1"
                />
              </Space>
              <p style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                Used for buttons, links, and primary UI elements
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Accent Color
              </label>
              <Space>
                <ColorPicker
                  value={accentColor}
                  onChange={(color) => setAccentColor(color.toHexString())}
                  size="large"
                  showText
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{ width: '120px' }}
                  placeholder="#06b6d4"
                />
              </Space>
              <p style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                Used for highlights and secondary elements
              </p>
            </div>

            {/* Color Preview */}
            <div
              style={{
                padding: '16px',
                background: isDarkMode ? '#141414' : '#f5f5f5',
                borderRadius: '8px',
                marginTop: '8px',
              }}
            >
              <p style={{ marginBottom: '12px', fontWeight: 500 }}>Color Preview:</p>
              <Space size="large">
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      background: primaryColor,
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}
                  />
                  <p style={{ fontSize: '12px', margin: 0 }}>Primary</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      background: accentColor,
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}
                  />
                  <p style={{ fontSize: '12px', margin: 0 }}>Accent</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}
                  />
                  <p style={{ fontSize: '12px', margin: 0 }}>Gradient</p>
                </div>
              </Space>
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
            style={{
              borderRadius: '6px',
              height: '44px',
            }}
          >
            Save Changes
          </Button>
          <Button
            size="large"
            onClick={handleReset}
            icon={<Trash2 size={18} />}
            style={{
              borderRadius: '6px',
              height: '44px',
            }}
          >
            Reset to Default
          </Button>
        </Space>
      </Form>
    </Space>
  );
};
