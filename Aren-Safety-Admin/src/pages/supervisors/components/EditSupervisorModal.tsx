import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useUpdateSupervisor } from '@/features/supervisors/api';
import { useProjectCodesAPI } from '@/features/project-codes/api';
import type { Supervisor, UpdateSupervisorDto } from '@/shared/types/supervisor';

interface EditSupervisorModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  supervisor: Supervisor;
}

export const EditSupervisorModal: React.FC<EditSupervisorModalProps> = ({
  open,
  onCancel,
  onSuccess,
  supervisor,
}) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const updateMutation = useUpdateSupervisor();
  const { data: projectCodes = [], isLoading: projectCodesLoading } = useProjectCodesAPI();

  useEffect(() => {
    if (open && supervisor) {
      form.setFieldsValue({
        firstName: supervisor.firstName,
        lastName: supervisor.lastName,
        login: supervisor.login,
        email: supervisor.email,
        position: supervisor.position,
        projectIds: supervisor.projectIds,
        phone: supervisor.phone,
        department: supervisor.department,
      });
    }
  }, [open, supervisor, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const supervisorData: UpdateSupervisorDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        login: values.login,
        email: values.email,
        position: values.position,
        projectIds: values.projectIds,
        phone: values.phone,
        department: values.department,
      };

      // Only include password if it was changed
      if (values.password) {
        supervisorData.password = values.password;
      }

      await updateMutation.mutateAsync({
        id: supervisor.id,
        supervisorData,
      });
      message.success(t('supervisors.updateSuccess'));
      form.resetFields();
      onSuccess();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        // Form validation error
        return;
      }
      message.error(t('supervisors.updateError'));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t('supervisors.editSupervisor')}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={updateMutation.isPending}
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
          extra={t('supervisors.form.passwordOptional')}
        >
          <Input.Password placeholder={t('supervisors.form.passwordPlaceholder')} />
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
