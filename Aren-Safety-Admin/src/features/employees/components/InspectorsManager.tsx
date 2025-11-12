import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';
import type { Inspector, InspectorInput } from '../types';

const ManagerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

interface InspectorsManagerProps {
  inspectors: Inspector[];
  summary: {
    count: number;
    totalSites: number;
    regions: number;
  };
  onAdd: (input: InspectorInput) => void;
}

const columns: ColumnsType<Inspector> = [
  {
    title: 'Inspector',
    dataIndex: 'fullName',
    key: 'fullName',
    fixed: 'left',
    width: 200,
    render: (_, record) => (
      <Space direction="vertical" size={0}>
        <span style={{ fontWeight: 600 }}>{record.fullName}</span>
        <span style={{ color: '#64748b' }}>{record.position}</span>
      </Space>
    ),
  },
  {
    title: 'License ID',
    dataIndex: 'licenseId',
    key: 'licenseId',
    width: 160,
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
    width: 140,
    render: (value: string) => <Tag color="blue">{value}</Tag>,
  },
  {
    title: 'Assigned Sites',
    dataIndex: 'assignedSites',
    key: 'assignedSites',
    width: 150,
    sorter: (a, b) => a.assignedSites - b.assignedSites,
  },
  {
    title: 'Last Audit',
    dataIndex: 'lastAuditDate',
    key: 'lastAuditDate',
    width: 150,
  },
  {
    title: 'Contact',
    key: 'contact',
    width: 220,
    render: (_, record) => (
      <Space direction="vertical" size={0}>
        {record.email && <span>{record.email}</span>}
        {record.phone && <span>{record.phone}</span>}
      </Space>
    ),
  },
];

export function InspectorsManager({ inspectors, summary, onAdd }: InspectorsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<InspectorInput>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onAdd({
        ...values,
        department: 'Compliance Control',
        position: values.position || 'Inspector',
      });
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // validation errors automatically displayed
    }
  };

  return (
    <ManagerWrapper>
      <Row justify="space-between" align="middle">
        <Col>
          <h2 style={{ margin: 0 }}>Compliance Inspectors</h2>
          <span style={{ color: '#64748b' }}>
            Manage occupational safety supervisors and assign audit responsibilities.
          </span>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Add Inspector
          </Button>
        </Col>
      </Row>

      <SummaryRow>
        <Card>
          <Statistic title="Inspectors" value={summary.count} />
        </Card>
        <Card>
          <Statistic title="Regions Covered" value={summary.regions} />
        </Card>
        <Card>
          <Statistic title="Assigned Sites" value={summary.totalSites} />
        </Card>
      </SummaryRow>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={inspectors}
        pagination={{ pageSize: 6, position: ['bottomCenter'] }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title="Register New Inspector"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please enter the inspector name' }]}
          >
            <Input placeholder="Inspector full name" />
          </Form.Item>

          <Form.Item label="Position" name="position">
            <Input placeholder="Role / Title" />
          </Form.Item>

          <Form.Item
            label="License ID"
            name="licenseId"
            rules={[{ required: true, message: 'Please provide a license ID' }]}
          >
            <Input placeholder="License number" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Region"
                name="region"
                rules={[{ required: true, message: 'Please specify region' }]}
              >
                <Input placeholder="Region / Province" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Assigned Sites"
                name="assignedSites"
                rules={[{ required: true, message: 'Please set site count' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Last Audit Date" name="lastAuditDate">
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Invalid email' }]}> 
                <Input placeholder="name@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone" name="phone">
                <Input placeholder="+993 xx xxxxxx" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </ManagerWrapper>
  );
}
