import { useState } from "react";
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import { useTheme } from "@/app/providers/theme-provider";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/categories/api";
import { useProjectCodesAPI } from "@/features/project-codes/api";
import type { Category } from "@/features/categories/types";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div<{ $isDark: boolean }>`
  padding: 32px;
  min-height: calc(100vh - 72px);
  background: ${({ $isDark }) => ($isDark ? "#0a0f1e" : "#fafbfc")};
  transition: all 0.3s ease;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PageTitle = styled.h1<{ $isDark: boolean }>`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, #a5b4fc 0%, #67e8f9 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const PageSubtitle = styled.p<{ $isDark: boolean }>`
  margin: 0;
  font-size: 14px;
  color: ${({ $isDark }) => ($isDark ? "#94a3b8" : "#64748b")};
`;

const StyledButton = styled(Button)<{ $isDark?: boolean }>`
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  height: 40px;
  padding: 0 20px;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableCard = styled.div<{ $isDark: boolean }>`
  border-radius: 16px;
  border: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)"};
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#ffffff")};
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? "0 4px 16px rgba(0, 0, 0, 0.3)"
      : "0 4px 16px rgba(15, 23, 42, 0.04)"};
  overflow: hidden;
  padding: 0;
`;

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t, i18n } = useTranslation();

  const { data: categories = [], isLoading } = useCategories();
  const { data: projectCodes = [] } = useProjectCodesAPI();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const currentLang = i18n.language;

  const showModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          categoryData: values,
        });
        message.success("Category updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Category created successfully");
      }

      handleCancel();
    } catch (error) {
      console.error("Failed to save category:", error);
      message.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Category deleted successfully");
    } catch (error) {
      console.error("Failed to delete category:", error);
      message.error("Failed to delete category");
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      render: (id: string) => id.substring(0, 8),
    },
    {
      title: t('projectCode') || "Project Code",
      dataIndex: "projectCode",
      key: "projectCode",
      width: 150,
      fixed: "left",
    },
    {
      title: "Title (EN)",
      dataIndex: "title_en",
      key: "title_en",
      width: 200,
    },
    {
      title: "Title (RU)",
      dataIndex: "title_ru",
      key: "title_ru",
      width: 200,
    },
    {
      title: "Title (TR)",
      dataIndex: "title_tr",
      key: "title_tr",
      width: 200,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer $isDark={isDark}>
      <PageHeader>
        <HeaderLeft>
          <PageTitle $isDark={isDark}>Categories</PageTitle>
          <PageSubtitle $isDark={isDark}>
            Manage categories for your organization
          </PageSubtitle>
        </HeaderLeft>
        <Space size={12}>
          <StyledButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            New Category
          </StyledButton>
        </Space>
      </PageHeader>

      <TableCard $isDark={isDark}>
        <Table
          columns={columns}
          dataSource={categories}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} categories`,
            position: ["bottomCenter"],
          }}
        />
      </TableCard>

      <Modal
        title={editingCategory ? "Edit Category" : "New Category"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="projectCode"
            label="Project Code"
            rules={[{ required: true, message: "Please select a project code" }]}
          >
            <Select
              placeholder="Select project code"
              showSearch
              optionFilterProp="children"
            >
              {projectCodes.map((pc) => (
                <Select.Option key={pc.id} value={pc.code}>
                  {pc.code} - {
                    currentLang === 'en' ? pc.title_en :
                    currentLang === 'ru' ? pc.title_ru :
                    pc.title_tr
                  }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title_en"
            label="Title (English)"
            rules={[{ required: true, message: "Please enter English title" }]}
          >
            <Input placeholder="Enter English title" />
          </Form.Item>

          <Form.Item
            name="title_ru"
            label="Title (Russian)"
            rules={[{ required: true, message: "Please enter Russian title" }]}
          >
            <Input placeholder="Enter Russian title" />
          </Form.Item>

          <Form.Item
            name="title_tr"
            label="Title (Turkish)"
            rules={[{ required: true, message: "Please enter Turkish title" }]}
          >
            <Input placeholder="Enter Turkish title" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
