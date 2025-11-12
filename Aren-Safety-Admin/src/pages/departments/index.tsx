import { useMemo, useState } from "react";
import { useTheme } from "@/app/providers/theme-provider";
import { PageContainer } from "@/features/departments";
import {
  exportToExcel,
  exportToPDF,
  printTable,
} from "@/shared/utils/export-utils";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Table,
  message,
  Spin,
  Switch,
  Tag,
} from "antd";
import { Plus, Trash2, Edit, Eye, FileDown, Printer } from "lucide-react";
import {
  useDepartmentsQuery as useBackendDepartments,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  type Department,
} from "@/features/tenant/api/departments";
import { useTranslation } from "react-i18next";

export function DepartmentsPage() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [searchText, setSearchText] = useState("");
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: backendList = [], isLoading: backendLoading } =
    useBackendDepartments();
  const createDepartment = useCreateDepartmentMutation();
  const updateDepartment = useUpdateDepartmentMutation();
  const deleteDepartment = useDeleteDepartmentMutation();

  // Filter departments based on search text
  const filteredDepartments = useMemo(() => {
    if (!searchText) return backendList;
    const lowerSearch = searchText.toLowerCase();
    return backendList.filter(
      (dept) =>
        dept.title_en.toLowerCase().includes(lowerSearch) ||
        dept.title_ru.toLowerCase().includes(lowerSearch) ||
        dept.title_tr.toLowerCase().includes(lowerSearch)
    );
  }, [backendList, searchText]);

  const columns = useMemo(
    () => [
      { title: "Title (EN)", dataIndex: "title_en", key: "title_en" },
      { title: "Title (RU)", dataIndex: "title_ru", key: "title_ru" },
      { title: "Title (TR)", dataIndex: "title_tr", key: "title_tr" },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: boolean) => (
          <Tag color={status ? "green" : "red"}>
            {status ? "Active" : "Inactive"}
          </Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, record: Department) => (
          <Space>
            <Button
              size="small"
              icon={<Eye size={14} />}
              onClick={() => {
                setSelectedDepartment(record);
                setViewModalOpen(true);
              }}
            ></Button>
            <Button
              size="small"
              icon={<Edit size={14} />}
              onClick={() => {
                setSelectedDepartment(record);
                editForm.setFieldsValue(record);
                setEditModalOpen(true);
              }}
            ></Button>
            <Button
              danger
              size="small"
              icon={<Trash2 size={14} />}
              loading={deleteDepartment.isPending}
              onClick={() =>
                deleteDepartment.mutate(record.id, {
                  onSuccess: () =>
                    message.success("Department deleted successfully"),
                })
              }
            ></Button>
          </Space>
        ),
      },
    ],
    [deleteDepartment.isPending, editForm]
  );

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      await createDepartment.mutateAsync(values);
      message.success("Department created successfully");
      createForm.resetFields();
      setCreateModalOpen(false);
    } catch {}
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!selectedDepartment) return;
      await updateDepartment.mutateAsync({
        id: selectedDepartment.id,
        payload: values,
      });
      message.success("Department updated successfully");
      editForm.resetFields();
      setEditModalOpen(false);
      setSelectedDepartment(null);
    } catch {}
  };

  const handleExportExcel = () => {
    exportToExcel({
      filename: "departments",
      title: "Departments List",
      columns: [
        { header: "Title (EN)", dataIndex: "title_en" },
        { header: "Title (RU)", dataIndex: "title_ru" },
        { header: "Title (TR)", dataIndex: "title_tr" },
        { header: "Status", dataIndex: "status" },
      ],
      data: filteredDepartments.map((dept) => ({
        ...dept,
        status: dept.status ? "Active" : "Inactive",
      })),
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      filename: "departments",
      title: "Departments Report",
      columns: [
        { header: "Title (EN)", dataIndex: "title_en" },
        { header: "Title (RU)", dataIndex: "title_ru" },
        { header: "Title (TR)", dataIndex: "title_tr" },
        { header: "Status", dataIndex: "status" },
      ],
      data: filteredDepartments.map((dept) => ({
        ...dept,
        status: dept.status ? "Active" : "Inactive",
      })),
    });
  };

  const handlePrint = () => {
    printTable({
      filename: "departments",
      title: "Departments Report",
      columns: [
        { header: "Title (EN)", dataIndex: "title_en" },
        { header: "Title (RU)", dataIndex: "title_ru" },
        { header: "Title (TR)", dataIndex: "title_tr" },
        { header: "Status", dataIndex: "status" },
      ],
      data: filteredDepartments.map((dept) => ({
        ...dept,
        status: dept.status ? "Active" : "Inactive",
      })),
    });
  };

  if (backendLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <PageContainer $isDark={isDark}>
      <Card
        title={
          <div style={{ fontSize: "18px", fontWeight: 600 }}>
            Departments Management
          </div>
        }
      >
        <Space
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Space>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setCreateModalOpen(true)}
              loading={createDepartment.isPending}
            >
              Create Department
            </Button>
            <Button icon={<FileDown size={16} />} onClick={handleExportExcel}>
              Excel
            </Button>
            <Button icon={<FileDown size={16} />} onClick={handleExportPDF}>
              PDF
            </Button>
            <Button icon={<Printer size={16} />} onClick={handlePrint}>
              Print
            </Button>
          </Space>
          <Input.Search
            placeholder="Search departments..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Space>
        <Table
          rowKey={(r) => r.id}
          loading={backendLoading}
          dataSource={filteredDepartments}
          columns={columns as any}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* Create Department Modal */}
      <Modal
        title="Create Department"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
        }}
        onOk={handleCreateSubmit}
        okButtonProps={{ loading: createDepartment.isPending }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="title_en"
            label="Title (EN)"
            rules={[{ required: true, message: "Please enter English title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_ru"
            label="Title (RU)"
            rules={[{ required: true, message: "Please enter Russian title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_tr"
            label="Title (TR)"
            rules={[{ required: true, message: "Please enter Turkish title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        title="Edit Department"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedDepartment(null);
          editForm.resetFields();
        }}
        onOk={handleEditSubmit}
        okButtonProps={{ loading: updateDepartment.isPending }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="title_en"
            label="Title (EN)"
            rules={[{ required: true, message: "Please enter English title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_ru"
            label="Title (RU)"
            rules={[{ required: true, message: "Please enter Russian title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_tr"
            label="Title (TR)"
            rules={[{ required: true, message: "Please enter Turkish title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Department Modal */}
      <Modal
        title="View Department"
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedDepartment(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalOpen(false);
              setSelectedDepartment(null);
            }}
          >
            Close
          </Button>,
        ]}
      >
        {selectedDepartment && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div>
              <strong>Title (EN):</strong> {selectedDepartment.title_en}
            </div>
            <div>
              <strong>Title (RU):</strong> {selectedDepartment.title_ru}
            </div>
            <div>
              <strong>Title (TR):</strong> {selectedDepartment.title_tr}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <Tag color={selectedDepartment.status ? "green" : "red"}>
                {selectedDepartment.status ? "Active" : "Inactive"}
              </Tag>
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {new Date(selectedDepartment.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Updated At:</strong>{" "}
              {new Date(selectedDepartment.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
