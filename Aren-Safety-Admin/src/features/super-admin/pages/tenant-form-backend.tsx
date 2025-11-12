/**
 * Tenant Create/Edit Form Page (Backend)
 */
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Card, Space, message, Divider } from 'antd';
import { ArrowLeft, Save } from 'lucide-react';
import styled from 'styled-components';
import {
  useCreateTenantMutation,
  useTenantQuery,
  useUpdateTenantMutation,
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

const FormCard = styled(Card)`
  max-width: 800px;
`;

export default function TenantFormBackendPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();
  const isEditMode = !!tenantId;
  const [form] = Form.useForm();

  const { data: tenant, isLoading } = useTenantQuery(tenantId || '');
  const createTenant = useCreateTenantMutation();
  const updateTenant = useUpdateTenantMutation(tenantId || '');

  useEffect(() => {
    if (isEditMode && tenant) {
      form.setFieldsValue({ slug: tenant.slug, title: tenant.title });
    }
  }, [isEditMode, tenant, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode && tenantId) {
        await updateTenant.mutateAsync({ slug: values.slug, title: values.title });
        message.success(t('superAdmin.tenants.form.updateSuccess', 'Tenant updated'));
      } else {
        await createTenant.mutateAsync({
          slug: values.slug,
          title: values.title,
          adminLogin: values.adminLogin || undefined,
          adminPassword: values.adminPassword || undefined,
          adminFirstName: values.adminFirstName || undefined,
          adminLastName: values.adminLastName || undefined,
          adminEmail: values.adminEmail || undefined,
        });
        message.success(t('superAdmin.tenants.form.createSuccess', 'Tenant created'));
      }
      navigate('/super-admin/tenants');
    } catch (e) {
      message.error(t('superAdmin.tenants.form.error', 'Failed to save tenant'));
    }
  };

  return (
    <div>
      <PageHeader>
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/super-admin/tenants')}
          style={{ marginBottom: 16 }}
        >
          {t('common.back', 'Back to Tenants')}
        </Button>

        <PageTitle>
          {isEditMode
            ? t('superAdmin.tenants.form.editTitle', 'Edit Tenant')
            : t('superAdmin.tenants.form.createTitle', 'Create New Tenant')}
        </PageTitle>
        <PageDescription>
          {isEditMode
            ? t('superAdmin.tenants.form.editDescription', 'Update tenant information')
            : t('superAdmin.tenants.form.createDescription', 'Create tenant and initial admin (optional)')}
        </PageDescription>
      </PageHeader>

      <FormCard>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{}}
        >
          <Form.Item
            name="title"
            label={t('superAdmin.tenants.form.title', 'Organization Title')}
            rules={[{ required: true, message: t('superAdmin.tenants.form.titleRequired', 'Please enter title') }]}
          >
            <Input placeholder="ACME" size="large" />
          </Form.Item>

          <Form.Item
            name="slug"
            label={t('superAdmin.tenants.form.slug', 'Tenant Slug')}
            tooltip={t('superAdmin.tenants.form.slugTooltip', 'Used in URL: /t/your-slug')}
            rules={[
              { required: true, message: t('superAdmin.tenants.form.slugRequired', 'Please enter slug') },
              { pattern: /^[a-z0-9-]+$/, message: t('superAdmin.tenants.form.slugPattern', 'Use lowercase letters, numbers and hyphens') },
            ]}
          >
            <Input placeholder="acme" disabled={isEditMode} size="large" addonBefore="/t/" />
          </Form.Item>

          {!isEditMode && (
            <>
              <Divider />
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
            </>
          )}

          <Form.Item>
            <Space>
              <Button onClick={() => navigate('/super-admin/tenants')}>{t('common.cancel', 'Cancel')}</Button>
              <Button type="primary" htmlType="submit" icon={<Save size={16} />} loading={createTenant.isPending || updateTenant.isPending}>
                {t('common.save', 'Save')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </FormCard>
    </div>
  );
}

