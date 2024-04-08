"use client";

import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Divider, Space, Tag } from "antd";
import { useRef } from "react";
import { list } from "@/services/article";
import Save from "./save";

const columns: ProColumns<any>[] = [
  {
    title: "标题",
    dataIndex: "title",
    copyable: true,
    ellipsis: true,
    tooltip: "标题过长会自动收缩",
    formItemProps: {
      rules: [
        {
          required: true,
          message: "此项为必填项"
        }
      ]
    }
  },
  {
    disable: true,
    title: "状态",
    dataIndex: "state",
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: "select",
    valueEnum: {
      all: { text: "超长".repeat(50) },
      open: {
        text: "未解决",
        status: "Error"
      },
      closed: {
        text: "已解决",
        status: "Success",
        disabled: true
      },
      processing: {
        text: "解决中",
        status: "Processing"
      }
    }
  },
  {
    disable: true,
    title: "标签",
    dataIndex: "labels",
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }: any) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    )
  },
  {
    title: "创建时间",
    key: "showTime",
    dataIndex: "created_at",
    valueType: "date",
    sorter: true,
    hideInSearch: true
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    valueType: "dateRange",
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1]
        };
      }
    }
  },
  {
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => (
      <Space split={<Divider />}>
        <a key="editable" onClick={() => { }}>
          编辑
        </a>
        <a key="view" onClick={() => { }}>
          查看
        </a>
      </Space>
    )
  }
];

export default function List() {
  const actionRef = useRef<ActionType>();
  return (
    <>
      <ProTable<any>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const res: any = await list(params);
          if (res.code === 1) {
            return {
              success: true,
              data: res.data,
              total: 1
            };
          }

          return {
            success: false
          };
        }}
        editable={{
          type: "multiple"
        }}
        rowKey="id"
        search={{
          labelWidth: "auto"
        }}
        headerTitle="文章列表"
        toolBarRender={() => [<Save key="Save" />]}
      />
    </>
  );
}
