import { Tag, Space, Button, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { TFunction } from "i18next";
import type { i18n } from "i18next";
import type { Observation } from "../types";

const getStatusColor = (status: Observation["status"]) =>
  status === "open" ? "red" : "green";

const getDeadlineColor = (deadline: Observation["deadline"]) =>
  deadline === "on_time" ? "green" : "orange";

export const getObservationColumns = (
  t: TFunction,
  onView?: (record: Observation) => void,
  onEdit?: (record: Observation) => void,
  onDelete?: (record: Observation) => void,
  currentLang: string = 'en',
): ColumnsType<Observation> => [
  {
    title: t("observations.table.columns.id"),
    dataIndex: "id",
    key: "id",
    width: 120,
    fixed: "left",
    align: "center",
  },
  {
    title: t("observations.table.columns.projectCode"),
    dataIndex: "projectCode",
    key: "projectCode",
    width: 130,
  },
  {
    title: t("observations.table.columns.nameSurname"),
    dataIndex: "nameSurname",
    key: "nameSurname",
    width: 150,
  },
  {
    title: t("observations.table.columns.department"),
    dataIndex: "department",
    key: "department",
    width: 150,
    render: (department: Observation["department"]) => (department ? String(department) : '-'),
  },
  {
    title: t("observations.table.columns.nonconformityType"),
    dataIndex: "nonconformityType",
    key: "nonconformityType",
    width: 180,
    render: (type: Observation["nonconformityType"]) =>
      t(`observations.filtersOptions.nonconformity.${type ?? "other"}`),
  },
  {
    title: t("observations.table.columns.observationDate"),
    dataIndex: "observationDate",
    key: "observationDate",
    width: 150,
  },
  {
    title: t("observations.table.columns.riskLevel"),
    dataIndex: "riskLevel",
    key: "riskLevel",
    width: 160,
    align: "center",
    render: (level: number) => {
      let color: string | undefined;
      if (level === 5) color = "red";
      else if (level === 4) color = "orange";
      else if (level === 3) color = "gold";
      else if (level === 2) color = "blue";
      else if (level === 1) color = "green";

      return <Tag color={color}>{level}</Tag>;
    },
    filters: [
      { text: "1", value: 1 },
      { text: "2", value: 2 },
      { text: "3", value: 3 },
      { text: "4", value: 4 },
      { text: "5", value: 5 },
    ],
    filterMode: "tree",
    filterSearch: false,
    onFilter: (value, record) => record.riskLevel === value,
    sorter: (a, b) => a.riskLevel - b.riskLevel,
  },
  {
    title: t("observations.table.columns.status"),
    dataIndex: "status",
    key: "status",
    width: 130,
    align: "center",
    render: (status: Observation["status"]) => (
      <Tag color={getStatusColor(status)}>
        {t(`observations.status.${status}`)}
      </Tag>
    ),
    filters: [
      { text: t("observations.status.open"), value: "open" },
      { text: t("observations.status.closed"), value: "closed" },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: t("observations.table.columns.deadline"),
    dataIndex: "deadline",
    key: "deadline",
    width: 130,
    align: "center",
    render: (deadline: Observation["deadline"]) => (
      <Tag color={getDeadlineColor(deadline)}>
        {t(`observations.deadline.${deadline}`)}
      </Tag>
    ),
    filters: [
      { text: t("observations.deadline.on_time"), value: "on_time" },
      { text: t("observations.deadline.delayed"), value: "delayed" },
    ],
    onFilter: (value, record) => record.deadline === value,
  },
  {
    title: t("observations.table.columns.description"),
    dataIndex: "description",
    key: "description",
    width: 250,
    ellipsis: true,
    render: (_: any, record: Observation) => {
      const description =
        currentLang === 'ru' ? record.description_ru :
        currentLang === 'tr' ? record.description_tr :
        record.description_en;
      return description || '-';
    },
  },
  {
    title: t("observations.table.columns.actions"),
    key: "action",
    width: 160,
    align: "center",
    fixed: "right",
    render: (_: any, record: Observation) => (
      <Space size="small">
        <Tooltip title={t("common.actions.view")}>
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView?.(record)} />
        </Tooltip>
        <Tooltip title={t("common.actions.edit")}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit?.(record)} />
        </Tooltip>
        <Tooltip title={t("common.actions.delete")}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete?.(record)} />
        </Tooltip>
      </Space>
    ),
  },
];

