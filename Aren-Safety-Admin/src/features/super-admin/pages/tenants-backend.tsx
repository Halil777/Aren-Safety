/**
 * Super Admin – Tenants List (Backend)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Table, Button, Space, Card, Modal, Form, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Plus, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import {
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useTenantsQuery,
  type Tenant,
} from '@/features/super-admin/api/tenants';

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

export default function TenantsBackendPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data = [], isLoading } = useTenantsQuery();
  const createTenant = useCreateTenantMutation();
  const deleteTenant = useDeleteTenantMutation();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<Tenant> = [
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Admins',
      key: 'admins',
      render: (_, r) => r.admins?.length ?? 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/super-admin/tenants/${record.id}`)}>
            View
          </Button>
          <Button
            size="small"
            danger
            icon={<Trash2 size={14} />}
            loading={deleteTenant.isPending}
            onClick={() => deleteTenant.mutate(record.id, {
              onSuccess: () => message.success('Tenant deleted'),
              onError: () => message.error('Failed to delete tenant'),
            })}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);
  const submitCreate = async () => {
    try {
      const values = await form.validateFields();
      createTenant.mutate(values, {
        onSuccess: () => {
          message.success('Tenant created');
          form.resetFields();
          closeCreate();
        },
        onError: () => message.error('Failed to create tenant'),
      });
    } catch {}
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>{t('superAdmin.tenants.list.title', 'Tenants')}</PageTitle>
        <PageDescription>
          {t('superAdmin.tenants.list.description', 'Manage all customer tenants')}
        </PageDescription>
      </PageHeader>

      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<Plus size={16} />} onClick={openCreate} loading={createTenant.isPending}>
            {t('superAdmin.tenants.create', 'Create Tenant')}
          </Button>
        </Space>
      </Card>

      <Table<Tenant>
        rowKey={(r) => r.id}
        loading={isLoading}
        columns={columns}
        dataSource={data}
      />

      <Modal
        title={t('superAdmin.tenants.create', 'Create Tenant')}
        open={isCreateOpen}
        onCancel={closeCreate}
        onOk={submitCreate}
        okButtonProps={{ loading: createTenant.isPending }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="slug" label="Slug" rules={[{ required: true, pattern: /^[a-z0-9-]+$/, message: 'lowercase letters, numbers, hyphen' }]}>
            <Input placeholder="acme" />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="ACME" />
          </Form.Item>
          <Form.Item name="adminLogin" label="Initial Admin Login">
            <Input placeholder="owner_login" />
          </Form.Item>
          <Form.Item name="adminPassword" label="Initial Admin Password">
            <Input.Password placeholder="Strong password" />
          </Form.Item>
          <Form.Item name="adminFirstName" label="Initial Admin First Name">
            <Input placeholder="John" />
          </Form.Item>
          <Form.Item name="adminLastName" label="Initial Admin Last Name">
            <Input placeholder="Doe" />
          </Form.Item>
          <Form.Item name="adminEmail" label="Initial Admin Email">
            <Input placeholder="owner@example.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
