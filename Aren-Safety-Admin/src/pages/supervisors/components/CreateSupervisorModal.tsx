import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreateSupervisor } from '@/features/supervisors/api';
import { useProjectCodesAPI } from '@/features/project-codes/api';
import type { CreateSupervisorDto } from '@/shared/types/supervisor';

interface CreateSupervisorModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateSupervisorModal: React.FC<CreateSupervisorModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const createMutation = useCreateSupervisor();
  const { data: projectCodes = [], isLoading: projectCodesLoading } = useProjectCodesAPI();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const supervisorData: CreateSupervisorDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        login: values.login,
        password: values.password,
        email: values.email,
        position: values.position,
        projectIds: values.projectIds || [],
        phone: values.phone,
        department: values.department,
      };

      await createMutation.mutateAsync(supervisorData);
      message.success(t('supervisors.createSuccess'));
      form.resetFields();
      onSuccess();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        // Form validation error
        return;
      }
      message.error(t('supervisors.createError'));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t('supervisors.createSupervisor')}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={createMutation.isPending}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="firstName"
          label={t('supervisors.form.firstName')}
          rules={[{ required: true, message: t('supervisors.form.firstNameRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={t('supervisors.form.lastName')}
          rules={[{ required: true, message: t('supervisors.form.lastNameRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="login"
          label={t('supervisors.form.login')}
          rules={[{ required: true, message: t('supervisors.form.loginRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('supervisors.form.password')}
          rules={[{ required: true, message: t('supervisors.form.passwordRequired') }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('supervisors.form.email')}
          rules={[{ type: 'email', message: t('supervisors.form.emailInvalid') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="position"
          label={t('supervisors.form.position')}
          rules={[{ required: true, message: t('supervisors.form.positionRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="department"
          label={t('supervisors.form.department')}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t('supervisors.form.phone')}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="projectIds"
          label={t('supervisors.form.projects')}
          rules={[{ required: true, message: t('supervisors.form.projectsRequired') }]}
        >
          <Select
            mode="multiple"
            placeholder={t('supervisors.form.projectsPlaceholder')}
            loading={projectCodesLoading}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={projectCodes
              .filter((pc) => pc.status)
              .map((pc) => ({
                value: pc.code,
                label: `${pc.code} - ${
                  i18n.language === 'ru'
                    ? pc.title_ru
                    : i18n.language === 'tr'
                    ? pc.title_tr
                    : pc.title_en
                }`,
              }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
