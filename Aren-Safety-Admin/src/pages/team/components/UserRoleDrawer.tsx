import React, { useState } from 'react';
import { Drawer, Form, Input, Button, Card, Space, Popconfirm, App, Empty, Spin, Typography, Divider, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, TeamOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useUserRoles, useCreateUserRole, useUpdateUserRole, useDeleteUserRole, type UserRole } from '@/features/user-roles/api';
import { useTheme } from '@/app/providers/theme-provider';

const { Title, Text } = Typography;

interface UserRoleDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const UserRoleDrawer: React.FC<UserRoleDrawerProps> = ({ open, onClose }) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [form] = Form.useForm();

  // State
  const [editingId, setEditingId] = useState<string | null>(null);

  // API hooks
  const { data: userRoles = [], isLoading } = useUserRoles();
  const createMutation = useCreateUserRole();
  const updateMutation = useUpdateUserRole();
  const deleteMutation = useDeleteUserRole();

  // Handlers
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      createMutation.mutate(values, {
        onSuccess: () => {
          message.success(t('team.userRoles.createSuccess'));
          form.resetFields();
        },
        onError: (error: any) => {
          message.error(error.response?.data?.message || t('team.userRoles.createError'));
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEdit = (role: UserRole) => {
    setEditingId(role.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = (id: string, values: { name_en: string; name_ru: string; name_tr: string }) => {
    updateMutation.mutate(
      { id, ...values },
      {
        onSuccess: () => {
          message.success(t('team.userRoles.updateSuccess'));
          setEditingId(null);
        },
        onError: (error: any) => {
          message.error(error.response?.data?.message || t('team.userRoles.updateError'));
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success(t('team.userRoles.deleteSuccess'));
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || t('team.userRoles.deleteError'));
      },
    });
  };

  return (
    <Drawer
      title={
        <Space>
          <TeamOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <span style={{ fontSize: '20px', fontWeight: 600 }}>{t('team.userRoles.title')}</span>
        </Space>
      }
      placement="right"
      width={600}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          padding: '24px',
          background: isDarkMode ? '#141414' : '#f5f5f5'
        }
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Create New Role Form */}
        <Card
          bordered={false}
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }}
        >
          <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
            <PlusOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            {t('team.userRoles.createNewRole')}
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreate}
          >
            <Form.Item
              name="name_en"
              label={<Text strong>{t('team.userRoles.nameEn')}</Text>}
              rules={[{ required: true, message: t('team.userRoles.nameEnRequired') }]}
            >
              <Input
                placeholder={t('team.userRoles.nameEnPlaceholder')}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="name_ru"
              label={<Text strong>{t('team.userRoles.nameRu')}</Text>}
              rules={[{ required: true, message: t('team.userRoles.nameRuRequired') }]}
            >
              <Input
                placeholder={t('team.userRoles.nameRuPlaceholder')}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="name_tr"
              label={<Text strong>{t('team.userRoles.nameTr')}</Text>}
              rules={[{ required: true, message: t('team.userRoles.nameTrRequired') }]}
            >
              <Input
                placeholder={t('team.userRoles.nameTrPlaceholder')}
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              size="large"
              block
              loading={createMutation.isPending}
            >
              {t('team.userRoles.createRole')}
            </Button>
          </Form>
        </Card>

        <Divider style={{ margin: '8px 0' }}>
          <Text type="secondary">{t('team.userRoles.existingRoles')}</Text>
        </Divider>

        {/* Roles List */}
        <div
          style={{
            maxHeight: 'calc(100vh - 480px)',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
          <Spin spinning={isLoading} tip={t('team.userRoles.loadingRoles')}>
            {userRoles.length === 0 ? (
              <Empty
                description={t('team.userRoles.noRolesYet')}
                style={{ padding: '40px 0' }}
              />
            ) : (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {userRoles.map((role) => (
                  <UserRoleCard
                    key={role.id}
                    role={role}
                    isEditing={editingId === role.id}
                    onEdit={() => handleEdit(role)}
                    onCancelEdit={handleCancelEdit}
                    onUpdate={handleUpdate}
                    onDelete={() => handleDelete(role.id)}
                    isDeleting={deleteMutation.isPending}
                    isUpdating={updateMutation.isPending}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </Space>
            )}
          </Spin>
        </div>
      </Space>
    </Drawer>
  );
};

// User Role Card Component
interface UserRoleCardProps {
  role: UserRole;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, values: { name_en: string; name_ru: string; name_tr: string }) => void;
  onDelete: () => void;
  isDeleting: boolean;
  isUpdating: boolean;
  isDarkMode: boolean;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({
  role,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  isDeleting,
  isUpdating,
  isDarkMode
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onUpdate(role.id, values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  if (isEditing) {
    return (
      <Card
        bordered={false}
        style={{
          boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
          borderRadius: '8px',
          border: '2px solid #1890ff'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name_en: role.name_en,
            name_ru: role.name_ru,
            name_tr: role.name_tr
          }}
        >
          <Form.Item
            name="name_en"
            label={<Text strong>{t('team.userRoles.nameEn')}</Text>}
            rules={[{ required: true, message: t('team.userRoles.nameEnRequired') }]}
            style={{ marginBottom: 12 }}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="name_ru"
            label={<Text strong>{t('team.userRoles.nameRu')}</Text>}
            rules={[{ required: true, message: t('team.userRoles.nameRuRequired') }]}
            style={{ marginBottom: 12 }}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="name_tr"
            label={<Text strong>{t('team.userRoles.nameTr')}</Text>}
            rules={[{ required: true, message: t('team.userRoles.nameTrRequired') }]}
            style={{ marginBottom: 16 }}
          >
            <Input size="large" />
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              icon={<CloseOutlined />}
              onClick={onCancelEdit}
            >
              {t('team.userRoles.cancel')}
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={isUpdating}
            >
              {t('team.userRoles.save')}
            </Button>
          </Space>
        </Form>
      </Card>
    );
  }

  return (
    <Card
      bordered={false}
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      hoverable
      actions={[
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined style={{ color: '#1890ff' }} />}
          onClick={onEdit}
        >
          {t('team.userRoles.editRole')}
        </Button>,
        <Popconfirm
          key="delete"
          title={t('team.userRoles.deleteConfirm')}
          description={t('team.userRoles.deleteConfirmDescription')}
          onConfirm={onDelete}
          okText={t('team.userRoles.yes')}
          cancelText={t('team.userRoles.no')}
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={isDeleting}
          >
            {t('team.userRoles.deleteRole')}
          </Button>
        </Popconfirm>
      ]}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 8 }}>
          <TeamOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <Text strong style={{ fontSize: '16px' }}>{role.name_en}</Text>
        </div>

        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag color="blue">EN</Tag>
            <Text>{role.name_en}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag color="green">RU</Tag>
            <Text>{role.name_ru}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag color="orange">TR</Tag>
            <Text>{role.name_tr}</Text>
          </div>
        </Space>

        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('team.userRoles.created')}: {new Date(role.createdAt).toLocaleDateString()}
        </Text>
      </Space>
    </Card>
  );
};
