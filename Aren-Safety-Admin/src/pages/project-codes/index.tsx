import { useMemo, useState } from "react";
import { useTheme } from "@/app/providers/theme-provider";
import { PageContainer } from "@/features/project-codes";
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
  DatePicker,
} from "antd";
import { Plus, Trash2, Edit, Eye, FileDown, Printer } from "lucide-react";
import {
  useProjectCodesQuery as useBackendProjectCodes,
  useCreateProjectCodeMutation,
  useUpdateProjectCodeMutation,
  useDeleteProjectCodeMutation,
  type ProjectCode,
} from "@/features/tenant/api/project-codes";
import dayjs from "dayjs";

export function ProjectCodesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectCode | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: backendList = [], isLoading: backendLoading } =
    useBackendProjectCodes();
  const createProjectCode = useCreateProjectCodeMutation();
  const updateProjectCode = useUpdateProjectCodeMutation();
  const deleteProjectCode = useDeleteProjectCodeMutation();

  // Filter projects based on search text
  const filteredProjects = useMemo(() => {
    if (!searchText) return backendList;
    const lowerSearch = searchText.toLowerCase();
    return backendList.filter(
      (proj) =>
        proj.code.toLowerCase().includes(lowerSearch) ||
        proj.title_en.toLowerCase().includes(lowerSearch) ||
        proj.title_ru.toLowerCase().includes(lowerSearch) ||
        proj.title_tr.toLowerCase().includes(lowerSearch) ||
        proj.client?.toLowerCase().includes(lowerSearch) ||
        proj.headOfProject?.toLowerCase().includes(lowerSearch)
    );
  }, [backendList, searchText]);

  const columns = useMemo(
    () => [
      { title: "Project Code", dataIndex: "code", key: "code", width: 120 },
      {
        title: "Project Name",
        dataIndex: "title_en",
        key: "title_en",
        width: 200,
      },
      { title: "Client", dataIndex: "client", key: "client", width: 150 },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        width: 120,
        render: (date: string) =>
          date ? dayjs(date).format("YYYY-MM-DD") : "-",
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        width: 120,
        render: (date: string) =>
          date ? dayjs(date).format("YYYY-MM-DD") : "-",
      },
      {
        title: "Head of Project",
        dataIndex: "headOfProject",
        key: "headOfProject",
        width: 150,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status: boolean) => (
          <Tag color={status ? "green" : "red"}>
            {status ? "Active" : "Inactive"}
          </Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 200,
        fixed: "right" as const,
        render: (_: any, record: ProjectCode) => (
          <Space>
            <Button
              size="small"
              icon={<Eye size={14} />}
              onClick={() => {
                setSelectedProject(record);
                setViewModalOpen(true);
              }}
            />
            <Button
              size="small"
              icon={<Edit size={14} />}
              onClick={() => {
                setSelectedProject(record);
                editForm.setFieldsValue({
                  ...record,
                  startDate: record.startDate ? dayjs(record.startDate) : null,
                  endDate: record.endDate ? dayjs(record.endDate) : null,
                });
                setEditModalOpen(true);
              }}
            />
            <Button
              danger
              size="small"
              icon={<Trash2 size={14} />}
              loading={deleteProjectCode.isPending}
              onClick={() =>
                deleteProjectCode.mutate(record.id, {
                  onSuccess: () =>
                    message.success("Project deleted successfully"),
                })
              }
            />
          </Space>
        ),
      },
    ],
    [deleteProjectCode.isPending, editForm]
  );

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate
          ? dayjs(values.startDate).toISOString()
          : undefined,
        endDate: values.endDate
          ? dayjs(values.endDate).toISOString()
          : undefined,
      };
      await createProjectCode.mutateAsync(payload);
      message.success("Project created successfully");
      createForm.resetFields();
      setCreateModalOpen(false);
    } catch {}
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!selectedProject) return;
      const payload = {
        ...values,
        startDate: values.startDate
          ? dayjs(values.startDate).toISOString()
          : undefined,
        endDate: values.endDate
          ? dayjs(values.endDate).toISOString()
          : undefined,
      };
      await updateProjectCode.mutateAsync({
        id: selectedProject.id,
        payload,
      });
      message.success("Project updated successfully");
      editForm.resetFields();
      setEditModalOpen(false);
      setSelectedProject(null);
    } catch {}
  };

  const handleExportExcel = () => {
    exportToExcel({
      filename: "project-codes",
      title: "Projects List",
      columns: [
        { header: "Project Code", dataIndex: "code" },
        { header: "Project Name (EN)", dataIndex: "title_en" },
        { header: "Project Name (RU)", dataIndex: "title_ru" },
        { header: "Project Name (TR)", dataIndex: "title_tr" },
        { header: "Client", dataIndex: "client" },
        { header: "Start Date", dataIndex: "startDate" },
        { header: "End Date", dataIndex: "endDate" },
        { header: "Head of Project", dataIndex: "headOfProject" },
        { header: "Status", dataIndex: "status" },
      ],
      data: filteredProjects.map((proj) => ({
        ...proj,
        startDate: proj.startDate
          ? dayjs(proj.startDate).format("YYYY-MM-DD")
          : "-",
        endDate: proj.endDate ? dayjs(proj.endDate).format("YYYY-MM-DD") : "-",
        status: proj.status ? "Active" : "Inactive",
      })),
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      filename: "project-codes",
      title: "Projects Report",
      columns: [
        { header: "Project Code", dataIndex: "code" },
        { header: "Project Name", dataIndex: "title_en" },
        { header: "Client", dataIndex: "client" },
        { header: "Start Date", dataIndex: "startDate" },
        { header: "End Date", dataIndex: "endDate" },
        { header: "Head of Project", dataIndex: "headOfProject" },
        { header: "Status", dataIndex: "status" },
      ],
      data: filteredProjects.map((proj) => ({
        ...proj,
        startDate: proj.startDate
          ? dayjs(proj.startDate).format("YYYY-MM-DD")
          : "-",
        endDate: proj.endDate ? dayjs(proj.endDate).format("YYYY-MM-DD") : "-",
        status: proj.status ? "Active" : "Inactive",
      })),
    });
  };

  const handlePrint = () => {
    printTable({
      filename: "project-codes",
      title: "Projects Report",
      columns: [
        { header: "Project Code", dataIndex: "code" },
        { header: "Project Name", dataIndex: "title_en" },
        { header: "Client", dataIndex: "client" },
        { header: "Start Date", dataIndex: "startDate" },
        { header: "End Date", dataIndex: "endDate" },
        { header: "Head of Project", dataIndex: "headOfProject" },
        { header: "Status", dataIndex: "status" },
      ],
      data: filteredProjects.map((proj) => ({
        ...proj,
        startDate: proj.startDate
          ? dayjs(proj.startDate).format("YYYY-MM-DD")
          : "-",
        endDate: proj.endDate ? dayjs(proj.endDate).format("YYYY-MM-DD") : "-",
        status: proj.status ? "Active" : "Inactive",
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
            Projects Management
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
              loading={createProjectCode.isPending}
            >
              Create Project
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
            placeholder="Search projects..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Space>
        <Table
          rowKey={(r) => r.id}
          loading={backendLoading}
          dataSource={filteredProjects}
          columns={columns as any}
          pagination={{ pageSize: 10 }}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create Project Modal */}
      <Modal
        title="Create Project"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
        }}
        onOk={handleCreateSubmit}
        okButtonProps={{ loading: createProjectCode.isPending }}
        width={700}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="code"
            label="Project Code"
            rules={[{ required: true, message: "Please enter project code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_en"
            label="Project Name (EN)"
            rules={[
              { required: true, message: "Please enter English project name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_ru"
            label="Project Name (RU)"
            rules={[
              { required: true, message: "Please enter Russian project name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_tr"
            label="Project Name (TR)"
            rules={[
              { required: true, message: "Please enter Turkish project name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="client" label="Client">
            <Input />
          </Form.Item>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Form.Item name="startDate" label="Start Date" style={{ flex: 1 }}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="endDate" label="End Date" style={{ flex: 1 }}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Space>
          <Form.Item name="headOfProject" label="Head of Project">
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

      {/* Edit Project Modal */}
      <Modal
        title="Edit Project"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedProject(null);
          editForm.resetFields();
        }}
        onOk={handleEditSubmit}
        okButtonProps={{ loading: updateProjectCode.isPending }}
        width={700}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="code"
            label="Project Code"
            rules={[{ required: true, message: "Please enter project code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_en"
            label="Project Name (EN)"
            rules={[
              { required: true, message: "Please enter English project name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_ru"
            label="Project Name (RU)"
            rules={[
              { required: true, message: "Please enter Russian project name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_tr"
            label="Project Name (TR)"
            rules={[
              { required: true, message: "Please enter Turkish project name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="client" label="Client">
            <Input />
          </Form.Item>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Form.Item name="startDate" label="Start Date" style={{ flex: 1 }}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="endDate" label="End Date" style={{ flex: 1 }}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Space>
          <Form.Item name="headOfProject" label="Head of Project">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Project Modal */}
      <Modal
        title="View Project"
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedProject(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalOpen(false);
              setSelectedProject(null);
            }}
          >
            Close
          </Button>,
        ]}
      >
        {selectedProject && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div>
              <strong>Project Code:</strong> {selectedProject.code}
            </div>
            <div>
              <strong>Project Name (EN):</strong> {selectedProject.title_en}
            </div>
            <div>
              <strong>Project Name (RU):</strong> {selectedProject.title_ru}
            </div>
            <div>
              <strong>Project Name (TR):</strong> {selectedProject.title_tr}
            </div>
            <div>
              <strong>Client:</strong> {selectedProject.client || "-"}
            </div>
            <div>
              <strong>Start Date:</strong>{" "}
              {selectedProject.startDate
                ? dayjs(selectedProject.startDate).format("YYYY-MM-DD")
                : "-"}
            </div>
            <div>
              <strong>End Date:</strong>{" "}
              {selectedProject.endDate
                ? dayjs(selectedProject.endDate).format("YYYY-MM-DD")
                : "-"}
            </div>
            <div>
              <strong>Head of Project:</strong>{" "}
              {selectedProject.headOfProject || "-"}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <Tag color={selectedProject.status ? "green" : "red"}>
                {selectedProject.status ? "Active" : "Inactive"}
              </Tag>
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {dayjs(selectedProject.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </div>
            <div>
              <strong>Updated At:</strong>{" "}
              {dayjs(selectedProject.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
