/**
 * Tenant Create/Edit Form Page
 *
 * Form to create new tenants or edit existing ones
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Space,
  message,
  Switch,
  InputNumber,
  Divider,
  Alert,
} from 'antd';
import { ArrowLeft, Save } from 'lucide-react';
import styled from 'styled-components';
import { MOCK_PLANS } from '../../../shared/config/mock-plans';
import { getTenantById } from '../../../shared/config/mock-tenants';
import type { CreateTenantInput } from '../../../shared/types/tenant';

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

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 16px 0;

  &:first-child {
    margin-top: 0;
  }
`;

export default function TenantFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [startWithTrial, setStartWithTrial] = useState(true);

  const isEditMode = !!tenantId;

  // Load tenant data in edit mode
  useEffect(() => {
    if (isEditMode && tenantId) {
      const tenant = getTenantById(tenantId);
      if (tenant) {
        form.setFieldsValue({
          name: tenant.name,
          slug: tenant.slug,
          ownerEmail: tenant.ownerEmail,
          planId: tenant.planId,
          defaultLocale: tenant.defaultLocale,
          billingEmail: tenant.billingEmail,
        });
      }
    }
  }, [isEditMode, tenantId, form]);

  // Generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEditMode) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setFieldValue('slug', slug);
    }
  };

  // Handle form submission
  const handleSubmit = async (_values: CreateTenantInput) => {
    setLoading(true);

    try {
      // TODO: API call to create/update tenant
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      if (isEditMode) {
        message.success(
          t('superAdmin.tenants.form.updateSuccess', 'Tenant updated successfully')
        );
      } else {
        message.success(
          t(
            'superAdmin.tenants.form.createSuccess',
            'Tenant created successfully. Invitation email sent to owner.'
          )
        );
      }

      navigate('/super-admin/tenants');
    } catch (error) {
      message.error(
        t(
          'superAdmin.tenants.form.error',
          'Failed to save tenant. Please try again.'
        )
      );
    } finally {
      setLoading(false);
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
            ? t(
                'superAdmin.tenants.form.editDescription',
                'Update tenant information and settings'
              )
            : t(
                'superAdmin.tenants.form.createDescription',
                'Create a new customer tenant with initial owner account'
              )}
        </PageDescription>
      </PageHeader>

      <FormCard>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            defaultLocale: 'en',
            startWithTrial: true,
            trialDays: 14,
          }}
        >
          {/* Tenant Information */}
          <SectionTitle>
            {t('superAdmin.tenants.form.tenantInfo', 'Tenant Information')}
          </SectionTitle>

          <Form.Item
            name="name"
            label={t('superAdmin.tenants.form.name', 'Organization Name')}
            rules={[
              {
                required: true,
                message: t(
                  'superAdmin.tenants.form.nameRequired',
                  'Please enter organization name'
                ),
              },
            ]}
          >
            <Input
              placeholder="ACME Construction"
              onChange={handleNameChange}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label={t('superAdmin.tenants.form.slug', 'Tenant Slug')}
            tooltip={t(
              'superAdmin.tenants.form.slugTooltip',
              'Used in URL: /t/your-slug. Must be unique and lowercase.'
            )}
            rules={[
              {
                required: true,
                message: t(
                  'superAdmin.tenants.form.slugRequired',
                  'Please enter tenant slug'
                ),
              },
              {
                pattern: /^[a-z0-9-]+$/,
                message: t(
                  'superAdmin.tenants.form.slugPattern',
                  'Only lowercase letters, numbers, and hyphens allowed'
                ),
              },
            ]}
          >
            <Input
              placeholder="acme-construction"
              disabled={isEditMode}
              size="large"
              addonBefore="/t/"
            />
          </Form.Item>

          <Divider />

          {/* Owner Information */}
          <SectionTitle>
            {t('superAdmin.tenants.form.ownerInfo', 'Owner Information')}
          </SectionTitle>

          {!isEditMode && (
            <Alert
              type="info"
              message={t(
                'superAdmin.tenants.form.ownerNote',
                'An invitation email will be sent to the owner to set up their account.'
              )}
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item
            name="ownerEmail"
            label={t('superAdmin.tenants.form.ownerEmail', 'Owner Email')}
            rules={[
              {
                required: true,
                message: t(
                  'superAdmin.tenants.form.ownerEmailRequired',
                  'Please enter owner email'
                ),
              },
              {
                type: 'email',
                message: t(
                  'superAdmin.tenants.form.ownerEmailInvalid',
                  'Please enter a valid email'
                ),
              },
            ]}
          >
            <Input
              placeholder="owner@acme.com"
              type="email"
              size="large"
              disabled={isEditMode}
            />
          </Form.Item>

          {!isEditMode && (
            <>
              <Form.Item
                name="ownerFirstName"
                label={t('superAdmin.tenants.form.ownerFirstName', 'Owner First Name')}
                rules={[
                  {
                    required: true,
                    message: t(
                      'superAdmin.tenants.form.ownerFirstNameRequired',
                      'Please enter first name'
                    ),
                  },
                ]}
              >
                <Input placeholder="John" size="large" />
              </Form.Item>

              <Form.Item
                name="ownerLastName"
                label={t('superAdmin.tenants.form.ownerLastName', 'Owner Last Name')}
                rules={[
                  {
                    required: true,
                    message: t(
                      'superAdmin.tenants.form.ownerLastNameRequired',
                      'Please enter last name'
                    ),
                  },
                ]}
              >
                <Input placeholder="Doe" size="large" />
              </Form.Item>
            </>
          )}

          <Divider />

          {/* Plan & Billing */}
          <SectionTitle>
            {t('superAdmin.tenants.form.planBilling', 'Plan & Billing')}
          </SectionTitle>

          <Form.Item
            name="planId"
            label={t('superAdmin.tenants.form.plan', 'Subscription Plan')}
            rules={[
              {
                required: true,
                message: t(
                  'superAdmin.tenants.form.planRequired',
                  'Please select a plan'
                ),
              },
            ]}
          >
            <Select placeholder="Select plan" size="large">
              {MOCK_PLANS.map((plan) => (
                <Select.Option key={plan.id} value={plan.id}>
                  <div>
                    <strong>{plan.displayName.en}</strong>
                    <span style={{ marginLeft: 8, opacity: 0.7 }}>
                      {plan.monthlyPrice === 0
                        ? 'Free'
                        : `$${plan.monthlyPrice / 100}/month`}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {plan.description.en}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {!isEditMode && (
            <>
              <Form.Item
                name="startWithTrial"
                label={t('superAdmin.tenants.form.trial', 'Start with Trial')}
                valuePropName="checked"
              >
                <Switch onChange={setStartWithTrial} />
              </Form.Item>

              {startWithTrial && (
                <Form.Item
                  name="trialDays"
                  label={t('superAdmin.tenants.form.trialDays', 'Trial Period (Days)')}
                >
                  <InputNumber min={1} max={90} size="large" style={{ width: '100%' }} />
                </Form.Item>
              )}
            </>
          )}

          <Form.Item
            name="billingEmail"
            label={t('superAdmin.tenants.form.billingEmail', 'Billing Email (Optional)')}
            tooltip={t(
              'superAdmin.tenants.form.billingEmailTooltip',
              'If different from owner email. Invoices will be sent here.'
            )}
            rules={[
              {
                type: 'email',
                message: t(
                  'superAdmin.tenants.form.billingEmailInvalid',
                  'Please enter a valid email'
                ),
              },
            ]}
          >
            <Input placeholder="billing@acme.com" type="email" size="large" />
          </Form.Item>

          <Divider />

          {/* Settings */}
          <SectionTitle>
            {t('superAdmin.tenants.form.settings', 'Default Settings')}
          </SectionTitle>

          <Form.Item
            name="defaultLocale"
            label={t('superAdmin.tenants.form.defaultLocale', 'Default Language')}
          >
            <Select size="large">
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="ru">Русский (Russian)</Select.Option>
              <Select.Option value="tr">Türkçe (Turkish)</Select.Option>
            </Select>
          </Form.Item>

          {/* Actions */}
          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<Save size={16} />}
                loading={loading}
                size="large"
              >
                {isEditMode
                  ? t('superAdmin.tenants.form.updateButton', 'Update Tenant')
                  : t('superAdmin.tenants.form.createButton', 'Create Tenant')}
              </Button>
              <Button
                onClick={() => navigate('/super-admin/tenants')}
                size="large"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </FormCard>
    </div>
  );
}
