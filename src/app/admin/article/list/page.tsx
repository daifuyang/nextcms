"use client";

import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Divider, Space, Tag } from "antd";
import { useRef } from "react";
import { getArticles } from "@/services/article";
import Save from "./save";

const columns: ProColumns<any>[] = [
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "分类",
    dataIndex: "categoryId",
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    hideInSearch: true
  },
  {
    title: "发布人",
    dataIndex: "creator",
    hideInSearch: true
  },
  {
    title: "发布状态",
    dataIndex: "articleStatus",
    renderText(_, record) {
      return record.articleStatus === 1 ? '已发布' : '未发布';
    },
  },
  {
    title: "操作",
    valueType: "option",
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
          const res: any = await getArticles(params);
          if (res.code === 1) {
            return {
              success: true,
              data: res.data.data,
              total: res.data.total
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
        pagination={{
          pageSize: 10
        }}
        headerTitle="文章列表"
        toolBarRender={() => [<Save key="Save" />]}
      />
    </>
  );
}
