/**
 * Tenant Detail (Backend)
 */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, Descriptions, Button, Space, Modal, Form, Input, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeft, UserPlus } from 'lucide-react';
import styled from 'styled-components';
import {
  useCreateTenantAdminMutation,
  useTenantQuery,
  type Tenant,
  type TenantAdmin,
} from '@/features/super-admin/api/tenants';

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

export default function TenantDetailBackendPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();
  const { data, isLoading } = useTenantQuery(tenantId || '');
  const createAdmin = useCreateTenantAdminMutation(tenantId || '');
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<TenantAdmin> = [
    { title: 'Login', dataIndex: 'login', key: 'login' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  const submit = async () => {
    try {
      const values = await form.validateFields();
      await createAdmin.mutateAsync(values);
      message.success('Admin created');
      form.resetFields();
      setOpen(false);
    } catch {}
  };

  return (
    <div>
      <PageHeader>
        <Button type="text" icon={<ArrowLeft size={16} />} onClick={() => navigate('/super-admin/tenants')} style={{ marginBottom: 16 }}>
          {t('common.back', 'Back to Tenants')}
        </Button>
        <PageTitle>{t('superAdmin.tenants.detail.title', 'Tenant Detail')}</PageTitle>
      </PageHeader>

      <Card loading={isLoading} style={{ marginBottom: 16 }}>
        {data && (
          <Descriptions bordered size="small" column={1} items={[
            { key: 'title', label: 'Title', children: data.title },
            { key: 'slug', label: 'Slug', children: data.slug },
            { key: 'created', label: 'Created', children: data.createdAt },
            { key: 'updated', label: 'Updated', children: data.updatedAt },
          ]} />
        )}
      </Card>

      <Card
        title="Admins"
        extra={
          <Space>
            <Button type="primary" icon={<UserPlus size={16} />} onClick={() => setOpen(true)}>
              Add Admin
            </Button>
          </Space>
        }
      >
        <Table<TenantAdmin>
          rowKey={(r) => r.id}
          loading={isLoading}
          dataSource={data?.admins || []}
          columns={columns}
          pagination={false}
        />
      </Card>

      <Modal title="Create Tenant Admin" open={open} onCancel={() => setOpen(false)} onOk={submit} okButtonProps={{ loading: createAdmin.isPending }}>
        <Form form={form} layout="vertical">
          <Form.Item name="login" label="Login" rules={[{ required: true }]}> <Input placeholder="owner_login" /> </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}> <Input.Password placeholder="Strong password" /> </Form.Item>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}> <Input placeholder="John" /> </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}> <Input placeholder="Doe" /> </Form.Item>
          <Form.Item name="email" label="Email"> <Input placeholder="owner@example.com" /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

