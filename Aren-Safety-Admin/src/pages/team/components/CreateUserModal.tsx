import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, App, Row, Col, Select, Tag, Divider, Button, Space, Badge } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, TeamOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCreateUser } from '@/features/users/api';
import { useUserRoles } from '@/features/user-roles/api';
import { useTheme } from '@/app/providers/theme-provider';

interface CreateUserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onCancel, onSuccess }) => {
  const { message } = App.useApp();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [form] = Form.useForm();
  const createUserMutation = useCreateUser();
  const { data: userRoles = [], isLoading: isLoadingRoles } = useUserRoles();
  const [customPosition, setCustomPosition] = useState('');

  const currentLanguage = i18n.language as 'en' | 'ru' | 'tr';

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setCustomPosition('');
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      createUserMutation.mutate(values, {
        onSuccess: () => {
          message.success(t('team.createUserModal.createSuccess'));
          form.resetFields();
          onSuccess?.();
          onCancel();
        },
        onError: (error: any) => {
          message.error(error.response?.data?.message || t('team.createUserModal.createError'));
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserOutlined style={{ fontSize: '20px', color: '#fff' }} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 600 }}>
            {t('team.createUserModal.title')}
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={t('team.createUserModal.createButton')}
      cancelText={t('team.createUserModal.cancelButton')}
      width={820}
      confirmLoading={createUserMutation.isPending}
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
          paddingTop: '24px',
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isActive: true,
          role: 'user',
        }}
      >
        {/* Hidden role field - defaults to 'user' */}
        <Form.Item name="role" hidden>
          <Input />
        </Form.Item>

        {/* Account Information */}
        <div style={{
          marginBottom: 24,
          padding: '20px',
          background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`
        }}>
          <h3 style={{ marginBottom: 16, fontSize: '16px', fontWeight: 600, color: isDarkMode ? '#fff' : '#000' }}>
            <LockOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            {t('team.createUserModal.accountInformation')}
            <Badge count={t('team.createUserModal.required')} style={{ marginLeft: 8, backgroundColor: '#52c41a' }} />
          </h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label={t('team.createUserModal.username')}
                rules={[
                  { required: true, message: t('team.createUserModal.usernameRequired') },
                  { min: 3, message: t('team.createUserModal.usernameMin') },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: t('team.createUserModal.usernamePattern') },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder={t('team.createUserModal.usernamePlaceholder')}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label={t('team.createUserModal.password')}
                rules={[
                  { required: true, message: t('team.createUserModal.passwordRequired') },
                  { min: 6, message: t('team.createUserModal.passwordMin') },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder={t('team.createUserModal.passwordPlaceholder')}
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Personal Information */}
        <div style={{
          marginBottom: 24,
          padding: '20px',
          background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`
        }}>
          <h3 style={{ marginBottom: 16, fontSize: '16px', fontWeight: 600, color: isDarkMode ? '#fff' : '#000' }}>
            <UserOutlined style={{ marginRight: 8, color: '#722ed1' }} />
            {t('team.createUserModal.personalInformation')}
            <Badge count={t('team.createUserModal.required')} style={{ marginLeft: 8, backgroundColor: '#722ed1' }} />
          </h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label={t('team.createUserModal.firstName')}
                rules={[{ required: true, message: t('team.createUserModal.firstNameRequired') }]}
              >
                <Input size="large" placeholder={t('team.createUserModal.firstNamePlaceholder')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label={t('team.createUserModal.lastName')}
                rules={[{ required: true, message: t('team.createUserModal.lastNameRequired') }]}
              >
                <Input size="large" placeholder={t('team.createUserModal.lastNamePlaceholder')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label={t('team.createUserModal.email')}
                rules={[
                  { required: true, message: t('team.createUserModal.emailRequired') },
                  { type: 'email', message: t('team.createUserModal.emailInvalid') },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder={t('team.createUserModal.emailPlaceholder')}
                  type="email"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={t('team.createUserModal.phone')}
              >
                <Input
                  size="large"
                  prefix={<PhoneOutlined />}
                  placeholder={t('team.createUserModal.phonePlaceholder')}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Work Information */}
        <div style={{
          marginBottom: 24,
          padding: '20px',
          background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`
        }}>
          <h3 style={{ marginBottom: 16, fontSize: '16px', fontWeight: 600, color: isDarkMode ? '#fff' : '#000' }}>
            <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            {t('team.createUserModal.workInformation')}
            <Badge count={t('team.createUserModal.required')} style={{ marginLeft: 8, backgroundColor: '#1890ff' }} />
          </h3>
          <Form.Item
            name="position"
            label={
              <span style={{ fontWeight: 500, fontSize: '14px' }}>
                {t('team.createUserModal.position')}
              </span>
            }
            rules={[{ required: true, message: t('team.createUserModal.positionRequired') }]}
            tooltip={t('team.createUserModal.positionTooltip')}
          >
            <Select
              size="large"
              showSearch
              placeholder={
                <span style={{ color: '#bfbfbf' }}>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  {t('team.createUserModal.positionPlaceholder')}
                </span>
              }
              loading={isLoadingRoles}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              dropdownRender={(menu) => (
                <>
                  {menu}
                  {customPosition && (
                    <>
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            form.setFieldsValue({ position: customPosition });
                            setCustomPosition('');
                          }}
                          style={{ width: '100%' }}
                        >
                          {t('team.createUserModal.useCustom', { value: customPosition })}
                        </Button>
                      </Space>
                    </>
                  )}
                </>
              )}
              onSearch={(value) => setCustomPosition(value)}
              options={userRoles.map((role) => ({
                value: role[`name_${currentLanguage}`],
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <TeamOutlined style={{ color: '#1890ff' }} />
                      <span style={{ fontWeight: 500 }}>{role[`name_${currentLanguage}`]}</span>
                    </Space>
                    <Space size={4}>
                      {currentLanguage !== 'en' && (
                        <Tag color="blue" style={{ margin: 0, fontSize: '11px' }}>
                          {role.name_en}
                        </Tag>
                      )}
                      {currentLanguage !== 'ru' && (
                        <Tag color="green" style={{ margin: 0, fontSize: '11px' }}>
                          {role.name_ru}
                        </Tag>
                      )}
                      {currentLanguage !== 'tr' && (
                        <Tag color="orange" style={{ margin: 0, fontSize: '11px' }}>
                          {role.name_tr}
                        </Tag>
                      )}
                    </Space>
                  </div>
                ),
              }))}
              suffixIcon={<TeamOutlined style={{ color: '#bfbfbf' }} />}
              notFoundContent={
                isLoadingRoles ? (
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <TeamOutlined spin style={{ fontSize: '24px', color: '#1890ff' }} />
                    <div style={{ marginTop: 8, color: '#8c8c8c' }}>{t('team.createUserModal.loadingRoles')}</div>
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <TeamOutlined style={{ fontSize: '24px', color: '#d9d9d9' }} />
                    <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                      {t('team.createUserModal.noRolesFound')}
                    </div>
                  </div>
                )
              }
              style={{ width: '100%' }}
            />
          </Form.Item>
          <div style={{
            padding: '12px',
            background: isDarkMode ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.05)',
            borderRadius: '6px',
            border: `1px solid ${isDarkMode ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.15)'}`,
            marginTop: '-8px'
          }}>
            <Space size={4} align="start">
              <TeamOutlined style={{ color: '#1890ff', marginTop: '2px' }} />
              <div style={{ fontSize: '12px', color: isDarkMode ? '#91d5ff' : '#096dd9' }}>
                <strong>{t('team.createUserModal.tipTitle')}</strong> {t('team.createUserModal.tipDescription')}
              </div>
            </Space>
          </div>
        </div>

        {/* Status */}
        <div style={{
          padding: '20px',
          background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`
        }}>
          <h3 style={{ marginBottom: 16, fontSize: '16px', fontWeight: 600, color: isDarkMode ? '#fff' : '#000' }}>
            <CheckCircleOutlined style={{ marginRight: 8, color: '#faad14' }} />
            {t('team.createUserModal.accountStatus')}
          </h3>
          <Form.Item
            name="isActive"
            label={
              <span style={{ fontWeight: 500, fontSize: '14px' }}>
                {t('team.createUserModal.activeStatus')}
              </span>
            }
            valuePropName="checked"
            tooltip={t('team.createUserModal.activeStatusTooltip')}
          >
            <Switch
              checkedChildren={t('team.createUserModal.active')}
              unCheckedChildren={t('team.createUserModal.inactive')}
              size="default"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
